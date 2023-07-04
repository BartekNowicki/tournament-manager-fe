import { Player } from "../storeContent/storeSlices/playerSlice";
import { Team } from "../storeContent/storeSlices/teamSlice";
import { findPlayerById, isPlayer } from "../utils/funcs";
import TeamInfoColumns from "./TeamInfoColumns";
import TeamSeparator from "./TeamSeparator";

interface ICheckTeamRowProps {
  players: Player[];
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
  players,
  handleCheck,
  id,
  isChecked,
  team,
  isDividedIntoGroups,
}): JSX.Element => {
  if (id === 999) return <TeamSeparator groupStringId={team.comment} />;
  const playerOne = findPlayerById(players, team.playerOneId);
  const playerTwo = findPlayerById(players, team.playerTwoId);

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
      {playerOne && isPlayer(playerOne) && playerTwo && isPlayer(playerTwo) && (
        <TeamInfoColumns
          players={players}
          playerOneId={team.playerOneId}
          playerTwoId={team.playerTwoId}
          team={team}
        />
      )}
    </>
  );
};

export default CheckTeamRow;
