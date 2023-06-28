/* eslint-disable jsx-a11y/control-has-associated-label */
import { emptyPlayer } from "../storeContent/storeSlices/playerSlice";
import PlayerInfoColumns from "./PlayerInfoColumns";

interface ISeparatorProps {
  groupStringId: string;
}

/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const Separator: React.FC<ISeparatorProps> = ({
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
            <div>
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

export default Separator;

// ORIG
// import { emptyPlayer } from "../storeContent/storeSlices/playerSlice";
// import PlayerInfoColumns from "./PlayerInfoColumns";

// interface ISeparatorProps {}

// /* eslint-disable react/prop-types */
// /* eslint-disable jsx-a11y/label-has-associated-control */
// /* eslint-disable react/function-component-definition */
// const Separator: React.FC<ISeparatorProps> = (): JSX.Element => {
//   return (
//     <>
//       <th />
//       <td>
//         <div className="flex items-center space-x-3">
//           {/* <div className="avatar"> */}
//           <div>
//             {/* <div className="mask mask-squircle w-12 h-12"> */}
//             <div>
//               {/* <img
//                 src="https://img.icons8.com/fluency/96/null/user-male-circle.png"
//                 alt="Avatar"
//               /> */}
//             </div>
//           </div>
//           <div>
//             <div className="font-bold">
//               <p>GRUPA</p>
//             </div>
//           </div>
//         </div>
//       </td>
//       {/* <td className="text text-center">player.strength</td>
//       <td className="text text-center">player.comment</td> */}
//       <td></td>
//       <td></td>
//     </>
//   );
// };

// export default Separator;
