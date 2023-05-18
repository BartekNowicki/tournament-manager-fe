/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import {
  checkPlayer,
  deletePlayer,
} from "../storeContent/storeSlices/playerSlice";

interface IPlayerListProps {
  displayedPlayerUpdater: () => void;
  isEditingTournamentParticipants: boolean;
  assignPlayersToTournament: () => void;
}

const PlayerList: React.FunctionComponent<IPlayerListProps> = ({
  displayedPlayerUpdater,
  isEditingTournamentParticipants,
  assignPlayersToTournament,
}) => {
  const players = useAppSelector((state) => state.player.players);
  const forceRenderCount = useAppSelector(
    (state) => state.player.forceRerenderPlayerListCount
  );
  const dispatch = useAppDispatch();
  const findById = useCallback(
    (id: number) => {
      return players.filter((player) => player.id === id)[0];
    },
    [players]
  );

  const isChecked = useCallback(
    (id: number): boolean => {
      const found = findById(id);
      // BE has "isChecked" but probably the response entity mutates it to "checked"
      // explicit comparison is required as isChecked is initially undefined and once you check it becomes defined and checked becomes undefined
      return found.checked ? found.checked === true : found.isChecked === true;
    },
    [findById]
  );

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const key: number = +e.target.id;
      const player = findById(key);
      if (key !== -1) {
        dispatch(
          checkPlayer({
            id: player.id,
            isChecked: !isChecked(player.id),
            firstName: player.firstName,
            lastName: player.lastName,
            strength: player.strength,
            comment: player.comment,
          })
        );
      } else {
        const commonOppositeStateForAll = !isChecked(-1);
        // eslint-disable-next-line no-restricted-syntax
        for (const p of players) {
          dispatch(
            checkPlayer({
              id: p.id,
              isChecked: commonOppositeStateForAll,
              firstName: p.firstName,
              lastName: p.lastName,
              strength: p.strength,
              comment: p.comment,
            })
          );
        }
      }
    },
    [dispatch, findById, isChecked, players]
  );
  // this should not be required under normal flow but here we have a tailwind table and that requires an explicit rerender
  useEffect(() => {}, [forceRenderCount]);

  useEffect(() => {
    console.log(`PlayerList showing players`, players, forceRenderCount);
  });

  return (
    <div className="m-8 border border-sky-500 addPlayersPanel">
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              {isEditingTournamentParticipants && (
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      id="-1"
                      checked={isChecked(-1) === true}
                      onChange={handleCheck}
                    />
                  </label>
                </th>
              )}
              <th className="text text-center">Imię i Nazwisko</th>
              <th className="text text-center">Siła</th>
              <th className="text text-center">Uwagi</th>
              {!isEditingTournamentParticipants && <th />}
              {!isEditingTournamentParticipants && <th />}
            </tr>
          </thead>
          <tbody>
            {/* rows */}
            {Boolean(players.length) &&
              players
                .filter((player) => player.id !== -1)
                .map((player) => (
                  <tr key={player.id}>
                    {isEditingTournamentParticipants && (
                      <th>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            id={player.id.toString()}
                            checked={isChecked(player.id)}
                            onChange={handleCheck}
                          />
                        </label>
                      </th>
                    )}
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
                    {!isEditingTournamentParticipants && (
                      <>
                        <th>
                          <button
                            className="btn btn-ghost btn-xs bg-slate-600"
                            onClick={() => {
                              if (displayedPlayerUpdater)
                                displayedPlayerUpdater();
                            }}
                          >
                            <Link to={`/players/addoredit/edit${player.id}`}>
                              edytuj
                            </Link>
                          </button>
                        </th>
                        <th>
                          <button
                            className="btn btn-ghost btn-xs bg-slate-600"
                            onClick={(e) => {
                              dispatch(deletePlayer(player.id));
                            }}
                          >
                            usuń
                          </button>
                        </th>
                      </>
                    )}
                  </tr>
                ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              {!isEditingTournamentParticipants && <th />}
              {!isEditingTournamentParticipants && <th />}
              <th />
              <th />
              <th />
              {isEditingTournamentParticipants && <th />}
            </tr>
          </tfoot>
        </table>

        {isEditingTournamentParticipants && (
          <div>
            <button
              className="btn btn-ghost btn-xs bg-slate-600 positionMeBottomRight"
              onClick={() => assignPlayersToTournament()}
            >
              zapisz uczestników
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerList;
