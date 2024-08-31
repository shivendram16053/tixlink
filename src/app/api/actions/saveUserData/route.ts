import UserBlink from "@/app/(mongo)/UserSchema";
import {
  createActionHeaders,
  NextActionPostRequest,
  ActionError,
  CompletedAction,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const body: NextActionPostRequest = await req.json();
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId") ?? "";
    const userName = url.searchParams.get("name") ?? "";
    const userEmail = url.searchParams.get("email") ?? "";
    const userRole = url.searchParams.get("role") ?? "";
    const eventImage = url.searchParams.get("eventLogo") ?? "";
    const userId = url.searchParams.get("userId") ?? "";

    let signature: string;
    try {
      signature = body.signature;
      if (!signature) throw "Invalid signature";
    } catch (err) {
      throw 'Invalid "signature" provided';
    }

    try {
      let status = await connection.getSignatureStatus(signature);

      if (!status) throw "Unknown signature status";

      // only accept `confirmed` and `finalized` transactions
      if (status.value?.confirmationStatus) {
        if (
          status.value.confirmationStatus != "confirmed" &&
          status.value.confirmationStatus != "finalized"
        ) {
          throw "Unable to confirm the transaction";
        } else {
          const newUser = new UserBlink({
            userId,
            eventId,
            userName,
            userEmail,
            userRole,
          });

          await newUser.save();
        }
      }

      const transaction = await connection.getParsedTransaction(
        signature,
        "confirmed",
      );

      const payload: CompletedAction = {
        type: "completed",
        title: "Registration successful!",
        icon:eventImage,
        label: "Complete!",
        description:
          `You are now registered for the event`,
      };
  
      return Response.json(payload, {
        headers:ACTIONS_CORS_HEADERS,
      });
    } catch (err) {
      if (typeof err == "string") throw err;
      throw "Unable to confirm the provided signature";
    }
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
