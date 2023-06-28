import { Player } from "../storeContent/storeSlices/playerSlice";
import PlayerInfoColumns from "./PlayerInfoColumns";
import Separator from "./Separator";

interface ICheckPlayerRowProps {
  handleCheck(e: React.ChangeEvent<HTMLInputElement>): void;
  id: number;
  isChecked: (id: number) => boolean;
  player: Player;
  isDividedIntoGroups: boolean;
}
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const CheckPlayerRow: React.FC<ICheckPlayerRowProps> = ({
  handleCheck,
  id,
  isChecked,
  player,
  isDividedIntoGroups,
}): JSX.Element => {
  if (id === 999) return <Separator groupStringId={player.firstName} />;
  return (
    <>
      <th>
        <label>
          <input
            type="checkbox"
            className="checkbox"
            id={id.toString()}
            checked={isChecked(id)}
            onChange={handleCheck}
            style={{ display: !isDividedIntoGroups ? "block" : "none" }}
          />
        </label>
      </th>
      <PlayerInfoColumns player={player} />
    </>
  );
};

export default CheckPlayerRow;
