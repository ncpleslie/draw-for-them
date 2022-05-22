export default class UpdateService {
  public static listenForUpdates(): void {}

  public static onUpdateAvailable() {
    console.log("UPDATE");
  }
}
