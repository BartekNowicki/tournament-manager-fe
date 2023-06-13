/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useEffect, useState } from "react";

import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
// eslint-disable-next-line import/no-cycle
import PlayerList from "./PlayerList";
// eslint-disable-next-line import/no-cycle
import {
  UserActions,
  findPlayerById,
  getIdOfItemToSaveOrEdit,
  getUserAction,
} from "./AddOrEditPlayer";
import { Team, saveTeam } from "../storeContent/storeSlices/teamSlice";

export const findTeamById = (teams: Team[], id: number) => {
  const placeholderTeam = {
    id: -2,
    isChecked: false,
    playerOneId: 1,
    playerTwoId: 2,
    strength: 0,
    comment: "",
  };
  if (id === -2) return placeholderTeam;
  return teams.filter((team) => team.id === id)[0];
};

function AddOrEditTeam() {
  const navigate = useNavigate();
  const params = useParams() ?? {};
  const dispatch = useAppDispatch();
  // id = -2 => reserved for adding a new team
  // id = -1 => reserved for hidden allTeams isChecked (shown only on assignment)

  const teams = useAppSelector((state) => state.team.teams);
  const players = useAppSelector((state) => state.player.players);

  const initialDisplayedTeam = findTeamById(
    teams,
    getIdOfItemToSaveOrEdit(params)
  );
  const [displayedTeam, setDisplayedTeam] = useState(initialDisplayedTeam);
  const [currentAction, setCurrentAction] = useState<string>();
  const [playerOneId, setPlayerOneId] = useState<number>(
    displayedTeam.playerOneId
  );
  const [playerTwoId, setPlayerTwoId] = useState<number>(
    displayedTeam.playerTwoId
  );
  const [strength, setStrength] = useState(displayedTeam.strength);
  const [comment, setComment] = useState(displayedTeam.comment);

  useEffect(() => {
    if (getUserAction(params) === UserActions.NONE) {
      navigate("/nosuchpath");
    }
  }, [navigate, params]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDisplayedTeam = () => {
    if (
      getUserAction(params) === UserActions.ADD ||
      getIdOfItemToSaveOrEdit(params) !== displayedTeam.id ||
      playerOneId !== displayedTeam.playerOneId ||
      playerTwoId !== displayedTeam.playerTwoId ||
      comment !== displayedTeam.comment ||
      strength !== displayedTeam.strength
    ) {
      const currentTeamToDisplay = findTeamById(
        teams,
        getIdOfItemToSaveOrEdit(params)
      );
      setDisplayedTeam((prev) => currentTeamToDisplay);
      setPlayerOneId((prev) => currentTeamToDisplay.playerOneId);
      setPlayerTwoId((prev) => currentTeamToDisplay.playerTwoId);
      setStrength((prev) => currentTeamToDisplay.strength);
      setComment((prev) => currentTeamToDisplay.comment);
    }
  };

  useEffect(() => {
    if (currentAction !== getUserAction(params)) {
      setCurrentAction((prev) => getUserAction(params));
      updateDisplayedTeam();
    }
  }, [currentAction, params, params.action, updateDisplayedTeam]);

  // is this not done already in the above useffect?
  useEffect(() => {
    updateDisplayedTeam();
    // do not follow this gudeline or infinite loop ensues:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="darkModal max-w-7xl mx-auto">
      <form className="mx-auto">
        <div className="m-8 border border-sky-500">
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr>
                  {displayedTeam.id === -2 && <th />}
                  {displayedTeam.id === -2 && <th className="text text-center">gracz 1</th>}                  
                  {displayedTeam.id === -2 && <th className="text text-center">gracz 2</th>}                  
                  {displayedTeam.id !== -2 && <th className="text text-center">gracz 1 + gracz 2</th>}               
                  
                  <th className="text text-center">Siła drużyny</th>
                  <th className="text text-center">Uwagi</th>
                   {<th />}
                  <th />
                </tr>
              </thead>
              <tbody>
                {/* rows */}

                <tr>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src="https://img.icons8.com/fluency/96/null/user-male-circle.png"
                            alt="Avatar"
                          />
                        </div>
                      </div>

                      {/* editing team data */}
                      {displayedTeam.id !== -2 && (
                        <div>
                          <div className="font-bold">
                            <p>
                              {findPlayerById(players, playerOneId).firstName}{" "}
                              {findPlayerById(players, playerOneId).lastName}{" "}
                              {"       +       "}
                              {
                                findPlayerById(players, playerTwoId).firstName
                              }{" "}
                              {findPlayerById(players, playerTwoId).lastName}
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  </td>

                  {/* selecting players for a new team */}
                  {displayedTeam.id === -2 && (
                    <>
                      <td className="text text-center">
                        <div className="font-bold">
                          <label htmlFor="" />
                          <select
                            value={playerOneId}
                            onChange={(e) => {
                              if (+e.target.value !== playerTwoId) {
                                setPlayerOneId((prev) => +e.target.value);
                                console.log("ONE: ", +e.target.value);
                              } else
                                console.warn(
                                  "please select a player different from player 2!"
                                );
                            }}
                          >
                            {players
                              .filter(
                                (p) => p.id !== -1 && p.id !== playerTwoId
                              )
                              .map((p) => (
                                <option key={p.id} value={p.id}>
                                  {`${p.firstName}${"   "}${p.lastName}`}
                                </option>
                              ))}
                          </select>
                        </div>
                      </td>

                      <td className="text text-center">
                        <div className="font-bold">
                          <label htmlFor="" />
                          <select
                            value={playerTwoId}
                            onChange={(e) => {
                              if (+e.target.value !== playerOneId) {
                                setPlayerTwoId((prev) => +e.target.value);
                                console.log("TWO: ", +e.target.value);
                              } else
                                console.warn(
                                  "please select a player different from player 1!"
                                );
                            }}
                          >
                            {players
                              .filter(
                                (p) => p.id !== -1 && p.id !== playerOneId
                              )
                              .map((p) => (
                                <option key={99999 + p.id} value={p.id}>
                                  {`${p.firstName}${"   "}${p.lastName}`}
                                </option>
                              ))}
                          </select>
                        </div>
                      </td>
                    </>
                  )}

                  <td className="text text-center">
                    <div className="font-bold">
                      <label htmlFor="" />
                      <select
                        value={strength}
                        onChange={(e) => setStrength((prev) => +e.target.value)}
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="text text-center">
                    <div className="font-bold">
                      <label htmlFor="" />
                      <input
                        style={{ paddingLeft: "10px" }}
                        placeholder="uwagi"
                        value={comment}
                        onChange={(e) => setComment((prev) => e.target.value)}
                      />
                    </div>
                  </td>
                  <th />
                  <th>
                    <button
                      className="btn btn-ghost btn-xs bg-slate-600"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(
                          "idToEdit: ",
                          getIdOfItemToSaveOrEdit(params)
                        );
                        dispatch(
                          saveTeam({
                            id: getIdOfItemToSaveOrEdit(params),
                            isChecked: false,
                            playerOneId,
                            playerTwoId,
                            strength,
                            comment,
                          })
                        );
                      }}
                    >
                      {getUserAction(params) === UserActions.ADD
                        ? "dodaj"
                        : "zapisz"}
                    </button>
                  </th>
                </tr>
              </tbody>
              {/* foot */}
              <tfoot>
                <tr>
                  <th />
                  <th />
                  <th />
                  <th />
                  <th />
                  {displayedTeam.id === -2 && <th />}
                  {displayedTeam.id === -2 && <th />}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </form>
      <PlayerList
        isEditingTournamentParticipants={false}
        // eslint-disable-next-line react/jsx-boolean-value
        isParticipantsSingles={false}
        displayedPlayerUpdater={updateDisplayedTeam}
        assignPlayersToTournament={() => {}}
      />
      <button className="btn btn-ghost btn-xs bg-slate-600 w-10 h-10 positionMeTopRight">
        <Link to="/teams">x</Link>
      </button>
    </div>
  );
}

export default AddOrEditTeam;
