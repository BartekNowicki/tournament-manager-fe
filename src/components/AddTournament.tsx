/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useRef, useState } from "react";

import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { parseISO } from "date-fns";
import pl from "date-fns/locale/pl";
import { addTournament } from "../storeContent/storeSlices/tournamentSlice";
import { useAppDispatch } from "../storeContent/store";
import { TournamentType } from "./Tournament";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pl", pl);
setDefaultLocale("pl");

function AddTournament() {
  const [startDate, setStartDate] = useState(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState(new Date("2023-01-02"));
  const type = useRef<string>(TournamentType[1]);
  const groupSize = useRef<number>(0);
  const comment = useRef<string>("");
  const dispatch = useAppDispatch();

  const makeDateSerializable = (date: Date): string =>
    date.toLocaleDateString();

  return (
    <form>
      <label htmlFor="">Typ:</label>
      <select onChange={(e) => (type.current = e.target.value)}>
        <option value="doubles">{TournamentType[1]}</option>
        <option value="singles">{TournamentType[0]}</option>
      </select>
      <label htmlFor="">Data rozpoczęcia:</label>
      <DatePicker
        dateFormat="MM/dd/yyyy"
        selected={startDate}
        onChange={(date) => (date ? setStartDate(date) : {})}
      />
      <label htmlFor="">Data zakończenia:</label>
      <DatePicker
        dateFormat="MM/dd/yyyy"
        selected={endDate}
        onChange={(date) => (date ? setEndDate(date) : {})}
      />
      <input
        onChange={(e) => (groupSize.current = parseInt(e.target.value, 10))}
      />
      <label htmlFor="">Uwagi:</label>
      <input onChange={(e) => (comment.current = e.target.value)} />
      <button
        onClick={(e) => {
          e.preventDefault();
          const serializedStartDate = makeDateSerializable(startDate);
          const serializedEndDate = makeDateSerializable(endDate);
          dispatch(
            addTournament({
              type: type.current,
              serializedStartDate,
              serializedEndDate,
              groupSize: groupSize.current,
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

export default AddTournament;
