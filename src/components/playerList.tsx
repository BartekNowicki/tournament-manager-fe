/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */

// @ts-nocheck

import * as React from "react";
import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import {
  Player,
  checkPlayers,
  deletePlayer,
} from "../storeContent/storeSlices/playerSlice";
import { Team, checkTeams } from "../storeContent/storeSlices/teamSlice";
import CheckPlayerRow from "./CheckPlayerRow";
import CheckTeamRow from "./CheckTeamRow";
import PlayerInfoColumns from "./PlayerInfoColumns";
import { TData } from "../storeContent/storeSlices/tournamentSlice";

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
  const findPlayerById = useCallback(
    (id: number) => {
      return players.filter((player) => player.id === id)[0];
    },
    [players]
  );
  const findTeamById = useCallback(
    (id: number) => {
      return teams.filter((team) => team.id === id)[0];
    },
    [teams]
  );

  const isPlayerChecked = useCallback(
    (id: number): boolean => {
      const found = findPlayerById(id);
      return found && found.isChecked === true;
    },
    [findPlayerById]
  );

  const isTeamChecked = useCallback(
    (id: number): boolean => {
      const found = findTeamById(id);
      return found && found.isChecked === true;
    },
    [findTeamById]
  );

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
      const key: number = +e.target.id;
      const newIdToCheckStatusMapping = new Map();
      if (key !== -1) {
        if (type === "player") {
          const player = findPlayerById(key);
          newIdToCheckStatusMapping.set(player.id, !isPlayerChecked(player.id));
          dispatch(checkPlayers(newIdToCheckStatusMapping));
        } else if (type === "team") {
          const team = findTeamById(key);
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
    [
      dispatch,
      findPlayerById,
      findTeamById,
      isPlayerChecked,
      isTeamChecked,
      players,
      teams,
    ]
  );

  useEffect(() => {});

  // this should not be required under normal flow but here we have a tailwind table and that requires an explicit rerender
  useEffect(() => {}, [forceRenderCount]);

  const items: Player[] | Team[] = !isParticipantsSingles ? teams : players;

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
                .filter((item: { id: number }) => item.id !== -1)
                .map((item: Team | Player) => (
                  <tr
                    key={
                      isParticipantsSingles
                        ? item.id + item.firstName + item.lastName
                        : item.id + item.playerOneId + item.playerTwoId
                    }
                  >
                    {isEditingTournamentParticipants &&
                      (isParticipantsSingles ? (
                        <CheckPlayerRow
                          handleCheck={(e) => handleCheck(e, "player")}
                          id={item.id}
                          isChecked={isPlayerChecked}
                          player={item}
                        />
                      ) : (
                        <CheckTeamRow
                          handleCheck={(e) => handleCheck(e, "team")}
                          id={item.id}
                          isChecked={isTeamChecked}
                          team={item}
                          findPlayerById={findPlayerById}
                        />
                      ))}

                    {!isEditingTournamentParticipants && (
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
                          idOfTournamentDisplayedForEditingParticipants,
                        type: "singles",
                      })
                  : () =>
                      assignPlayersToTournament({
                        tournamentId:
                          idOfTournamentDisplayedForEditingParticipants,
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
