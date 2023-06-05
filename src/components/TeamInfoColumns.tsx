import { Player } from "../storeContent/storeSlices/playerSlice";
import { Team } from "../storeContent/storeSlices/teamSlice";

interface ITeamInfoColumnsProps {
  playerOne: Player;
  playerTwo: Player;
  team: Team;
}
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const TeamInfoColumns: React.FC<ITeamInfoColumnsProps> = ({
  playerOne,
  playerTwo,
  team,
}): JSX.Element => {
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
                {playerOne.firstName} {playerOne.lastName} {"       +       "}
                {playerTwo.firstName} {playerTwo.lastName}
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
