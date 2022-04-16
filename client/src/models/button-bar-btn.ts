export default class ButtonBarBtn {
  /**
   *
   */
  constructor(
    icon: JSX.Element,
    onClick: () => void,
    className?: string,
    style?: React.CSSProperties,
    nestedButtons?: ButtonBarBtn[]
  ) {
    this.icon = icon;
    this.onClick = onClick;
    this.className = className;
    this.style = style;
    this.nestedButtons = nestedButtons;
  }

  public icon: JSX.Element;
  public onClick: () => void;
  public className?: string;
  public style?: React.CSSProperties;
  public nestedButtons?: ButtonBarBtn[];
}
