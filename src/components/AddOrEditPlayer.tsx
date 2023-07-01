/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useEffect, useState } from "react";

import { useParams, useNavigate, Link, Params } from "react-router-dom";
import {
  Player,
  emptyPlayer,
  placeholderPlayer,
  savePlayer,
} from "../storeContent/storeSlices/playerSlice";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
// eslint-disable-next-line import/no-cycle
import PlayerList from "./PlayerList";
import { numericOptions } from "./numericOptions";
import { findPlayerById } from "../utils/funcs";
import { btnSaveColor } from "../utils/settings";

export enum UserActions {
  ADD = "add",
  EDIT = "edit",
  NONE = "none",
}

export const getUserAction = (params: Readonly<Params<string>>): string => {
  if (params && params.action) {
    return params.action;
  }
  return UserActions.NONE;
};

// export const getIdOfItemToSaveOrEdit = (
//   params: Readonly<Params<string>>
// ): number => {
//   let idOfPlayerToSaveOrEdit = -2;
//   if (params && params.action) {
//     idOfPlayerToSaveOrEdit =
//       params.action !== UserActions.ADD
//         ? parseInt(params.action.split("").slice(4).join(""), 10)
//         : idOfPlayerToSaveOrEdit;
//   }
//   return idOfPlayerToSaveOrEdit;
// };

export const getIdOfItemToSaveOrEdit = (
  params: Readonly<Params<string>>
): number => {
  let idOfPlayerToSaveOrEdit = -1;
  if (params && params.action) {
    idOfPlayerToSaveOrEdit =
      params.action !== UserActions.ADD
        ? parseInt(params.action.split("").slice(4).join(""), 10)
        : -2;
  }
  return idOfPlayerToSaveOrEdit;
};

function AddOrEditPlayer() {
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params = useParams() ?? {};
  const dispatch = useAppDispatch();
  // id = -2 => reserved for adding a new player
  // id = -1 => reserved for hidden allPlayers isChecked (shown only on assignment)

  const players = useAppSelector((state) => state.player.players);

  const initialDisplayedPlayer: Player = findPlayerById(
    players,
    getIdOfItemToSaveOrEdit(params)
  );
  const [displayedPlayer, setDisplayedPlayer] = useState(
    initialDisplayedPlayer
  );
  const [currentAction, setCurrentAction] = useState<string>();
  const [firstName, setFirstName] = useState(displayedPlayer.firstName);
  const [lastName, setLastName] = useState(displayedPlayer.lastName);
  const [strength, setStrength] = useState(displayedPlayer.strength);
  const [comment, setComment] = useState(displayedPlayer.comment);

  useEffect(() => {
    if (getUserAction(params) === UserActions.NONE) {
      navigate("/nosuchpath");
    }
  }, [navigate, params]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDisplayedPlayer = () => {
    if (
      getUserAction(params) === UserActions.ADD ||
      getIdOfItemToSaveOrEdit(params) !== displayedPlayer.id ||
      firstName !== displayedPlayer.firstName ||
      lastName !== displayedPlayer.lastName ||
      comment !== displayedPlayer.comment ||
      strength !== displayedPlayer.strength
    ) {
      const currentPlayerToDisplay = findPlayerById(
        players,
        getIdOfItemToSaveOrEdit(params)
      );
      setDisplayedPlayer((prev) => currentPlayerToDisplay);
      setFirstName((prev) => currentPlayerToDisplay.firstName);
      setLastName((prev) => currentPlayerToDisplay.lastName);
      setStrength((prev) => currentPlayerToDisplay.strength);
      setComment((prev) => currentPlayerToDisplay.comment);
    }
  };

  useEffect(() => {
    if (currentAction !== getUserAction(params)) {
      setCurrentAction((prev) => getUserAction(params));
      updateDisplayedPlayer();
    }
  }, [currentAction, params, params.action, updateDisplayedPlayer]);

  // is this not done already in the above useffect?
  useEffect(() => {
    updateDisplayedPlayer();
    // do not follow this gudeline or infinite loop ensues:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="darkModal max-w-7xl mx-auto">
      <form className="mx-auto">
        <div className="m-8">
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
                          <label htmlFor="" />
                          <input
                            style={{ paddingLeft: "10px" }}
                            placeholder="imię"
                            value={firstName}
                            onChange={(e) =>
                              setFirstName((prev) => e.target.value)
                            }
                          />
                        </div>
                      </div>
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
                      <div>
                        <div className="font-bold">
                          <label htmlFor="" />
                          <input
                            style={{ paddingLeft: "10px" }}
                            placeholder="nazwisko"
                            value={lastName}
                            onChange={(e) =>
                              setLastName((prev) => e.target.value)
                            }
                          />
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
                        {/* <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        <option value={10}>10</option> */}

                        {/* {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))} */}

                        {numericOptions(11)}
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
                  <th>
                    <button
                      className={`btn btn-ghost btn-s ${btnSaveColor}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const id: number = getIdOfItemToSaveOrEdit(params);
                        console.log("idToEdit: ", id);
                        const p = findPlayerById(players, id);
                        const isChecked = p.isChecked || false;
                        const { playedSinglesTournaments } = p;
                        const { belongsToGroups } = p;
                        const { belongsToGroupIds } = p;
                        dispatch(
                          savePlayer({
                            id,
                            isChecked,
                            firstName,
                            lastName,
                            strength,
                            comment,
                            playedSinglesTournaments,
                            belongsToGroups,
                            belongsToGroupIds,
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
        isParticipantsSingles={true}
        displayedPlayerUpdater={updateDisplayedPlayer}
        assignPlayersToTournament={() => {}}
      />
      <button className="btn btn-ghost btn-s bg-slate-600 w-10 h-10 positionMeTopRight">
        <Link to="/players">x</Link>
      </button>
    </div>
  );
}

export default AddOrEditPlayer;
