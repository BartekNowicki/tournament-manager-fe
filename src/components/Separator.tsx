import { Player, emptyPlayer } from "../storeContent/storeSlices/playerSlice";
import PlayerInfoColumns from "./PlayerInfoColumns";

interface ISeparatorProps {
  // handleCheck(e: React.ChangeEvent<HTMLInputElement>): void;
  // id: number;
  // isChecked: (id: number) => boolean;
  // player: Player;
  // isDividedIntoGroups: boolean;
}
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const Separator: React.FC<ISeparatorProps> = (): JSX.Element => {
  return (
    <>
      <th>
        {/* <label>
          <input
            type="checkbox"
            className="checkbox"
            id={id.toString()}
            checked={isChecked(id)}
            onChange={handleCheck}
            style={{ display: !isDividedIntoGroups ? "block" : "none" }}
          />
        </label> */}
        bla bla bla
      </th>
      <PlayerInfoColumns player={emptyPlayer} />
    </>
  );
};

export default Separator;
