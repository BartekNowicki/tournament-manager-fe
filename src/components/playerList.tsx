/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import {
  Player,
  checkPlayer,
  deletePlayer,
} from "../storeContent/storeSlices/playerSlice";
import { Team, checkTeam } from "../storeContent/storeSlices/teamSlice";
import CheckPlayerRow from "./CheckPlayerRow";
import CheckTeamRow from "./CheckTeamRow";
import PlayerInfoColumns from "./PlayerInfoColumns";

interface IPlayerListProps {
  displayedPlayerUpdater: () => void;
  isEditingTournamentParticipants: boolean;
  isParticipantsSingles: boolean;
  assignPlayersToTournament: () => void;
}

const PlayerList: React.FunctionComponent<IPlayerListProps> = ({
  displayedPlayerUpdater,
  isEditingTournamentParticipants,
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
      // BE has "isChecked" but probably the response entity mutates it to "checked"
      // explicit comparison is required as isChecked is initially undefined and once you check it becomes defined and checked becomes undefined
      // return found.checked ? found.checked === true : found.isChecked === true;
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

  const handlePlayerCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const key: number = +e.target.id;
      const player = findPlayerById(key);
      if (key !== -1) {
        dispatch(
          checkPlayer({
            id: player.id,
            isChecked: !isPlayerChecked(player.id),
            firstName: player.firstName,
            lastName: player.lastName,
            strength: player.strength,
            comment: player.comment,
          })
        );
      } else {
        const commonOppositeStateForAll = !isPlayerChecked(-1);
        // eslint-disable-next-line no-restricted-syntax
        for (const p of players) {
          dispatch(
            checkPlayer({
              id: p.id,
              isChecked: commonOppositeStateForAll,
              firstName: p.firstName,
              lastName: p.lastName,
              strength: p.strength,
              comment: p.comment,
            })
          );
        }
      }
    },
    [dispatch, findPlayerById, isPlayerChecked, players]
  );

  const handleTeamCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const key: number = +e.target.id;
      const team = findTeamById(key);
      if (key !== -1) {
        dispatch(
          checkTeam({
            id: team.id,
            isChecked: !isTeamChecked(team.id),
            playerOneId: team.playerOneId,
            playerTwoId: team.playerTwoId,
            strength: team.strength,
            comment: team.comment,
          })
        );
      } else {
        const commonOppositeStateForAll = !isTeamChecked(-1);
        // eslint-disable-next-line no-restricted-syntax
        for (const t of teams) {
          dispatch(
            checkTeam({
              id: t.id,
              isChecked: commonOppositeStateForAll,
              playerOneId: t.playerOneId,
              playerTwoId: t.playerTwoId,
              strength: t.strength,
              comment: t.comment,
            })
          );
        }
      }
    },
    [dispatch, findTeamById, isTeamChecked, teams]
  );

  // this should not be required under normal flow but here we have a tailwind table and that requires an explicit rerender
  useEffect(() => {}, [forceRenderCount]);

  useEffect(() => {
    // console.log(`I GOT TEAMS TOO! `, teams);
  });

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
                      checked={isPlayerChecked(-1) === true}
                      onChange={handlePlayerCheck}
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
                .filter((item) => item.id !== -1)
                .map((item) => (
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
                          handleCheck={handlePlayerCheck}
                          id={item.id}
                          isChecked={isPlayerChecked}
                          player={item}
                        />
                      ) : (
                        <CheckTeamRow
                          handleCheck={handleTeamCheck}
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
              onClick={() => assignPlayersToTournament()}
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
