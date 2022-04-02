export default class ButtonBarBtn {
  /**
   *
   */
  constructor(icon: JSX.Element, onClick: () => void, className?: string) {
    this.icon = icon;
    this.onClick = onClick;
    this.className = className;
  }

  public icon: JSX.Element;
  public onClick: () => void;
  public className?: string;
}
