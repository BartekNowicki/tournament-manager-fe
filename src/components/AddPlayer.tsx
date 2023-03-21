/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useRef } from "react";

import { addPlayer } from "../storeContent/storeSlices/playerSlice";
import { useAppDispatch } from "../storeContent/store";

function AddPlayer() {
  const firstName = useRef<string>("");
  const lastName = useRef<string>("");
  const strength = useRef<number>(0);
  const comment = useRef<string>("");
  const dispatch = useAppDispatch();

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
                          onChange={(e) => (firstName.current = e.target.value)}
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
                          onChange={(e) => (lastName.current = e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text text-center">
                  <div className="font-bold">
                    <label htmlFor="" />
                    <select
                      onChange={(e) => (strength.current = +e.target.value)}
                    >
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
                      onChange={(e) => (comment.current = e.target.value)}
                    />
                  </div>
                </td>
                <th>
                  <button
                    className="btn btn-ghost btn-xs bg-slate-600"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        addPlayer({
                          firstName: firstName.current,
                          lastName: lastName.current,
                          strength: strength.current,
                          comment: comment.current,
                        })
                      );
                    }}
                  >
                    Add
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

export default AddPlayer;
