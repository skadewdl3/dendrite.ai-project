import { ReactElement } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function TooltipComponent({
  children,
  text,
  ...props
}: {
  children: ReactElement;
  text: string;
}) {
  const renderTooltip = (props: object) => <Tooltip {...props}>{text}</Tooltip>;

  return (
    <OverlayTrigger placement="top" {...props} overlay={renderTooltip}>
      {children}
    </OverlayTrigger>
  );
}
