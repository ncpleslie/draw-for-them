import NextAuth, { Theme, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Routes } from "../../../enums/routes.enum";
import { prisma } from "../../../server/domain/db/client";
import { env } from "../../../env/server";
import { Resend } from "resend";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user["id"] = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    // This magic link auth process is based off https://www.ramielcreations.com/nexth-auth-magic-code
    // and https://github.com/nextauthjs/next-auth/issues/4965#issuecomment-1189094806
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      maxAge: 5 * 60,
      name: "email",
      async generateVerificationToken() {
        // This isn't crypto safe.
        // Needs updating
        return [...Array(6)].map((_) => (Math.random() * 10) | 0).join(``);
      },
      async sendVerificationRequest({ identifier: email, url, token, theme }) {
        const { host } = new URL(url);

        const resend = new Resend(env.RESEND_API_KEY);
        await resend.emails.send({
          from: env.EMAIL_FROM,
          to: email,
          subject: `Draw For Them Access Code: ${token}`,
          html: html({ url, host, theme, token }),
        });
      },
    }),
    // {
    //   name: "anonymous",
    //   type: "oauth",
    //   id: "anonymous",
    //   authorization: { params: { prompt: "none" }, url: "" },
    //   profile(profile) {
    //     return { name: "Guest", email: "guest@guest.com", id: "guest" } as User;
    //   },
    // },
  ],
  pages: {
    signIn: Routes.SignIn,
    newUser: Routes.NewUser,
    signOut: Routes.SignOut,
  },
  secret: env.NEXTAUTH_SECRET,
  debug: true,
};

export default NextAuth(authOptions);

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   console.log("ERRRRRO", req.query.error);
//   const isSilentAuthError = req.query.error === "OAuthSignin";

//   if (isSilentAuthError) {
//     res.redirect(302, req.cookies["next-auth.callback-url"] ?? "/");
//     return;
//   }

//   return NextAuth(authOptions)(req, res);
// };

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: {
  url: string;
  host: string;
  theme: Theme;
  token: string;
}) {
  const { url, host, theme, token } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><div
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">${token}</div></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({
  url,
  host,
  token,
}: {
  url: string;
  host: string;
  token: string;
}) {
  return `Sign in to ${host}\n${url}\n\n with magic code: ${token}`;
}
