import AppConstants from "../../../constants/app.constants";
import BaseEmailClient from "./base-email-client";

/**
 * Email client.
 */
export default class EmailClient extends BaseEmailClient {
  /**
   * Creates an instance of email client.
   * @param emailClientApiKey - The email client API key.
   * @param fromAddress - The address to send emails from.
   */
  constructor(emailClientApiKey: string, fromAddress: string) {
    super(emailClientApiKey, fromAddress);
  }

  /**
   * Sends a verification email.
   * @param to - The email address to send to.
   * @param token - The verification token.
   * @param url - The URL to verify the token at.
   * @param host - The host to display in the email.
   * @returns - A promise that resolves when the email is sent.
   */
  public async sendVerificationAsync(
    to: string,
    token: string,
    url: string,
    host: string
  ) {
    const subject = `${AppConstants.appTitle} Access Code: ${token}`;
    const html = this.generateVerificationHtml(url, host, token);
    await this.sendAsync(to, subject, html);
  }

  /**
   * Email HTML body
   * Insert invisible space into domains from being turned into a hyperlink by email
   * clients like Outlook and Apple mail, as this is confusing because it seems
   * like they are supposed to click on it to sign in.
   */
  private generateVerificationHtml(url: string, host: string, token: string) {
    const escapedHost = host.replace(/\./g, "&#8203;.");
    const brandColor = "#346df1";
    const color = {
      background: "#f9f9f9",
      text: "#444",
      mainBackground: "#fff",
      buttonBackground: brandColor,
      buttonBorder: brandColor,
      buttonText: "#fff",
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
}
