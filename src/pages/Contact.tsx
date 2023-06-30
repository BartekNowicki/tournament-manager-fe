/* eslint-disable react/button-has-type */

import { appHeight } from "../utils/settings";

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IContactProps {}

export function Contact(props: IContactProps) {
  return (
    <div className={`flex items-center justify-center ${appHeight}`}>
      <div className="card card-side bg-base-100 shadow-xl">
        <figure>
          <img src="./src/assets/spojnia.jpg" alt="kort" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Zapraszamy do kontaktu</h2>
        </div>
      </div>
    </div>
  );
}
