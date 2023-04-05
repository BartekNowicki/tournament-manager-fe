/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import {
  checkPlayer,
  checkAllPlayers,
  deletePlayer,
} from "../storeContent/storeSlices/playerSlice";

interface IPlayerListProps {
  displayedPlayerUpdater: () => void;
}

const PlayerList: React.FunctionComponent<IPlayerListProps> = ({
  displayedPlayerUpdater,
}) => {
  const changeCount = useAppSelector(
    (state) => state.player.playersChangeCount
  );
  const players = useAppSelector((state) => state.player.players);
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
      return found ? found.isChecked : false;
    },
    [findById]
  );

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const key: number = +e.target.id;
      const opposite: boolean = isChecked(key) !== true;
      const player = findById(key);
      if (key !== -1) {
        dispatch(
          checkPlayer({
            id: player.id,
            isChecked: opposite,
          })
        );
      } else {
        dispatch(
          checkAllPlayers({
            isChecked: opposite,
          })
        );
      }
    },
    [dispatch, findById, isChecked]
  );

  return (
    <>
      {console.log("RENDERING PLAYER LIST")}
      {/* <p>Count: {changeCount}</p> */}

      {/* <div>
        {players.map((pl) => (
          <div key={pl.id}>{pl.id}</div>
        ))}
      </div> */}
      <div className="m-8 border border-sky-500">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
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
                <th className="text text-center">Imię i Nazwisko</th>
                <th className="text text-center">Siła</th>
                <th className="text text-center">Uwagi</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {/* rows */}
              {players.length &&
                players
                  .filter((player) => player.id !== -1)
                  .map((player) => (
                    <tr key={player.id}>
                      <th>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            id={player.id.toString()}
                            checked={isChecked(player.id) === true}
                            onChange={handleCheck}
                          />
                        </label>
                      </th>
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
                    </tr>
                  ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th />
                <th />
                <th />
                <th />
                <th />
                <th />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default PlayerList;
