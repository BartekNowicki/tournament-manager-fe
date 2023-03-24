/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
  addTournament,
  updateTournament,
  Tournament,
} from "../storeContent/storeSlices/tournamentSlice";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import { TournamentType } from "./Tournament";
import "react-datepicker/dist/react-datepicker.css";
import { UserActions } from "./AddOrEditPlayer";

const serialize = (date: Date): string => date.toLocaleDateString();
const deserialize = (dateString: string) => {
  const dateArr: string[] = dateString.split(".");
  return `"${dateArr[1]}.${dateArr[0]}.${dateArr[2]}"`;
};

function AddOrEditTournament() {
  // const [startDate, setStartDate] = useState(serialize(new Date()));
  // const [endDate, setEndDate] = useState(serialize(new Date()));
  // const [type, setType] = useState<string>(TournamentType.DOUBLES);
  // const [groupSize, setGroupSize] = useState(0);
  // const [comment, setComment] = useState<string>("");

  const dispatch = useAppDispatch();

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
  const tournaments = useAppSelector((state) => state.tournament.tournaments);
  const findById = useCallback(
    (id: number) => {
      const dummyTournament: Tournament = {
        id: -1,
        startDate: serialize(new Date()),
        endDate: serialize(new Date()),
        type: TournamentType.SINGLES,
        groupSize: 0,
        comment: "",
      };
      if (id === -1) return dummyTournament;
      return tournaments.filter((tournament) => tournament.id === id)[0];
    },
    [tournaments]
  );

  const initialDisplayedTournament: Tournament = findById(idToEdit);
  const [displayedTournament, setDisplayedTournament] = useState(
    initialDisplayedTournament
  );
  const [startDate, setStartDate] = useState(displayedTournament.startDate);
  const [endDate, setEndDate] = useState(displayedTournament.endDate);
  const [type, setType] = useState<string>(displayedTournament.type);
  const [groupSize, setGroupSize] = useState(displayedTournament.groupSize);
  const [comment, setComment] = useState<string>(displayedTournament.comment);

  useEffect(() => {
    if (userAction === UserActions.NONE) {
      navigate("/nosuchpath");
    }
  }, [navigate, idToEdit, userAction]);

  return (
    <form>
      <div className="m-8 border border-sky-500">
        <div className="overflow-y-visible w-full">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label />
                </th>
                <th className="text text-center">Data rozpoczęcia</th>
                <th className="text text-center">Data zakończenia</th>
                <th className="text text-center">Rodzaj</th>
                <th className="text text-center">Rozmiar grupy</th>
                <th className="text text-center">Uwagi</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <label />
                </th>
                <td>
                  <div className="flex items-center space-x-3">
                    <label htmlFor="" />
                    <DatePicker
                      className="text-center font-bold"
                      dateFormat="dd/MM/yyyy"
                      selected={new Date(deserialize(startDate))}
                      onChange={(date) =>
                        date ? setStartDate(serialize(date)) : {}
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-3">
                    <label htmlFor="" />
                    <DatePicker
                      className="text-center font-bold"
                      dateFormat="dd/MM/yyyy"
                      selected={new Date(deserialize(endDate))}
                      onChange={(date) =>
                        date ? setEndDate(serialize(date)) : {}
                      }
                    />
                  </div>
                </td>
                <td className="text text-center">
                  <label htmlFor="" />
                  <select
                    className="font-bold px-2"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="doubles">{TournamentType.DOUBLES}</option>
                    <option value="singles">{TournamentType.SINGLES}</option>
                  </select>
                </td>
                <td className="text text-center">
                  <div className="font-bold">
                    <label htmlFor="" />
                    <select
                      className="font-bold px-2"
                      value={groupSize}
                      onChange={(e) => setGroupSize(+e.target.value)}
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
                      placeholder=""
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
                          addTournament({
                            type,
                            startDate,
                            endDate,
                            groupSize,
                            comment,
                          })
                        );
                      } else {
                        dispatch(
                          updateTournament({
                            idToEdit,
                            type,
                            startDate,
                            endDate,
                            groupSize,
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

export default AddOrEditTournament;
