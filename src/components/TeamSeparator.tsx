/* eslint-disable jsx-a11y/control-has-associated-label */
// import { emptyPlayer } from "../storeContent/storeSlices/playerSlice";
// import PlayerInfoColumns from "./PlayerInfoColumns";

interface ITeamSeparatorProps {
  groupStringId: string;
}

/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const TeamSeparator: React.FC<ITeamSeparatorProps> = ({
  groupStringId,
}): JSX.Element => {
  return (
    <>
      <th />
      <td>
        <div>
          <div>
            <div />
          </div>
          <div>
            <div> DIS BE THE TEAM SEPARATOR YO!!!
              <p className="font-bold">{`GRUPA ${groupStringId}`}</p>
            </div>
          </div>
        </div>
      </td>
      <td />
      <th />
    </>
  );
};

export default TeamSeparator;
