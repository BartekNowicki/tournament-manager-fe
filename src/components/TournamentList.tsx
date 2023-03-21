/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../storeContent/store";

interface ITournamentListProps {}

const TournamentList: React.FunctionComponent<ITournamentListProps> = (
  props
) => {
  const tournaments = useAppSelector((state) => state.tournament.tournaments);
  const dispatch = useAppDispatch();
  const findById = (id: number) =>
    tournaments.filter((tournament) => tournament.id === id)[0];

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key: number = +e.target.id;
    const tournament = findById(key);
    if (key !== -1) {
      // dispatch(
      //   checkPlayer({
      //     id: player.id,
      //     isChecked: opposite,
      //   })
      // );
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
                <label />
              </th>
              <th className="text text-center">Data</th>
              <th className="text text-center">Rozmiar grupy</th>
              <th className="text text-center">Uwagi</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {/* rows */}
            {tournaments.map((tournament) => (
              <tr key={tournament.id}>
                <th>
                  <label />
                </th>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src="https://img.icons8.com/fluency/96/null/medal.png"
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">
                        {tournament.startDate} - {tournament.endDate}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text text-center">{tournament.groupSize}</td>
                <td className="text text-center">{tournament.comment}</td>
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

export default TournamentList;
