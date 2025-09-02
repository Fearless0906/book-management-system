import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: "warrior@bmsdev.com",
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({ userEmail: user.email, username: user.name, resetUrl: url}),
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [nextCookies()],
});
