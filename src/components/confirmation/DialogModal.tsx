/* eslint-disable react/destructuring-assignment */
import { log } from "../../utils/funcs";
import ExitIcon from "./ExitIcon";
import IconButton from "./IconButton";
import YesIcon from "./YesIcon";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
export default function DialogModal(props: Props) {
  const { isOpen, onCancel, onConfirm } = props;

  if (!isOpen) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex border-8 border-sky-500">
      <div className="relative p-8 bg-slate-800 w-full max-w-md m-auto flex-col flex rounded-lg">
        <div>{props.children}</div>
        <span className="absolute top-0 right-0 p-4">
          <IconButton classNameProps="" onClick={() => onCancel()}>
            <ExitIcon />
          </IconButton>
        </span>
        <IconButton classNameProps="mx-auto w-1/2" onClick={() => onConfirm()}>
          <YesIcon />
        </IconButton>
      </div>
    </div>
  );
}
