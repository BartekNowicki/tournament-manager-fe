import { Player } from "../storeContent/storeSlices/playerSlice";
import { Team } from "../storeContent/storeSlices/teamSlice";
import { findPlayerById, isPlayer } from "../utils/funcs";

interface ITeamInfoColumnsProps {
  players: Player[];
  playerOneId: number;
  playerTwoId: number;
  team: Team;
}
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const TeamInfoColumns: React.FC<ITeamInfoColumnsProps> = ({
  players,
  playerOneId,
  playerTwoId,
  team,
}): JSX.Element => {
  const p1 = findPlayerById(players, playerOneId);
  const p2 = findPlayerById(players, playerTwoId);

  return (
    <>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img
                src="https://img.icons8.com/fluency/96/null/user-male-circle.png"
                alt="Avatar"
              />
            </div>
          </div>
          <div>
            <div className="font-bold">
              <p>
                {p1 && isPlayer(p1) && p1.firstName}{" "}
                {p1 && isPlayer(p1) && p1.lastName} {"       +       "}
                {p2 && isPlayer(p2) && p2.firstName}{" "}
                {p2 && isPlayer(p2) && p2.lastName}
              </p>
            </div>
          </div>
        </div>
      </td>
      <td className="text text-center">{team.strength}</td>
      <td className="text text-center">{team.comment}</td>
    </>
  );
};

export default TeamInfoColumns;
