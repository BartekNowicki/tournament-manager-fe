/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */

import * as React from "react";
import { useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import {
  Player,
  checkPlayers,
  deletePlayer,
} from "../storeContent/storeSlices/playerSlice";
import {
  Team,
  checkTeams,
  deleteTeam,
} from "../storeContent/storeSlices/teamSlice";
import CheckPlayerRow from "./CheckPlayerRow";
import CheckTeamRow from "./CheckTeamRow";
import PlayerInfoColumns from "./PlayerInfoColumns";
import { TData } from "../storeContent/storeSlices/tournamentSlice";
import TeamInfoColumns from "./TeamInfoColumns";
// eslint-disable-next-line import/no-cycle
import { getIdOfItemToSaveOrEdit } from "./AddOrEditPlayer";
import {
  Item,
  findPlayerById,
  findTeamById,
  highlighted,
  injectItemKey,
  isPlayer,
  isTeam,
} from "../utils/funcs";

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
  isEditingTournamentParticipants,
  idOfTournamentDisplayedForEditingParticipants,
  isParticipantsSingles,
  assignPlayersToTournament,
}) => {
  const players = useAppSelector((state) => state.player.players);
  const teams = useAppSelector((state) => state.team.teams);
  const forceRenderCount = useAppSelector(
    (state) => state.player.forceRerenderPlayerListCount
  );
  const dispatch = useAppDispatch();

  const params = useParams() ?? {};

  const isPlayerChecked = useCallback(
    (id: number): boolean => {
      const found: Player = findPlayerById(players, id);
      if (found && found.isChecked) {
        return found.isChecked;
      }
      if (found && found.checked) {
        return found.checked;
      }
      return false;
    },
    [players]
  );

  const isTeamChecked = useCallback(
    (id: number): boolean => {
      const found: Team = findTeamById(teams, id);
      if (found && found.isChecked) {
        return found.isChecked;
      }
      if (found && found.checked) {
        return found.checked;
      }
      return false;
    },
    [teams]
  );

  const isToBeHighlightedForEditingData = (id: number): boolean => {
    return (
      !isEditingTournamentParticipants && id === getIdOfItemToSaveOrEdit(params)
    );
  };

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
      const key: number = +e.target.id;
      const newIdToCheckStatusMapping = new Map();
      if (key !== -1) {
        if (type === "player") {
          const player: Player = findPlayerById(players, key);
          newIdToCheckStatusMapping.set(player.id, !isPlayerChecked(player.id));
          dispatch(checkPlayers(newIdToCheckStatusMapping));
        } else if (type === "team") {
          const team = findTeamById(teams, key);
          newIdToCheckStatusMapping.set(team.id, !isTeamChecked(team.id));
          dispatch(checkTeams(newIdToCheckStatusMapping));
        }
        // need this redundant if otherwise the linter goes crazy changing code
      } else if (key === -1) {
        if (type === "player") {
          const commonOppositeStateForAll = !isPlayerChecked(-1) || false;
          // eslint-disable-next-line no-restricted-syntax
          for (const p of players) {
            newIdToCheckStatusMapping.set(p.id, commonOppositeStateForAll);
          }
          if (newIdToCheckStatusMapping) {
            dispatch(checkPlayers(newIdToCheckStatusMapping));
          }
        } else if (type === "team") {
          const commonOppositeStateForAll = !isTeamChecked(-1) || false;
          // eslint-disable-next-line no-restricted-syntax
          for (const t of teams) {
            newIdToCheckStatusMapping.set(t.id, commonOppositeStateForAll);
          }
          if (newIdToCheckStatusMapping) {
            dispatch(checkTeams(newIdToCheckStatusMapping));
          }
        }
      }
    },
    [dispatch, isPlayerChecked, isTeamChecked, players, teams]
  );

  // useEffect(() => {});

  useEffect(() => {
    // console.log("RENDERING PLAYERLIST, FOR SINGLES ? ", isParticipantsSingles);
  });

  // this should not be required under normal flow but here we have a tailwind table and that requires an explicit rerender
  useEffect(() => {}, [forceRenderCount]);

  const items: Array<Item> = !isParticipantsSingles ? teams : players;

  if (items.length === 0)
    return <>Dodaj graczy, stwórz pary, dodaj turnieje :) </>;

  return (
    <div className="m-8 border border-sky-500 addPlayersPanel">
      <div
        style={
          isEditingTournamentParticipants
            ? { maxHeight: "65vh" }
            : { maxHeight: "75vh" }
        }
        className="overflow-x-auto w-full"
      >
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              {isEditingTournamentParticipants && (
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
                    />
                  </label>
                </th>
              )}
              <th className="text text-center">Imię i Nazwisko</th>
              <th className="text text-center">Siła</th>
              <th className="text text-center">Uwagi</th>
              {!isEditingTournamentParticipants && <th />}
              {!isEditingTournamentParticipants && <th />}
            </tr>
          </thead>
          <tbody>
            {/* rows */}
            {Boolean(items.length) &&
              items
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
                    {isEditingTournamentParticipants &&
                      (isParticipantsSingles && isPlayer(item) ? (
                        <CheckPlayerRow
                          handleCheck={(e) => handleCheck(e, "player")}
                          id={item.id}
                          isChecked={isPlayerChecked}
                          player={item}
                        />
                      ) : (
                        !isParticipantsSingles &&
                        isTeam(item) && (
                          <CheckTeamRow
                            handleCheck={(e) => handleCheck(e, "team")}
                            id={item.id}
                            isChecked={isTeamChecked}
                            team={item}
                            findPlayerById={findPlayerById}
                          />
                        )
                      ))}

                    {/* read only mode, singles */}
                    {!isEditingTournamentParticipants &&
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
                    {!isEditingTournamentParticipants &&
                      !isParticipantsSingles &&
                      isTeam(item) && (
                        <>
                          <TeamInfoColumns
                            playerOne={findPlayerById(
                              players,
                              item.playerOneId
                            )}
                            playerTwo={findPlayerById(
                              players,
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
              {!isEditingTournamentParticipants && <th />}
              {!isEditingTournamentParticipants && <th />}
              <th />
              <th />
              <th />
              {isEditingTournamentParticipants && <th />}
            </tr>
          </tfoot>
        </table>

        {isEditingTournamentParticipants && (
          <div>
            <button
              className="btn btn-ghost btn-xs bg-slate-600 positionMeBottomRight"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerList;
