import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { resend } from "./email";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    cookiePrefix: "my_note_app",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: process.env.SENDER_EMAIL || "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
      if (error) {
        console.error("Error sending email:", error);
      }
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({
        user,
        token,
      }: {
        user: { email: string };
        token: string;
      }) => {
        const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackUrl=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
        const { error } = await resend.emails.send({
          from: process.env.SENDER_EMAIL || "Acme <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email address: ${verificationUrl}`,
          html: ` <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2>Vérification d'email</h2>
            <p>Merci de vous être inscrit! Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous:</p>
            <p>
              <a href="${verificationUrl}"
                style="background-color: #4CAF50; color: white; padding: 10px 15px;
                text-decoration: none; border-radius: 4px; display: inline-block;">
                Vérifier mon adresse email
              </a>
            </p>
            <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur:</p>
            <p>${verificationUrl}</p>
          </div>`,
        });
        if (error) {
          console.error("Error sending email:", error);
        }
      },
    },
  }, // Accolade fermante ajoutée ici pour emailAndPassword
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  plugins: [nextCookies()],
});
