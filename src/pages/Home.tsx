import { useState } from "react";
import DialogModal from "../components/confirmation/DialogModal";
import { log } from "../utils/funcs";
import { appHeight } from "../utils/settings";

/* eslint-disable react/button-has-type */
export interface IHomeProps {}

export function Home(props: IHomeProps) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(true);
  return (
    <div className={`flex items-center justify-center ${appHeight}`}>
      {/* <div>
        <DialogModal
          title="Potwierdź usunięcie"
          isOpen={confirmModalOpen}
          onCancel={() => {
            setConfirmModalOpen(false);
            log("CANCELLING REQUEST");
          }}
          onConfirm={() => log("usuwam")}
        >
          Czy na pewno chcesz usunąć?
        </DialogModal>
      </div> */}
    </div>
  );
}
