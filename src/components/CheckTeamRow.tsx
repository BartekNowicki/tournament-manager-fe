import { Player } from "../storeContent/storeSlices/playerSlice";
import { Team } from "../storeContent/storeSlices/teamSlice";
import PlayerInfoColumns from "./PlayerInfoColumns";
import TeamInfoColumns from "./TeamInfoColumns";

interface ICheckTeamRowProps {
  handleCheck(e: React.ChangeEvent<HTMLInputElement>): void;
  id: number;
  isChecked: (id: number) => boolean;
  team: Team;
  findPlayerById(id: number): Player;
}
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const CheckTeamRow: React.FC<ICheckTeamRowProps> = ({
  handleCheck,
  id,
  isChecked,
  team,
  findPlayerById,
}): JSX.Element => {
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
          />
        </label>
      </th>
      <TeamInfoColumns
        playerOne={findPlayerById(team.playerOneId)}
        playerTwo={findPlayerById(team.playerTwoId)}
        team={team}
      />
    </>
  );
};

export default CheckTeamRow;
