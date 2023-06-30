import { appHeight } from "../utils/settings";

/* eslint-disable react/button-has-type */
export interface IHomeProps {}

export function Home(props: IHomeProps) {
  return (
    <div className={`flex items-center justify-center ${appHeight}`}>
      {/* <div className="card card-side bg-base-100 shadow-xl">
        <figure>
          <img src="./src/assets/spojnia.jpg" alt="kort" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Zapraszamy na turniej!</h2>
        </div>
      </div> */}
    </div>
  );
}
