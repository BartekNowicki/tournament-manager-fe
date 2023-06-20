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
  TData,
  Tournament,
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

import { checkTeams } from "../storeContent/storeSlices/teamSlice";
import { highlighted, injectItemTournamentKey } from "../utils/funcs";

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

  const matchPlayerIsCheckedDBStatusToTournamentParticipation = (
    tournamentId: number,
    tournamentType: string
  ) => {
    const selectedTournament =
      tournaments && Array.isArray(tournaments)
        ? tournaments?.find(
            (t) =>
              t.id === tournamentId &&
              t.type === typeOfTournamentDisplayedForEditingParticipants
          )
        : null;

    if (selectedTournament) {
      const participantIds =
        typeOfTournamentDisplayedForEditingParticipants === "SINGLES"
          ? selectedTournament.participatingPlayers
          : selectedTournament.participatingTeams;

      console.log(
        "matching for tournament: ",
        selectedTournament,
        "matching for tournament type: ",
        typeOfTournamentDisplayedForEditingParticipants,
        "id: ",
        idOfTournamentDisplayedForEditingParticipants,
        "participantIds: ",
        participantIds
      );

      const newIdToCheckStatusMapping = new Map();

      if (
        typeOfTournamentDisplayedForEditingParticipants === "SINGLES" &&
        typeof participantIds !== "undefined"
      ) {
        // eslint-disable-next-line no-restricted-syntax
        for (const p of players) {
          if (typeof p.id !== "undefined")
            newIdToCheckStatusMapping.set(p.id, false);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const id of participantIds) {
          if (typeof id !== "undefined")
            newIdToCheckStatusMapping.set(id, true);
        }
        if (newIdToCheckStatusMapping.size > 0) {
          // console.log("DISPATCH: ", newIdToCheckStatusMapping);
          dispatch(checkPlayers(newIdToCheckStatusMapping));
        }
      } else if (
        typeOfTournamentDisplayedForEditingParticipants === "DOUBLES" &&
        typeof participantIds !== "undefined"
      ) {
        // eslint-disable-next-line no-restricted-syntax
        for (const t of teams) {
          newIdToCheckStatusMapping.set(t.id, false);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const id of participantIds) {
          newIdToCheckStatusMapping.set(id, true);
        }
        if (newIdToCheckStatusMapping.size > 0) {
          checkTeams(newIdToCheckStatusMapping);
        }
      }
    } else {
      console.log(
        "The selected tournament does not exist, are you adding a new one?"
      );
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
  };

  useEffect(() => {
    console.log(
      `TournamentList showing participants of: ${idOfTournamentDisplayedForEditingParticipants} data: ${idOfTournamentDisplayedForEditingData}`
    );

    if (
      idOfTournamentDisplayedForEditingParticipants &&
      typeOfTournamentDisplayedForEditingParticipants
    ) {
      matchPlayerIsCheckedDBStatusToTournamentParticipation(
        idOfTournamentDisplayedForEditingParticipants,
        typeOfTournamentDisplayedForEditingParticipants
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    idOfTournamentDisplayedForEditingParticipants,
    typeOfTournamentDisplayedForEditingParticipants,
  ]);

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
                    key={injectItemTournamentKey(tournament)}
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
                          const tournamentType =
                            tournament.type === "SINGLES"
                              ? "singles"
                              : "doubles";
                          console.log(
                            "DELETING: ",
                            tournamentType,
                            tournament.type
                          );

                          dispatch(
                            deleteTournament({
                              tournamentId: tournament.id,
                              type: tournamentType,
                            })
                          );
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
                          key={injectItemTournamentKey(tournament)}
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
              idOfTournamentDisplayedForEditingParticipants={
                idOfTournamentDisplayedForEditingParticipants
              }
              isParticipantsSingles={
                typeOfTournamentDisplayedForEditingParticipants === "SINGLES"
              }
              displayedPlayerUpdater={() => {}}
              assignPlayersToTournament={async ({
                tournamentId,
                type,
              }: TData) => {
                await dispatch(
                  assignPlayersToTournament({
                    tournamentId: idOfTournamentDisplayedForEditingParticipants,
                    type,
                  })
                );
                await dispatch(fetchAllTournaments());
                dispatch(fetchAllPlayers());
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default TournamentList;
