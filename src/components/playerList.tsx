/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { useAppSelector } from "../storeContent/store";
import Player from "./PlayerUnused";

interface IPlayerListProps {}

const PlayerList: React.FunctionComponent<IPlayerListProps> = (props) => {
  const players = useAppSelector((state) => state.player.players);
  const checkedPlayersInitialState = new Map<number, boolean>();
  players.forEach((player) => checkedPlayersInitialState.set(player.id, false));
  checkedPlayersInitialState.set(-1, false);

  const [checkedPlayers, setCheckedPlayers] = React.useState(
    checkedPlayersInitialState
  );

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key: number = +e.target.id;
    const opposite: boolean = checkedPlayers.get(key) !== true;
    if (key !== -1) {
      setCheckedPlayers((prev) => {
        return new Map(prev.set(key, opposite));
      });
    } else {
      const newState = new Map<number, boolean>();
      players.forEach((player) => newState.set(player.id, opposite));
      newState.set(-1, opposite);
      console.log(newState);
      setCheckedPlayers((prev) => {
        return newState;
      });
    }
  };

  return (
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
                    checked={checkedPlayers.get(-1)}
                    onChange={handleCheck}
                  />
                </label>
              </th>
              <th className="text text-center">Imię i Nazwisko</th>
              <th className="text text-center">Siła</th>
              <th className="text text-center">Uwagi</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {/* rows */}
            {players
              .filter((player) => player.id !== -1)
              .map((player) => (
                <tr key={player.id}>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        id={player.id.toString()}
                        checked={checkedPlayers.get(player.id) === true}
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
                          {player.firstName} {player.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text text-center">{player.strength}</td>
                  <td className="text text-center">{player.comment}</td>
                  <th>
                    <button className="btn btn-ghost btn-xs bg-slate-600">
                      edytuj
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
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PlayerList;
