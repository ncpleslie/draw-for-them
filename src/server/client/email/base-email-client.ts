import { Resend } from "resend";

/**
 * Base email client.
 */
export default abstract class BaseEmailClient {
  protected client: Resend;
  protected fromAddress: string;

  /**
   * Creates an instance of base email client.
   * @param resendApiKey - The Resend API key.
   * @param fromAddress - The fromAddress to send emails from.
   */
  constructor(resendApiKey: string, fromAddress: string) {
    this.client = new Resend(resendApiKey);
    this.fromAddress = fromAddress;
  }

  /**
   * Sends an email with an HTML body.
   * @param to - The email address to send to.
   * @param subject - The subject of the email.
   * @param html - The HTML body of the email.
   * @returns - A promise that resolves when the email is sent.
   */
  protected async sendAsync(to: string, subject: string, html: string) {
    await this.client.emails.send({
      from: this.fromAddress,
      to: to,
      subject: subject,
      html: html,
    });
  }
}
