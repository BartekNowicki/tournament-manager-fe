/* eslint-disable react/destructuring-assignment */

import { useEffect, useState } from "react";
import { log } from "../../utils/funcs";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
}
export default function ActionCompleteModal(props: Props) {
  const { isOpen } = props;

  // useEffect(() => {
  //   log("-----------------------------");
  //   log("RENDERING ACTION CONFIRMATION", isOpen);
  // });

  if (!isOpen) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-slate-800 w-full max-w-md m-auto flex-col flex rounded-lg">
        <div className="flex self-center">{props.children}</div>
      </div>
    </div>
  );
}
