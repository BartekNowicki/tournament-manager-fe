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
    <form>
      <label htmlFor="">Imię:</label>
      <input onChange={(e) => (firstName.current = e.target.value)} />
      <label htmlFor="">Nazwisko:</label>
      <input onChange={(e) => (lastName.current = e.target.value)} />
      <label htmlFor="">Siła:</label>
      <input
        onChange={(e) => (strength.current = parseInt(e.target.value, 10))}
      />
      <label htmlFor="">Uwagi:</label>
      <input onChange={(e) => (comment.current = e.target.value)} />
      <button
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
    </form>
  );
}

export default AddPlayer;
