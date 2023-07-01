/* eslint-disable import/no-cycle */
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
  assignPlayersToTournament,
  deleteTournament,
  emptyTournament,
  fetchAllTournaments,
} from "../storeContent/storeSlices/tournamentSlice";
import { getAdjustedDates } from "../utils/dates";
import PlayerList from "./PlayerList";
import {
  checkPlayers,
  fetchAllPlayers,
} from "../storeContent/storeSlices/playerSlice";

import {
  checkTeams,
  fetchAllTeams,
} from "../storeContent/storeSlices/teamSlice";
import {
  count,
  findTournamentById,
  highlighted,
  injectItemKey,
  isTournament,
  log,
} from "../utils/funcs";
import Tournament, { TournamentType } from "./Tournament";
import {
  btnDeleteColor,
  btnEditColor,
  btnShowParticipantsColor,
  maxHeightOfLists,
  maxHeightOfTournamentListWhenAddingOrEditing,
} from "../utils/settings";
import DialogModal from "./confirmation/DialogModal";

interface ITournamentListProps {
  idOfTournamentDisplayedForEditingData: number;
  typeOfTournamentDisplayedForEditingData: string;
  displayedTournamentUpdater: (
    tournamentId: number,
    tournamentType: string
  ) => void;
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

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [
    typeOfTournamentScheduledForDeletion,
    setTypeOfTournamentScheduledForDeletion,
  ] = useState<string>();
  const [
    idOfTournamentScheduledForDeletion,
    setIdOfTournamentScheduledForDeletion,
  ] = useState<number>();
  const [
    datesOfTournamentScheduledForDeletion,
    setDatesOfTournamentScheduledForDeletion,
  ] = useState<string>();

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
    let selectedTournament = emptyTournament;

    const foundTournament = tournaments?.find(
      (t) =>
        t.id === tournamentId &&
        t.type === typeOfTournamentDisplayedForEditingParticipants
    );

    if (typeof foundTournament !== "undefined" && isTournament(foundTournament))
      selectedTournament = foundTournament;

    if (selectedTournament.groups && selectedTournament.groups.length > 0)
      return;

    const participantIds =
      typeOfTournamentDisplayedForEditingParticipants === TournamentType.SINGLES
        ? selectedTournament.participatingPlayers
        : selectedTournament.participatingTeams;

    // log(
    //   "tournament is grouped: ",
    //   selectedTournament?.groups?.length > 0,
    //   "matching for tournament: ",
    //   selectedTournament,
    //   "matching for tournament type: ",
    //   typeOfTournamentDisplayedForEditingParticipants,
    //   "id: ",
    //   idOfTournamentDisplayedForEditingParticipants,
    //   "participantIds: ",
    //   participantIds
    // );

    const newIdToCheckStatusMapping = new Map();

    if (
      typeOfTournamentDisplayedForEditingParticipants ===
        TournamentType.SINGLES &&
      typeof participantIds !== "undefined"
    ) {
      // eslint-disable-next-line no-restricted-syntax
      for (const p of players) {
        if (typeof p.id !== "undefined")
          newIdToCheckStatusMapping.set(p.id, false);
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const id of participantIds) {
        if (typeof id !== "undefined") newIdToCheckStatusMapping.set(id, true);
      }
      if (newIdToCheckStatusMapping.size > 0) {
        // console.log("DISPATCH: ", newIdToCheckStatusMapping);
        dispatch(checkPlayers(newIdToCheckStatusMapping));
      }
    } else if (
      typeOfTournamentDisplayedForEditingParticipants ===
        TournamentType.DOUBLES &&
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
        dispatch(checkTeams(newIdToCheckStatusMapping));
      }
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
    // console.log(
    //   `TournamentList showing participants of: ${idOfTournamentDisplayedForEditingParticipants} data: ${idOfTournamentDisplayedForEditingData}`
    // );

