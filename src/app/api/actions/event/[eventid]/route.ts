import {
  ActionError,
  ActionGetResponse,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import EventDataBlink from "@/app/(mongo)/EventSchema";
import { connectToDatabase } from "@/app/(mongo)/db";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  AccountLayout,
} from "@solana/spl-token";
import UserBlink from "@/app/(mongo)/UserSchema";
import { customAlphabet } from "nanoid";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

export const GET = async (req: Request) => {
  await connectToDatabase();
  const { pathname } = new URL(req.url);
  const pathSegments = pathname.split("/");
  const eventId = pathSegments[4];

  const eventDetails = await EventDataBlink.findOne({ eventId: eventId });
  const feesType: string = eventDetails.eventfeesType;
  const fees = eventDetails.eventPrice;

  const price = feesType === "sol" ? `${fees} SOL` : `${fees} SEND`;

  if (!eventDetails) {
    return new Response("Event not found", {
      status: 404,
    });
  }

  const payload: ActionGetResponse = {
    icon: `${eventDetails.eventImage}`,
    title: eventDetails.eventName,
    description: `So here are the details of the event
      Organizer : ${eventDetails.organizerName}
      Date and Time : ${eventDetails.eventDateandTime} 
      Location : ${eventDetails.eventLocation}
      Number of person allowed : ${eventDetails.eventSeats}
      Ticket price : ${price}
      More Info : ${eventDetails.eventDescription}`,
    label: "Join the Event",
    links: {
      actions: [
        {
          label: "Join the event",
          href: `/api/actions/event/${eventId}?name={name}&email={email}&role={choice}`,
          parameters: [
            {
              type: "text",
              name: "name",
              label: "Enter Your Name",
              required: true,
            },
            {
              type: "email",
              name: "email",
              label: "Enter Your Email",
              required: true,
            },
            {
              type: "radio",
              name: "choice",
              label: "Choose the role for the event",
              required: true,
              options: [
                { label: "Speaker", value: "Speaker" },
                { label: "Attendee", value: "Attendee" },
              ],
            },
          ],
        },
      ],
    },
    type: "action",
  };

  return new Response(JSON.stringify(payload), {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    await connectToDatabase();

    const body = (await req.json()) as { account: string; signature: string };
    const userPubkey = new PublicKey(body.account); // Ensure this is a PublicKey
    const url = new URL(req.url);
    const eventId = url.pathname.split("/")[4];
    const name = url.searchParams.get("name") ?? "";
    const email = url.searchParams.get("email") ?? "";
    const role = url.searchParams.get("role") ?? "";
    const generateRandomId = customAlphabet(
      "abcdefghijklmnopqrstuvwxyz123456789",
      8
    );
    const randomId = generateRandomId();

    const eventDetails = await EventDataBlink.findOne({ eventId: eventId });

    if (!eventDetails) {
      return new Response("Event not found", { status: 404 });
    }

    // Fetch the number of registered users for this event
    const registeredUsersCount = await UserBlink.countDocuments({ eventId });

    // Check if the number of participants has reached the limit
    if (registeredUsersCount >= eventDetails.eventSeats) {
      let actionError: ActionError = { message: "Seats are full for event" };
      return new Response(JSON.stringify(actionError), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const fees = eventDetails.eventPrice;
    const feesType = eventDetails.eventfeesType;

    let transaction;

    if (feesType == "send") {
      const tokenMintAddress = new PublicKey(
        "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa"
      );

      // Fetch all token accounts for the user
      const tokenAccounts = await connection.getTokenAccountsByOwner(userPubkey, {
        programId: TOKEN_PROGRAM_ID,
      });

      let userTokenAccount: PublicKey | null = null;
      let userBalance = 0;

      // Find the associated token account for the specified mint
      for (const tokenAccountInfo of tokenAccounts.value) {
        const accountData = AccountLayout.decode(tokenAccountInfo.account.data);
        const mintPublicKey = new PublicKey(accountData.mint);

        if (mintPublicKey.equals(tokenMintAddress)) {
          userTokenAccount = tokenAccountInfo.pubkey;
          userBalance = Number(accountData.amount);
          break;
        }
      }

      if (!userTokenAccount) {
        let actionError: ActionError = { message: "You don't have a token account for SEND" };
        return new Response(JSON.stringify(actionError), {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }

      // Check if the user has enough balance
      if (userBalance < parseFloat(fees)) {
        let actionError: ActionError = { message: "You don't have enough SEND for fees" };
        return new Response(JSON.stringify(actionError), {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }

      // Ensure eventDetails.eventPubKey is a PublicKey
      const organizerPubkey = new PublicKey(eventDetails.eventPubKey);
      const organizerTokenAccounts = await connection.getTokenAccountsByOwner(organizerPubkey, {
        programId: TOKEN_PROGRAM_ID,
      });

      let organizerTokenAccount: PublicKey | null = null;

      // Find the associated token account for the specified mint
      for (const tokenAccountInfo of organizerTokenAccounts.value) {
        const accountData = AccountLayout.decode(tokenAccountInfo.account.data);
        const mintPublicKey = new PublicKey(accountData.mint);

        if (mintPublicKey.equals(tokenMintAddress)) {
          organizerTokenAccount = tokenAccountInfo.pubkey;
          break;
        }
      }

      if (!organizerTokenAccount) {
        let actionError: ActionError = { message: "Organizer does not have a token account for SEND" };
        return new Response(JSON.stringify(actionError), {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }

      // Create the transaction for SEND
      transaction = new Transaction().add(
        createTransferInstruction(
          userTokenAccount, // Source account (user's token account)
          organizerTokenAccount, // Destination account (organizer's token account)
          userPubkey, // Owner of the source account
          fees * 1000000, // Number of tokens to transfer
          [],
          TOKEN_PROGRAM_ID
        )
      );

    } else if (feesType == "sol") {
      // Create the transaction for SOL
      transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: userPubkey,
          toPubkey: new PublicKey(eventDetails.eventPubKey),
          lamports: fees * LAMPORTS_PER_SOL,
        })
      );
    } else {
      let actionError: ActionError = { message: "Invalid fees type" };
      return new Response(JSON.stringify(actionError), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    transaction.feePayer = userPubkey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Thanks ${name} for registering for the event`,
        links: {
          next: {
            type: "post",
            href: `/api/actions/saveUserData?name=${name}&email=${email}&role=${role}&userId=${randomId}&eventId=${eventId}&eventLogo=${eventDetails.eventImage}`,
          },
        },
      },
    });

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
};
