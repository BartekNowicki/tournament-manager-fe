import { appHeight } from "../utils/settings";

export interface ILocationProps {}

export function Location(props: ILocationProps) {
  return (
    <div className={`flex items-center justify-center ${appHeight}`}>
      <div className="card card-side bg-base-100 shadow-xl">
        <figure>
          <img src="./src/assets/spojnia.jpg" alt="kort" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Lokalizacja</h2>
        </div>
      </div>
    </div>
  );
}
