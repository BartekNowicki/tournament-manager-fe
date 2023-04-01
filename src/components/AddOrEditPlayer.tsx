/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useCallback, useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import {
  Player,
  addPlayer,
  updatePlayer,
} from "../storeContent/storeSlices/playerSlice";
import { useAppDispatch, useAppSelector } from "../storeContent/store";

// savePlayer,

export enum UserActions {
  ADD = "add",
  EDIT = "edit",
  NONE = "none",
}

function AddOrEditPlayer() {
  const navigate = useNavigate();
  const params = useParams() ?? {};
  let idToEdit = -1;
  if (params.action) {
    idToEdit =
      params.action !== "add"
        ? parseInt(params.action.split("").slice(4).join(""), 10)
        : -1;
  }

  const userAction: string = params.action ?? UserActions.NONE;
  const players = useAppSelector((state) => state.player.players);
  const findById = useCallback(
    (id: number) => {
      const dummyPlayer: Player = {
        id: -1,
        isChecked: false,
        firstName: "",
        lastName: "",
        strength: 0,
        comment: "",
      };
      if (id === -1) return dummyPlayer;
      return players.filter((player) => player.id === id)[0];
    },
    [players]
  );

  const initialDisplayedPlayer: Player = findById(idToEdit);
  const [displayedPlayer, setDisplayedPlayer] = useState(
    initialDisplayedPlayer
  );
  const [firstName, setFirstName] = useState(displayedPlayer.firstName);
  const [lastName, setLastName] = useState(displayedPlayer.lastName);
  const [strength, setStrength] = useState(displayedPlayer.strength);
  const [comment, setComment] = useState(displayedPlayer.comment);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userAction === UserActions.NONE) {
      navigate("/nosuchpath");
    }
  }, [navigate, idToEdit, userAction]);

  return (
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
                          onChange={(e) => setFirstName(e.target.value)}
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
                          onChange={(e) => setLastName(e.target.value)}
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
                      onChange={(e) => setStrength(+e.target.value)}
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
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </td>
                <th>
                  <button
                    className="btn btn-ghost btn-xs bg-slate-600"
                    onClick={(e) => {
                      e.preventDefault();
                      if (userAction === UserActions.ADD) {
                        dispatch(
                          addPlayer({
                            firstName,
                            lastName,
                            strength,
                            comment,
                          })
                          // savePlayer(firstName)
                        );
                      } else {
                        dispatch(
                          updatePlayer({
                            idToEdit,
                            firstName,
                            lastName,
                            strength,
                            comment,
                          })
                        );
                      }
                    }}
                  >
                    {userAction === UserActions.ADD ? "dodaj" : "zapisz"}
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
  );
}

export default AddOrEditPlayer;
