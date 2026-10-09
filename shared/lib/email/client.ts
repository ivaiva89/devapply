import "server-only";

import { Resend } from "resend";

import { env } from "@/shared/config/server-env";

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

let resend: Resend | undefined;

// Built on first send, not on import: PR previews have no key, and the app
// must still load there.
function client(): Resend {
  if (!env.RESEND_API_KEY) {
    throw new Error("Cannot send email: RESEND_API_KEY is not set");
  }
  resend ??= new Resend(env.RESEND_API_KEY);
  return resend;
}

// Sends one email from EMAIL_FROM. Throws when Resend refuses it, so a caller
// never reports a message as sent that did not go out.
export async function sendEmail(email: OutgoingEmail): Promise<void> {
  const { error } = await client().emails.send({
    from: env.EMAIL_FROM,
    ...email,
  });
  if (error) {
    throw new Error(`Resend refused the email: ${error.message}`);
  }
}
