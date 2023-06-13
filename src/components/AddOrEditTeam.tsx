/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useEffect, useState } from "react";

import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import PlayerList from "./PlayerList";
import {
  UserActions,
  findPlayerById,
  getIdOfItemToSaveOrEdit,
  getUserAction,
} from "./AddOrEditPlayer";
import { saveTeam } from "../storeContent/storeSlices/teamSlice";

function AddOrEditTeam() {
  const navigate = useNavigate();
  const params = useParams() ?? {};
  const dispatch = useAppDispatch();
  // id = -2 => reserved for adding a new team
  // id = -1 => reserved for hidden allTeams isChecked (shown only on assignment)

  // const getIdOfTeamToSaveOrEdit = () => {
  //   let idOfTeamToSaveOrEdit = -2;
  //   if (params.action) {
  //     idOfTeamToSaveOrEdit =
  //       params.action !== "add"
  //         ? parseInt(params.action.split("").slice(4).join(""), 10)
  //         : idOfTeamToSaveOrEdit;
  //   }
  //   return idOfTeamToSaveOrEdit;
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const getUserAction = (): string => {
  //   return params.action ?? UserActions.NONE;
  // };
  const teams = useAppSelector((state) => state.team.teams);
  const players = useAppSelector((state) => state.player.players);
  const findTeamById = (id: number) => {
    const placeholderTeam = {
      id: -2,
      isChecked: false,
      playerOneId: -2,
      playerTwoId: -2,
      strength: 0,
      comment: "",
    };
    if (id === -2) return placeholderTeam;
    return teams.filter((team) => team.id === id)[0];
  };

  const initialDisplayedTeam = findTeamById(getIdOfItemToSaveOrEdit(params));
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
                  <th className="text text-center">Imię i Nazwisko</th>
                  <th className="text text-center">Siła</th>
                  <th className="text text-center">Uwagi</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {/* rows */}

                <tr>
                  {/* <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src="https://img.icons8.com/fluency/96/null/user-male-circle.png"
                            alt="Avatar"
                          />
                        </div>
                      </div>
                      <div> */}
                  {/* <div className="font-bold">
                          <label htmlFor="" />
                          <input
                            style={{ paddingLeft: "10px" }}
                            placeholder="imię"
                            value={firstName}
                            onChange={(e) =>
                              setFirstName((prev) => e.target.value)
                            }
                          />
                        </div> */}

                  {/* </div>
                    </div>
                  </td>
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
                      <div> */}
                  {/* <div className="font-bold">
                          <label htmlFor="" />
                          <input
                            style={{ paddingLeft: "10px" }}
                            placeholder="nazwisko"
                            value={lastName}
                            onChange={(e) =>
                              setLastName((prev) => e.target.value)
                            }
                          />
                        </div> */}
                  {/* </div>
                    </div>
                  </td> */}

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
                    </div>
                  </td>

                  <td className="text text-center">
                    <div className="font-bold">
                      <label htmlFor="" />
                      <select
                        value={strength}
                        onChange={(e) => setStrength((prev) => +e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        <option value={10}>10</option>
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
        <Link to="/players">x</Link>
      </button>
    </div>
  );
}

export default AddOrEditTeam;
