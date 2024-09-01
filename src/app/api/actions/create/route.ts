import {
  ActionError,
  ActionGetResponse,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import { connectToDatabase } from "@/app/(mongo)/db";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { customAlphabet } from "nanoid";
import { BlinksightsClient } from 'blinksights-sdk';

const client = new BlinksightsClient('b47f052ea8db76797497d7dd6bded8e4c364722939d9c48ea878ada9f42237fb');

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const MY_PUB_KEY = "6rSrLGuhPEpxGqmbZzV1ZttwtLXzGx8V2WEACXd4qnVH";

export const GET = async (req: Request) => {
  
  const payload = await client.createActionGetResponseV1(req.url, {
    icon: `http://tixlink.vercel.app/logo.png`,
    title: "Create Your Event Here",
    description: "Submit all required details",
    label: "Create Event",
    links: {
      actions: [
        {
          label: "Create Event",
          href: `/api/actions/create?name={name}&image={image}&orgname={orgname}&orgemail={orgemail}&date={date}&location={location}&seats={seats}&choice={choice}&fees={fees}&description={description}`,
          parameters: [
            {
              type: "text",
              name: "name",
              label: "Enter Event Name",
              required: true,
            },
            {
              type: "url",
              name: "image",
              label: "Enter Image URL",
              required: true,
            },
            {
              type: "text",
              name: "orgname",
              label: "Enter Oraganizer Name",
              required: true,
            },
            {
              type: "email",
              name: "orgemail",
              label: "Enter Email",
              required: true,
            },
            {
              type: "datetime-local",
              name: "date",
              label: "Enter Date and time",
              required: true,
            },
            {
              type: "text",
              name: "location",
              label: "Enter Event location",
              required: true,
            },
            {
              type: "number",
              name: "seats",
              label: "Number of Persons Allowed",
              required: true,
            },
            {
              type: "radio",
              name: "choice",
              label: "Choose the coin for fees",
              options: [
                { label: "SOL", value: "sol" },
                { label: "SEND", value: "send" },
              ],
            },
            {
              type: "number",
              name: "fees",
              label: "Entry Fees (if applicable)",
            },
            {
              type: "textarea",
              name: "description",
              label: "Enter more Info",
              required: true,
            },
          ],
        },
      ],
    },
    type: "action",
  }) as ActionGetResponse;

  return new Response(JSON.stringify(payload), {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {
      await connectToDatabase();
  
      const body = (await req.json()) as { account: string; signature: string };
      client.trackActionV2(body.account, req.url);
      const eventPubKey = new PublicKey(body.account); // Ensure this is a PublicKey
      const url = new URL(req.url);
      const name = url.searchParams.get("name") ?? "";
      const image = url.searchParams.get("image") ?? "";
      const orgname = url.searchParams.get("orgname") ?? "";
      const orgemail = url.searchParams.get("orgemail") ?? "";
      const date = url.searchParams.get("date") ?? "";
      const location = url.searchParams.get("location") ?? "";
      const seats = url.searchParams.get("seats") ?? "";
      const choice = url.searchParams.get("choice") ?? "";
      const fees = url.searchParams.get("fees") ?? "";
      const description = url.searchParams.get("description") ?? "";
      const generateRandomId = customAlphabet(
        "abcdefghijklmnopqrstuvwxyz123456789",
        8
      );
      const randomId = generateRandomId();
  
      
      // Create the transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: eventPubKey,
          toPubkey: new PublicKey(MY_PUB_KEY),
          lamports: 0, 
        })
      );
  
      transaction.feePayer = eventPubKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
  
      // Save the user to the UserSchema
    
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: `Your Event has been created, Share it now`,
          links: {
            next: {
              type: "post",
              href: `/api/actions/saveEventData?name=${name}&image=${image}&orgname=${orgname}&orgemail=${orgemail}&date=${date}&location=${location}&seats=${seats}&choice=${choice}&fees=${fees}&description=${description}&eventId=${randomId}`,
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
