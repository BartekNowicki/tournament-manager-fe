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
  checkPlayers,
  fetchAllPlayers,
} from "../storeContent/storeSlices/playerSlice";
import { TournamentType } from "./Tournament";
import { checkTeam } from "../storeContent/storeSlices/teamSlice";

interface ITournamentListProps {
  idOfTournamentDisplayedForEditingData: number;
  typeOfTournamentDisplayedForEditingData: string;
  displayedTournamentUpdater: () => void;
}

const TournamentList: React.FunctionComponent<ITournamentListProps> = ({
  idOfTournamentDisplayedForEditingData,
  typeOfTournamentDisplayedForEditingData,
  displayedTournamentUpdater,
}) => {
  const tournaments = useAppSelector((state) => state.tournament.tournaments);
  const players = useAppSelector((state) => state.player.players);
  const teams = useAppSelector((state) => state.team.teams);
  const dispatch = useAppDispatch();
  const [
    idOfTournamentDisplayedForEditingParticipants,
    setIdOfTournamentDisplayedForEditingParticipants,
  ] = useState<number>(-1);
  const [
    typeOfTournamentDisplayedForEditingParticipants,
    setTypeOfTournamentDisplayedForEditingParticipants,
  ] = useState<string>(typeOfTournamentDisplayedForEditingData);

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

  const isToBeHighlightedForEditingParticipants = (
    id: number,
    type: string
  ): boolean =>
    id === idOfTournamentDisplayedForEditingParticipants &&
    type === typeOfTournamentDisplayedForEditingParticipants;

  const isToBeHighlightedForEditingData = (id: number, type: string): boolean =>
    id === idOfTournamentDisplayedForEditingData &&
    type === typeOfTournamentDisplayedForEditingData;

  const highlighted = () => "border-solid border-2 border-sky-500";

  const matchPlayerIsCheckedDBStatusToTournamentParticipation = (
    tournamentId: number
  ) => {
    console.log(
      "matching for tournament type: ",
      typeOfTournamentDisplayedForEditingParticipants,
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
      const participants =
        typeOfTournamentDisplayedForEditingParticipants === "SINGLES"
          ? selectedTournament[0].participatingPlayers
          : selectedTournament[0].participatingTeams;
      const participantIds = participants && participants.map((p) => p.id);

      // TODO: OPTIMIZE
      // if (typeOfTournamentDisplayedForEditingParticipants === "SINGLES") {
      //   players.forEach((player) => {
      //     const isIncluded: boolean =
      //       (participantIds && participantIds.includes(player.id)) || false;
      //     if (player.id !== -1) {
      //       dispatch(
      //         checkPlayer({
      //           id: player.id,
      //           isChecked: isIncluded,
      //           firstName: player.firstName,
      //           lastName: player.lastName,
      //           strength: player.strength,
      //           comment: player.comment,
      //         })
      //       );
      //     }
      //   });
      // } else {
      //   teams.forEach((team) => {
      //     const isIncluded: boolean =
      //       (participantIds && participantIds.includes(team.id)) || false;
      //     if (team.id !== -1) {
      //       dispatch(
      //         checkTeam({
      //           id: team.id,
      //           isChecked: isIncluded,
      //           playerOneId: team.playerOneId,
      //           playerTwoId: team.playerTwoId,
      //           strength: team.strength,
      //           comment: team.comment,
      //         })
      //       );
      //     }
      //   });
      // }
    }
  };

  const handleParticipantsClick = (
    tournamentId: number,
    tournamentType: string
  ) => {
    console.log("click uczestnicy: ", tournamentId, tournamentType);
    setIdOfTournamentDisplayedForEditingParticipants((prev) => tournamentId);
    setTypeOfTournamentDisplayedForEditingParticipants(
      (prev) => tournamentType
    );
    matchPlayerIsCheckedDBStatusToTournamentParticipation(tournamentId);
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
                      isToBeHighlightedForEditingParticipants(
                        tournament.id,
                        tournament.type
                      ) ||
                      isToBeHighlightedForEditingData(
                        tournament.id,
                        tournament.type
                      )
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
                        disabled={isToBeHighlightedForEditingData(
                          tournament.id,
                          tournament.type
                        )}
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
                        disabled={isToBeHighlightedForEditingData(
                          tournament.id,
                          tournament.type
                        )}
                      >
                        usuń
                      </button>
                    </th>
                    {!isAddingOrEditingTournamentMode() && (
                      <th>
                        <button
                          className="btn btn-ghost btn-xs bg-slate-600"
                          onClick={() => {
                            handleParticipantsClick(
                              tournament.id,
                              tournament.type
                            );
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
              <div
                style={{ maxHeight: "25vh" }}
                className="overflow-x-auto w-full"
              >
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
                            isToBeHighlightedForEditingParticipants(
                              tournament.id,
                              tournament.type
                            )
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
                                  handleParticipantsClick(
                                    tournament.id,
                                    tournament.type
                                  );
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
              isParticipantsSingles={
                typeOfTournamentDisplayedForEditingParticipants === "SINGLES"
              }
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
