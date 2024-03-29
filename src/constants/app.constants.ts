/**
 * A class that contains all the constants used in the application.
 */
export default class AppConstants {
  /**
   * The default image format used in the application.
   */
  public static readonly defaultImageFormat = "png";

  /**
   * Default name of the application.
   */
  public static readonly appTitle = "Draw For Them";

  /**
   * Default description of the application.
   */
  public static readonly appDescription =
    "An ephemeral image sharing social network";

  /**
   * The max session age in seconds
   * 30 days.
   */
  public static readonly maxSessionAgeInSecs = 60 * 60 * 24 * 30;
}