    if (
      idOfTournamentDisplayedForEditingParticipants &&
      idOfTournamentDisplayedForEditingParticipants !== -1 &&
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

  const isTournamentAddingOrEditingData = () =>
    idOfTournamentDisplayedForEditingData === -2 ||
    idOfTournamentDisplayedForEditingData > 0;

  const getTournamentListClassName = () => {
    if (isTournamentAddingOrEditingData()) {
      return `m-8  ${maxHeightOfTournamentListWhenAddingOrEditing} overflow-y-scroll`;
    }
    return `m-8  ${maxHeightOfLists} overflow-y-scroll`;
  };

  return (
    <>
      <div className={getTournamentListClassName()}>
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
                    key={injectItemKey(tournament)}
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
                        className={`btn btn-ghost btn-s ${btnEditColor}`}
                        onClick={() => {
                          if (displayedTournamentUpdater)
                            displayedTournamentUpdater(
                              tournament.id,
                              tournament.type
                            );
                        }}
                        disabled={isToBeHighlightedForEditingData(
                          tournament.id,
                          tournament.type
                        )}
                      >
                        <Link
                          to={`/tournaments/addoredit/edit/${tournament.type}/${tournament.id}`}
                        >
                          edytuj
                        </Link>
                      </button>
                    </th>
                    <th>
                      <button
                        className={`btn btn-ghost btn-s ${btnDeleteColor}`}
                        onClick={(e) => {
                          setTypeOfTournamentScheduledForDeletion(
                            (prev) => tournament.type
                          );
                          setIdOfTournamentScheduledForDeletion(
                            (prev) => tournament.id
                          );
                          setDatesOfTournamentScheduledForDeletion((prev) =>
                            getAdjustedDates(
                              tournament.startDate,
                              tournament.endDate
                            )
                          );
                          setConfirmDeleteModalOpen((prev) => true);
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
                          className={`btn btn-ghost btn-s ${btnShowParticipantsColor}`}
                          onClick={() => {
                            handleParticipantsClick(
                              tournament.id,
                              tournament.type
                            );
                          }}
                        >
                          {tournament.type === TournamentType.SINGLES
                            ? "uczestnicy"
                            : "pary"}
                          (
                          {tournament.type === TournamentType.SINGLES
                            ? count(
                                "players",
                                tournaments,
                                tournament.id,
                                tournament.type
                              )
                            : count(
                                "teams",
                                tournaments,
                                tournament.id,
                                tournament.type
                              )}
                          ) grupy (
                          {count(
                            "groups",
                            tournaments,
                            tournament.id,
                            tournament.type
                          )}
                          )
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
        {/* modal for deletion confirmation */}
        <div>
          <DialogModal
            isOpen={confirmDeleteModalOpen}
            onCancel={() => {
              setConfirmDeleteModalOpen((prev) => false);
              log("CANCELLING REQUEST");
            }}
            onConfirm={async () => {
              log(
                "USUWAM: ",
                idOfTournamentScheduledForDeletion,
                typeOfTournamentScheduledForDeletion
              );
              const tournamentType =
                typeOfTournamentScheduledForDeletion === "SINGLES"
                  ? "singles"
                  : "doubles";
              await dispatch(
                deleteTournament({
                  tournamentId: idOfTournamentScheduledForDeletion,
                  type: tournamentType,
                })
              );
              setConfirmDeleteModalOpen((prev) => false);
            }}
          >
            Czy na pewno chcesz usunąć turniej{" "}
            {`${datesOfTournamentScheduledForDeletion} / ${typeOfTournamentScheduledForDeletion}`}
            ?
          </DialogModal>
        </div>
      </div>

      {idOfTournamentDisplayedForEditingParticipants > -1 &&
        createPortal(
          <div className="darkModal max-w-7xl mx-auto">
            <button
              className="btn btn-ghost btn-s bg-slate-600 w-10 h-10 positionMeTopRight"
              onClick={() =>
                setIdOfTournamentDisplayedForEditingParticipants((prev) => -1)
              }
            >
              x
            </button>

            <div className="m-8">
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
                          key={injectItemKey(tournament)}
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
                                className={`btn btn-ghost btn-s ${btnShowParticipantsColor}`}
                                onClick={() => {
                                  handleParticipantsClick(
                                    tournament.id,
                                    tournament.type
                                  );
                                }}
                              >
                                {tournament.type === TournamentType.SINGLES
                                  ? "uczestnicy"
                                  : "pary"}
                                (
                                {tournament.type === TournamentType.SINGLES
                                  ? count(
                                      "players",
                                      tournaments,
                                      tournament.id,
                                      tournament.type
                                    )
                                  : count(
                                      "teams",
                                      tournaments,
                                      tournament.id,
                                      tournament.type
                                    )}
                                ) grupy (
                                {count(
                                  "groups",
                                  tournaments,
                                  tournament.id,
                                  tournament.type
                                )}
                                )
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
                await dispatch(fetchAllPlayers());
                dispatch(fetchAllTeams());
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default TournamentList;
