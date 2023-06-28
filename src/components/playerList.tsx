/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
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
  Team,
  checkTeams,
  deleteTeam,
  fetchAllTeams,
} from "../storeContent/storeSlices/teamSlice";
import CheckPlayerRow from "./CheckPlayerRow";
import CheckTeamRow from "./CheckTeamRow";
import PlayerInfoColumns from "./PlayerInfoColumns";
import {
  TData,
  fetchAllTournaments,
} from "../storeContent/storeSlices/tournamentSlice";
import TeamInfoColumns from "./TeamInfoColumns";
// eslint-disable-next-line import/no-cycle
import { getIdOfItemToSaveOrEdit } from "./AddOrEditPlayer";
// eslint-disable-next-line import/no-cycle
import {
  Item,
  findPlayerById,
  findTeamById,
  getSortedPlayerGroups,
  highlighted,
  injectItemKey,
  isPlayer,
  isTeam,
  log,
} from "../utils/funcs";
import { fetchAllGroups } from "../storeContent/storeSlices/groupSlice";
import { TournamentType } from "./Tournament";
import Separator from "./Separator";

interface IPlayerListProps {
  displayedPlayerUpdater: () => void;
  isEditingTournamentParticipants: boolean;
  // eslint-disable-next-line react/require-default-props
  idOfTournamentDisplayedForEditingParticipants?: number;
  isParticipantsSingles: boolean;
  assignPlayersToTournament: (tdata: TData) => void;
}

const PlayerList: React.FunctionComponent<IPlayerListProps> = ({
  displayedPlayerUpdater,
  isEditingTournamentParticipants: isEditingParticipantsOrGroups,
  idOfTournamentDisplayedForEditingParticipants,
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
      const found: Team = findTeamById(allTeams, id);
      if (found && found.isChecked) {
        return found.isChecked;
      }
      if (found && found.checked) {
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
          const player: Player = findPlayerById(allPlayers, key);
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

  const playersAssignedToGroups = getSortedPlayerGroups(
    allTournaments,
    idOfTournamentDisplayedForEditingParticipants,
    isParticipantsSingles,
    allGroups,
    allPlayers
  );

  useEffect(() => {
    if (
      isParticipantsSingles &&
      !isDividedIntoGroups &&
      playersAssignedToGroups.length > 0
    ) {
      setIsDividedIntoGroups((prev) => true);
      if (
        JSON.stringify(listedItems) !== JSON.stringify(playersAssignedToGroups)
      ) {
        setListedItems((prev) => playersAssignedToGroups);
      }
    } else if (
      isParticipantsSingles &&
      isDividedIntoGroups &&
      playersAssignedToGroups.length === 0
    ) {
      setIsDividedIntoGroups((prev) => false);
      // setListedItems((prev) => allPlayers);
    }
  }, [
    allPlayers,
    isDividedIntoGroups,
    isParticipantsSingles,
    listedItems,
    playersAssignedToGroups,
  ]);

  useEffect(() => {
    log("RENDERING PLAYERLIST, FOR SINGLES ? ", isParticipantsSingles);
    log("RENDERING PLAYERLIST, LISTED ITEMS: ", listedItems);
    log("RENDERING PLAYERLIST, GROUPING DONE ? ", isDividedIntoGroups);
    log(
      "RENDERING PLAYERLIST, TOURNAMENT EDITING PARTICIPANTS: ",
      idOfTournamentDisplayedForEditingParticipants
    );
    log("RENDERING PLAYERLIST, LISTING GROUPS: : ", playersAssignedToGroups);
  }, [
    isParticipantsSingles,
    listedItems,
    isDividedIntoGroups,
    idOfTournamentDisplayedForEditingParticipants,
    allPlayers,
    allTeams,
    playersAssignedToGroups,
  ]);

  // this should not be required under normal flow but here we have a tailwind table and that requires an explicit rerender
  useEffect(() => {}, [forceRenderCount]);

  let items: Array<Item>;

  const teamsAssignedToGroups = allTeams; // TODO

  if (!isDividedIntoGroups && !isParticipantsSingles) {
    items = allTeams;
  } else if (isDividedIntoGroups && !isParticipantsSingles) {
    items = teamsAssignedToGroups;
  } else if (!isDividedIntoGroups && isParticipantsSingles) {
    items = allPlayers;
  } else if (isDividedIntoGroups && isParticipantsSingles) {
    items = playersAssignedToGroups;
  }

  if (listedItems.length === 0)
    return <>Dodaj graczy, stwórz pary, dodaj turnieje :) </>;

  return (
    <div className="m-8 border border-sky-500 addPlayersPanel">
      <div
        style={
          isEditingParticipantsOrGroups
            ? { maxHeight: "65vh" }
            : { maxHeight: "75vh" }
        }
        className="overflow-x-auto w-full"
      >
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
                              className="btn btn-ghost btn-xs bg-slate-600"
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
                              className="btn btn-ghost btn-xs bg-slate-600"
                              onClick={(e) => {
                                dispatch(deletePlayer(item.id));
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
                              className="btn btn-ghost btn-xs bg-slate-600"
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
                              className="btn btn-ghost btn-xs bg-slate-600"
                              onClick={(e) => {
                                dispatch(deleteTeam(item.id));
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
              className="btn btn-ghost btn-xs bg-slate-700 positionMeBottomCenterLeft"
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
              className="btn btn-ghost btn-xs bg-slate-700 positionMeBottomCenterRight"
              onClick={async () => {
                if (
                  !isDividedIntoGroups &&
                  idOfTournamentDisplayedForEditingParticipants
                ) {
                  // if isParticipantsSingles, then do Teams
                  await dispatch(
                    groupPlayers(idOfTournamentDisplayedForEditingParticipants)
                  );
                } else if (
                  isDividedIntoGroups &&
                  idOfTournamentDisplayedForEditingParticipants
                ) {
                  await dispatch(
                    unGroupPlayers(
                      idOfTournamentDisplayedForEditingParticipants
                    )
                  );
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
    </div>
  );
};

export default PlayerList;
