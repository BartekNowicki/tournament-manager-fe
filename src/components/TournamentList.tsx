/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import { deleteTournament } from "../storeContent/storeSlices/tournamentSlice";
import { getAdjustedDates } from "../utils/dates";
import PlayerList from "./PlayerList";

interface ITournamentListProps {
  displayedTournamentUpdater: () => void;
}

const TournamentList: React.FunctionComponent<ITournamentListProps> = ({
  displayedTournamentUpdater,
}) => {
  const tournaments = useAppSelector((state) => state.tournament.tournaments);
  const dispatch = useAppDispatch();
  const [displayedTournamentId, setDisplayedTournamentId] =
    useState<number>(-1);

  return (
    <>
      {console.log(
        `RENDERING TOURNAMENT LIST with displayed tournament: ${displayedTournamentId}`
      )}
      <div className="m-8 border border-sky-500">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th className="text text-center">Data</th>
                <th className="text text-center">Rodzaj</th>
                <th className="text text-center">Rozmiar grupy</th>
                <th className="text text-center">Uwagi</th>
                <th />
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {/* rows */}
              {Boolean(tournaments.length) &&
                tournaments.map((tournament) => (
                  <tr key={tournament.id}>
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
                            <td>
                              {getAdjustedDates(
                                tournament.startDate,
                                tournament.endDate
                              )}
                            </td>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text text-center">{tournament.type}</td>
                    <td className="text text-center">{tournament.groupSize}</td>
                    <td className="text text-center">{tournament.comment}</td>
                    <th>
                      <button
                        className="btn btn-ghost btn-xs bg-slate-600"
                        onClick={() => {
                          if (displayedTournamentUpdater)
                            displayedTournamentUpdater();
                        }}
                      >
                        <Link
                          to={`/tournaments/addoredit/edit${tournament.id}`}
                        >
                          edytuj
                        </Link>
                      </button>
                    </th>
                    <th>
                      <button
                        className="btn btn-ghost btn-xs bg-slate-600"
                        onClick={(e) => {
                          dispatch(deleteTournament(tournament.id));
                        }}
                      >
                        usuń
                      </button>
                    </th>
                    <th>
                      <button
                        className="btn btn-ghost btn-xs bg-slate-600"
                        onClick={(e) => {
                          setDisplayedTournamentId((prev) => tournament.id);
                        }}
                      >
                        uczestnicy
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
                <th />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {displayedTournamentId > -1 &&
        createPortal(
          <div className="darkModal">
            <button
              className="btn btn-ghost btn-xs bg-slate-600 w-10 h-10 positionMe"
              onClick={() => setDisplayedTournamentId((prev) => -1)}
            >
              x
            </button>

            <div className="m-8 border border-sky-500">
              <div className="overflow-x-auto w-full">
                <table className="table w-full">
                  {/* head */}
                  <thead>
                    <tr>
                      <th className="text text-center">Data</th>
                      <th className="text text-center">Rodzaj</th>
                      <th className="text text-center">Rozmiar grupy</th>
                      <th className="text text-center">Uwagi</th>
                      <th />
                      <th />
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {/* rows */}
                    {Boolean(tournaments.length) &&
                      tournaments.map((tournament) => (
                        <tr key={tournament.id}>
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
                                  <td>
                                    {getAdjustedDates(
                                      tournament.startDate,
                                      tournament.endDate
                                    )}
                                  </td>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text text-center">
                            {tournament.type}
                          </td>
                          <td className="text text-center">
                            {tournament.groupSize}
                          </td>
                          <td className="text text-center">
                            {tournament.comment}
                          </td>
                          <th>
                            <button
                              className="btn btn-ghost btn-xs bg-slate-600"
                              onClick={() => {
                                if (displayedTournamentUpdater)
                                  displayedTournamentUpdater();
                              }}
                            >
                              <Link
                                to={`/tournaments/addoredit/edit${tournament.id}`}
                              >
                                edytuj
                              </Link>
                            </button>
                          </th>
                          <th>
                            <button
                              className="btn btn-ghost btn-xs bg-slate-600"
                              onClick={(e) => {
                                dispatch(deleteTournament(tournament.id));
                              }}
                            >
                              usuń
                            </button>
                          </th>
                          <th>
                            <button
                              className="btn btn-ghost btn-xs bg-slate-600"
                              onClick={() =>
                                setDisplayedTournamentId(
                                  (prev) => tournament.id
                                )
                              }
                            >
                              uczestnicy
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
                      <th />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <PlayerList
              isEditingTournament={true}
              displayedPlayerUpdater={() => {
                console.log("SHOULD CHECK PLAYER ONLY NOT MORE");
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default TournamentList;
