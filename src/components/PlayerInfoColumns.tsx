import { Player } from "../storeContent/storeSlices/playerSlice";

interface IPlayerInfoColumnsProps {
  player: Player;
}
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const PlayerInfoColumns: React.FC<IPlayerInfoColumnsProps> = ({
  player,
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
                {player.firstName} {player.lastName}
              </p>
            </div>
          </div>
        </div>
      </td>
      <td className="text text-center">{player.strength}</td>
      <td className="text text-center">{player.comment}</td>
    </>
  );
};

export default PlayerInfoColumns;
