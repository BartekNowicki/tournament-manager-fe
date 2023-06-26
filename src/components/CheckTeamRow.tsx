import { useAppSelector } from "../storeContent/store";
import { Player } from "../storeContent/storeSlices/playerSlice";
import { Team } from "../storeContent/storeSlices/teamSlice";
import { findPlayerById } from "../utils/funcs";
import TeamInfoColumns from "./TeamInfoColumns";

interface ICheckTeamRowProps {
  handleCheck(e: React.ChangeEvent<HTMLInputElement>): void;
  id: number;
  isChecked: (id: number) => boolean;
  team: Team;
  isDividedIntoGroups: boolean;
}
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const CheckTeamRow: React.FC<ICheckTeamRowProps> = ({
  handleCheck,
  id,
  isChecked,
  team,
  isDividedIntoGroups,
}): JSX.Element => {
  const players = useAppSelector((state) => state.player.players);
  const playerOne: Player = findPlayerById(players, team.playerOneId);
  const playerTwo: Player = findPlayerById(players, team.playerTwoId);

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
      {playerOne && playerTwo && (
        <TeamInfoColumns
          playerOne={playerOne}
          playerTwo={playerTwo}
          team={team}
        />
      )}
    </>
  );
};

export default CheckTeamRow;
