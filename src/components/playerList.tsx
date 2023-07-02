/* eslint-disable react/require-default-props */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import {
  Player,
  checkPlayers,
  deletePlayer,
  fetchAllPlayers,
  groupPlayers,
  unGroupPlayers,
} from "../storeContent/storeSlices/playerSlice";
import {
  // Team,
  checkTeams,
  deleteTeam,
  // fetchAllTeams,
  groupTeams,
  unGroupTeams,
} from "../storeContent/storeSlices/teamSlice";
import CheckPlayerRow from "./CheckPlayerRow";
import CheckTeamRow from "./CheckTeamRow";
import PlayerInfoColumns from "./PlayerInfoColumns";
import {
  TData,
  fetchAllTournaments,
} from "../storeContent/storeSlices/tournamentSlice";
import TeamInfoColumns from "./TeamInfoColumns";
import { getIdOfItemToSaveOrEdit } from "./AddOrEditPlayer";
import {
  Item,
  // findById,
  findPlayerById,
  findTeamById,
  getSortedPlayerOrTeamGroups,
  highlighted,
  injectItemKey,
  isPlayer,
  isTeam,
  log,
} from "../utils/funcs";
import { fetchAllGroups } from "../storeContent/storeSlices/groupSlice";
import {
  btnDeleteColor,
  btnEditColor,
  btnSaveColor,
  maxHeightOfLists,
  maxHeightOfPlayerListWhenAddingOrEditing,
  maxHeightOfPlayerListWhenEditingTournamentParticipants,
} from "../utils/settings";
import DialogModal from "./confirmation/DialogModal";

interface IPlayerListProps {
  displayedPlayerUpdater: () => void;
  isEditingTournamentParticipants: boolean;
  idOfTournamentDisplayedForEditingParticipants: number;
  isParticipantsSingles: boolean;
  assignPlayersToTournament: (tdata: TData) => void;
}

