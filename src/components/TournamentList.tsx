/* eslint-disable no-console */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import {
  assignPlayersToTournament,
  deleteTournament,
  fetchAllTournaments,
} from "../storeContent/storeSlices/tournamentSlice";
import { getAdjustedDates } from "../utils/dates";
import PlayerList from "./PlayerList";
import {
  checkPlayer,
  fetchAllPlayers,
} from "../storeContent/storeSlices/playerSlice";

interface ITournamentListProps {
  idOfTournamentDisplayedForEditingData: number;
  displayedTournamentUpdater: () => void;
}

const TournamentList: React.FunctionComponent<ITournamentListProps> = ({
  idOfTournamentDisplayedForEditingData,
  displayedTournamentUpdater,
}) => {
  const tournaments = useAppSelector((state) => state.tournament.tournaments);
  const players = useAppSelector((state) => state.player.players);
  const dispatch = useAppDispatch();
  const [
    idOfTournamentDisplayedForEditingParticipants,
    setIdOfTournamentDisplayedForEditingParticipants,
  ] = useState<number>(-1);

  const isAddingOrEditingTournamentMode = () =>
    idOfTournamentDisplayedForEditingData !== -1;

  const injectHeaders = () => (
    <>
      <th className="text text-center">Data</th>
      <th className="text text-center">Rodzaj</th>
      <th className="text text-center">Rozmiar grupy</th>
      <th className="text text-center">Uwagi</th>
    </>
  );

  const highlighted = () => "border-solid border-2 border-sky-500";

  const matchPlayerIsCheckedDBStatusToTournamentParticipation = (
    tournamentId: number
  ) => {
    console.log(
      "MATCHING!!!",
      "idOfTournamentDisplayedForEditingParticipants:",
      idOfTournamentDisplayedForEditingParticipants,
      "tournamentId: ",
      tournamentId
    );

    const selectedTournament = tournaments.filter((t) => t.id === tournamentId);

    if (
      selectedTournament &&
      selectedTournament[0] &&
      selectedTournament[0].participatingPlayers
    ) {
      const participants = selectedTournament[0].participatingPlayers;
      const participantIds = participants.map((p) => p.id);

      // TODO: OPTIMIZE
      players.forEach((player) => {
        if (player.id !== -1) {
          dispatch(
            checkPlayer({
              id: player.id,
              isChecked: participantIds.includes(player.id),
              firstName: player.firstName,
              lastName: player.lastName,
              strength: player.strength,
              comment: player.comment,
            })
          );
        }
      });
    }
  };

  const handleParticipantsClick = (tournamentId: number) => {
    console.log("CLICK");
    matchPlayerIsCheckedDBStatusToTournamentParticipation(tournamentId);
    setIdOfTournamentDisplayedForEditingParticipants((prev) => tournamentId);
  };

  useEffect(() => {
    console.log(
      `TournamentList showing participants of: ${idOfTournamentDisplayedForEditingParticipants} data: ${idOfTournamentDisplayedForEditingData}`
    );
  });

  return (
    <>
      <div className="m-8 border border-sky-500">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                {injectHeaders()}
                {!isAddingOrEditingTournamentMode() && <th />}
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {/* rows */}
              {Boolean(tournaments.length) &&
                tournaments.map((tournament) => (
                  <tr
                    key={
                      tournament.id + tournament.startDate + tournament.comment
                    }
                    className={
                      tournament.id === idOfTournamentDisplayedForEditingData
                        ? highlighted()
                        : ""
                    }
                  >
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
                            <div>
                              {getAdjustedDates(
                                tournament.startDate,
                                tournament.endDate
                              )}
                            </div>
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
                        disabled={
                          tournament.id ===
                          idOfTournamentDisplayedForEditingData
                        }
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
                        disabled={
                          tournament.id ===
                          idOfTournamentDisplayedForEditingData
                        }
                      >
                        usuń
                      </button>
                    </th>
                    {!isAddingOrEditingTournamentMode() && (
                      <th>
                        <button
                          className="btn btn-ghost btn-xs bg-slate-600"
                          onClick={() => {
                            handleParticipantsClick(tournament.id);
                          }}
                        >
                          uczestnicy
                        </button>
                      </th>
                    )}
                  </tr>
                ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                {!isAddingOrEditingTournamentMode() && <th />}
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

      {idOfTournamentDisplayedForEditingParticipants > -1 &&
        createPortal(
          <div className="darkModal max-w-7xl mx-auto">
            <button
              className="btn btn-ghost btn-xs bg-slate-600 w-10 h-10 positionMeTopRight"
              onClick={() =>
                setIdOfTournamentDisplayedForEditingParticipants((prev) => -1)
              }
            >
              x
            </button>

            <div className="m-8 border border-sky-500">
              <div className="overflow-x-auto w-full">
                <table className="table w-full">
                  {/* head */}
                  <thead>
                    <tr>
                      {injectHeaders()}
                      {!isAddingOrEditingTournamentMode() && <th />}
                    </tr>
                  </thead>
                  <tbody>
                    {/* rows */}
                    {Boolean(tournaments.length) &&
                      tournaments.map((tournament) => (
                        <tr
                          key={
                            tournament.id +
                            tournament.type +
                            tournament.startDate
                          }
                          className={
                            tournament.id ===
                            idOfTournamentDisplayedForEditingParticipants
                              ? highlighted()
                              : ""
                          }
                        >
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
                                  <div>
                                    {getAdjustedDates(
                                      tournament.startDate,
                                      tournament.endDate
                                    )}
                                  </div>
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

                          {!isAddingOrEditingTournamentMode() && (
                            <th>
                              <button
                                className="btn btn-ghost btn-xs bg-slate-600"
                                onClick={() => {
                                  handleParticipantsClick(tournament.id);
                                }}
                              >
                                uczestnicy
                              </button>
                            </th>
                          )}
                        </tr>
                      ))}
                  </tbody>
                  {/* foot */}
                  <tfoot>
                    <tr>
                      {!isAddingOrEditingTournamentMode() && <th />}
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
              isEditingTournamentParticipants={true}
              displayedPlayerUpdater={() => {}}
              assignPlayersToTournament={async () => {
                await dispatch(
                  assignPlayersToTournament(
                    idOfTournamentDisplayedForEditingParticipants
                  )
                );
                await dispatch(fetchAllPlayers());
                dispatch(fetchAllTournaments());
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default TournamentList;