const PlayerList: React.FunctionComponent<IPlayerListProps> = ({
  displayedPlayerUpdater,
  isEditingTournamentParticipants: isEditingParticipantsOrGroups,
  idOfTournamentDisplayedForEditingParticipants = -1,
  isParticipantsSingles,
  assignPlayersToTournament,
}) => {
  const allPlayers = useAppSelector((state) => state.player.players);
  const allTeams = useAppSelector((state) => state.team.teams);
  const allTournaments = useAppSelector(
    (state) => state.tournament.tournaments
  );
  const allGroups = useAppSelector((state) => state.group.groups);
  const forceRenderCount = useAppSelector(
    (state) => state.player.forceRerenderPlayerListCount
  );
  const [isDividedIntoGroups, setIsDividedIntoGroups] =
    useState<boolean>(false);
  const initialListedItems: Item[] = isParticipantsSingles
    ? allPlayers
    : allTeams;
  const [listedItems, setListedItems] = useState<Item[]>(initialListedItems);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [idOfItemScheduledForDeletion, setIdOfItemScheduledForDeletion] =
    useState<number>();
  const [typeOfItemScheduledForDeletion, setTypeOfItemScheduledForDeletion] =
    useState<string>();
  const [dataOfItemScheduledForDeletion, setDataOfItemScheduledForDeletion] =
    useState<string>();

  const dispatch = useAppDispatch();
  const params = useParams() ?? {};

  const isPlayerChecked = useCallback(
    (id: number): boolean => {
      const found: Player = findPlayerById(allPlayers, id);
      if (found && found.isChecked) {
        return found.isChecked;
      }
      if (found && found.checked) {
        return found.checked;
      }
      return false;
    },
    [allPlayers]
  );

  const isTeamChecked = useCallback(
    (id: number): boolean => {
      const found = findTeamById(allTeams, id);
      if (found && isTeam(found) && found.isChecked) {
        return found.isChecked;
      }
      if (found && isTeam(found) && found.checked) {
        return found.checked;
      }
      return false;
    },
    [allTeams]
  );

  const isToBeHighlightedForEditingData = (id: number): boolean => {
    return (
      !isEditingParticipantsOrGroups && id === getIdOfItemToSaveOrEdit(params)
    );
  };

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
      const key: number = +e.target.id;
      const newIdToCheckStatusMapping = new Map();
      if (key !== -1) {
        if (type === "player") {
          const player = findPlayerById(allPlayers, key);
          newIdToCheckStatusMapping.set(player.id, !isPlayerChecked(player.id));
          dispatch(checkPlayers(newIdToCheckStatusMapping));
        } else if (type === "team") {
          const team = findTeamById(allTeams, key);
          newIdToCheckStatusMapping.set(team.id, !isTeamChecked(team.id));
          dispatch(checkTeams(newIdToCheckStatusMapping));
        }
        // need this redundant if otherwise the linter goes crazy changing code
      } else if (key === -1) {
        if (type === "player") {
          const commonOppositeStateForAll = !isPlayerChecked(-1) || false;
          // eslint-disable-next-line no-restricted-syntax
          for (const p of allPlayers) {
            newIdToCheckStatusMapping.set(p.id, commonOppositeStateForAll);
          }
          if (newIdToCheckStatusMapping) {
            dispatch(checkPlayers(newIdToCheckStatusMapping));
          }
        } else if (type === "team") {
          const commonOppositeStateForAll = !isTeamChecked(-1) || false;
          // eslint-disable-next-line no-restricted-syntax
          for (const t of allTeams) {
            newIdToCheckStatusMapping.set(t.id, commonOppositeStateForAll);
          }
          if (newIdToCheckStatusMapping) {
            dispatch(checkTeams(newIdToCheckStatusMapping));
          }
        }
      }
    },
    [dispatch, isPlayerChecked, isTeamChecked, allPlayers, allTeams]
  );

  // useEffect(() => {});

  const playersOrTeamsAssignedToGroups = useMemo(
    () =>
      getSortedPlayerOrTeamGroups(
        allTournaments,
        idOfTournamentDisplayedForEditingParticipants,
        isParticipantsSingles,
        allGroups,
        allPlayers,
        allTeams
      ),
    [
      allTournaments,
      idOfTournamentDisplayedForEditingParticipants,
      isParticipantsSingles,
      allGroups,
      allPlayers,
      allTeams,
    ]
  );

  useEffect(() => {
    const items = playersOrTeamsAssignedToGroups;

    // log("ITEMS ", items, isParticipantsSingles);

    if (items.length > 0) {
      if (JSON.stringify(listedItems) !== JSON.stringify(items))
        setListedItems((prev) => items);
      if (isDividedIntoGroups !== true) setIsDividedIntoGroups((prev) => true);
    } else {
      if (
        isParticipantsSingles &&
        JSON.stringify(listedItems) !== JSON.stringify(allPlayers)
      ) {
        setListedItems((prev) => allPlayers);
      }
      if (
        !isParticipantsSingles &&
        JSON.stringify(listedItems) !== JSON.stringify(allTeams)
      ) {
        setListedItems((prev) => allTeams);
      }

      if (isDividedIntoGroups !== false) {
        setIsDividedIntoGroups((prev) => false);
      }
    }
  }, [
    listedItems,
    isDividedIntoGroups,
    allPlayers,
    allTeams,
    playersOrTeamsAssignedToGroups,
    isParticipantsSingles,
  ]);

  useEffect(() => {
    // log("RENDERING PLAYERLIST, FOR SINGLES ? ", isParticipantsSingles);
    // log("RENDERING PLAYERLIST, LISTED ITEMS: ", listedItems);
    // log("RENDERING PLAYERLIST, GROUPING DONE ? ", isDividedIntoGroups);
    // log(
    //   "RENDERING PLAYERLIST, IDOFTOURNAMENT EDITING PARTICIPANTS: ",
    //   idOfTournamentDisplayedForEditingParticipants
    // );
    // log(
    //   "RENDERING PLAYERLIST, GETTING ID OF ITEM TO SAVE OR EDIT: ",
    //   getIdOfItemToSaveOrEdit(params)
    // );
  }, [
    isParticipantsSingles,
    listedItems,
    isDividedIntoGroups,
    idOfTournamentDisplayedForEditingParticipants,
    allPlayers,
    allTeams,
    params,
  ]);

  // this should not be required under normal flow but here we have a tailwind table and that requires an explicit rerender
  useEffect(() => {}, [forceRenderCount]);

  const isTournamentEdittingParticipants = () =>
    idOfTournamentDisplayedForEditingParticipants > 0;
  const isPlayerOrTeamBeingAdded = () =>
    getIdOfItemToSaveOrEdit(params) === -2 ||
    getIdOfItemToSaveOrEdit(params) > 0;
  const isPlayerOrTeamBeingEdited = () => getIdOfItemToSaveOrEdit(params) > 0;

  const getPLayerListClassName = () => {
    if (
      !isTournamentEdittingParticipants() &&
      (isPlayerOrTeamBeingAdded() || isPlayerOrTeamBeingEdited())
    ) {
      return `m-8  ${maxHeightOfPlayerListWhenAddingOrEditing} overflow-y-scroll`;
    }
    if (
      isTournamentEdittingParticipants() &&
      !isPlayerOrTeamBeingAdded() &&
      !isPlayerOrTeamBeingEdited()
    ) {
      return `m-8  ${maxHeightOfPlayerListWhenEditingTournamentParticipants} overflow-y-scroll`;
    }
    return `m-8  ${maxHeightOfLists} overflow-y-scroll`;
  };

  if (listedItems.length === 0)
    return <>Dodaj graczy, stwórz pary, dodaj turnieje :) </>;

  return (
    <div className={getPLayerListClassName()}>
      <div>
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              {isEditingParticipantsOrGroups && (
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      id="-1"
                      checked={
                        isParticipantsSingles
                          ? isPlayerChecked(-1) === true
                          : isTeamChecked(-1)
                      }
                      onChange={
                        isParticipantsSingles
                          ? (e) => handleCheck(e, "player")
                          : (e) => handleCheck(e, "team")
                      }
                      style={{
                        display: !isDividedIntoGroups ? "block" : "none",
                      }}
                    />
                  </label>
                </th>
              )}
              <th className="text text-center">Imię i Nazwisko</th>
              <th className="text text-center">Siła</th>
              <th className="text text-center">Uwagi</th>
              {!isEditingParticipantsOrGroups && <th />}
              {!isEditingParticipantsOrGroups && <th />}
            </tr>
          </thead>
          <tbody>
            {/* rows */}
            {Boolean(listedItems.length) &&
              listedItems
                .filter((item: Item) => item.id !== -1)
                .map((item: Item) => (
                  <tr
                    key={injectItemKey(item)}
                    className={
                      isToBeHighlightedForEditingData(item.id)
                        ? highlighted()
                        : ""
                    }
                  >
                    {/* player to tournament assignment mode, singles : doubles */}
                    {isEditingParticipantsOrGroups &&
                      (isParticipantsSingles && isPlayer(item) ? (
                        <CheckPlayerRow
                          handleCheck={(e) => handleCheck(e, "player")}
                          id={item.id}
                          isChecked={isPlayerChecked}
                          player={item}
                          isDividedIntoGroups={isDividedIntoGroups}
                        />
                      ) : (
                        !isParticipantsSingles &&
                        isTeam(item) && (
                          <CheckTeamRow
                            handleCheck={(e) => handleCheck(e, "team")}
                            id={item.id}
                            isChecked={isTeamChecked}
                            team={item}
                            isDividedIntoGroups={isDividedIntoGroups}
                          />
                        )
                      ))}

                    {/* read only mode, singles */}
                    {!isEditingParticipantsOrGroups &&
                      isParticipantsSingles &&
                      isPlayer(item) && (
                        <>
                          <PlayerInfoColumns player={item} />
                          <th>
                            <button
                              className={`btn btn-ghost btn-s ${btnEditColor}`}
                              onClick={() => {
                                if (displayedPlayerUpdater)
                                  displayedPlayerUpdater();
                              }}
                            >
                              <Link to={`/players/addoredit/edit${item.id}`}>
                                edytuj
                              </Link>
                            </button>
                          </th>
                          <th>
                            <button
                              className={`btn btn-ghost btn-s ${btnDeleteColor}`}
                              onClick={(e) => {
                                setIdOfItemScheduledForDeletion(
                                  (prev) => item.id
                                );
                                setTypeOfItemScheduledForDeletion(
                                  (prev) => "player"
                                );
                                setDataOfItemScheduledForDeletion(
                                  (prev) =>
                                    `uczestnik ${item.firstName} ${item.lastName}`
                                );
                                setConfirmDeleteModalOpen((prev) => true);
                              }}
                            >
                              usuń
                            </button>
                          </th>
                        </>
                      )}

                    {/* read only mode, doubles */}
                    {!isEditingParticipantsOrGroups &&
                      !isParticipantsSingles &&
                      isTeam(item) && (
                        <>
                          <TeamInfoColumns
                            playerOne={findPlayerById(
                              allPlayers,
                              item.playerOneId
                            )}
                            playerTwo={findPlayerById(
                              allPlayers,
                              item.playerTwoId
                            )}
                            team={item}
                          />
                          <th>
                            <button
                              className={`btn btn-ghost btn-s ${btnEditColor}`}
                              onClick={() => {
                                if (displayedPlayerUpdater)
                                  displayedPlayerUpdater();
                              }}
                            >
                              <Link to={`/teams/addoredit/edit${item.id}`}>
                                edytuj
                              </Link>
                            </button>
                          </th>
                          <th>
                            <button
                              className={`btn btn-ghost btn-s ${btnDeleteColor}`}
                              onClick={(e) => {
                                const playerOne = findPlayerById(
                                  allPlayers,
                                  item.playerOneId
                                );
                                const playerTwo = findPlayerById(
                                  allPlayers,
                                  item.playerTwoId
                                );
                                setIdOfItemScheduledForDeletion(
                                  (prev) => item.id
                                );
                                setTypeOfItemScheduledForDeletion(
                                  (prev) => "team"
                                );
                                setDataOfItemScheduledForDeletion(
                                  (prev) =>
                                    `para ${playerOne.firstName} ${playerOne.lastName}, ${playerTwo.firstName} ${playerTwo.lastName}`
                                );
                                setConfirmDeleteModalOpen((prev) => true);
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
              {!isEditingParticipantsOrGroups && <th />}
              {!isEditingParticipantsOrGroups && <th />}
              <th />
              <th />
              <th />
              {isEditingParticipantsOrGroups && <th />}
            </tr>
          </tfoot>
        </table>

        {isEditingParticipantsOrGroups && (
          <div>
            <button
              disabled={isDividedIntoGroups}
              className={`btn btn-ghost btn-s ${btnSaveColor} positionMeBottomCenterLeft`}
              onClick={
                isParticipantsSingles
                  ? () =>
                      assignPlayersToTournament({
                        tournamentId:
                          idOfTournamentDisplayedForEditingParticipants || -1,
                        type: "singles",
                      })
                  : () =>
                      assignPlayersToTournament({
                        tournamentId:
                          idOfTournamentDisplayedForEditingParticipants || -1,
                        type: "doubles",
                      })
              }
            >
              zapisz uczestników
            </button>
            <button
              className={`btn btn-ghost btn-s ${btnSaveColor} positionMeBottomCenterRight`}
              onClick={async () => {
                const id: number | undefined =
                  idOfTournamentDisplayedForEditingParticipants;
                // console.log("ID: ", id);
                // console.log("isParticipantsSingles: ", isParticipantsSingles);
                // console.log("isDividedIntoGroups: ", isDividedIntoGroups);

                if (id) {
                  if (!isDividedIntoGroups && isParticipantsSingles) {
                    await dispatch(groupPlayers(id));
                  } else if (!isDividedIntoGroups && !isParticipantsSingles) {
                    await dispatch(groupTeams(id));
                  } else if (isDividedIntoGroups && isParticipantsSingles) {
                    await dispatch(unGroupPlayers(id));
                  } else if (isDividedIntoGroups && !isParticipantsSingles) {
                    await dispatch(unGroupTeams(id));
                  }
                }

                await dispatch(fetchAllTournaments());
                await dispatch(fetchAllPlayers());
                await dispatch(fetchAllGroups());

                setIsDividedIntoGroups((prev) => !prev);
              }}
            >
              {isDividedIntoGroups ? "cofnij losowanie" : "losuj grupy"}
            </button>
          </div>
        )}
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
              idOfItemScheduledForDeletion,
              typeOfItemScheduledForDeletion
            );
            if (typeOfItemScheduledForDeletion === "player") {
              await dispatch(deletePlayer(idOfItemScheduledForDeletion));
            } else if (typeOfItemScheduledForDeletion === "team") {
              await dispatch(deleteTeam(idOfItemScheduledForDeletion));
            }
            setConfirmDeleteModalOpen((prev) => false);
          }}
        >
          Czy na pewno chcesz usunąć:&nbsp;&nbsp;
          {`${dataOfItemScheduledForDeletion}`}?
        </DialogModal>
      </div>
    </div>
  );
};

export default PlayerList;
