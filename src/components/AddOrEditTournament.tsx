/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
  Tournament,
  saveTournament,
} from "../storeContent/storeSlices/tournamentSlice";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import "react-datepicker/dist/react-datepicker.css";
import { UserActions } from "./AddOrEditPlayer";
import { TournamentType } from "./Tournament";
import TournamentList from "./TournamentList";
import { numericOptions } from "./numericOptions";
import { findTournamentById, log } from "../utils/funcs";

function AddOrEditTournament() {
  const navigate = useNavigate();
  const params = useParams() ?? {};
  const dispatch = useAppDispatch();
  // id = -2 => reserved for adding a new tournament

  const getIdOfTournamentToSaveOrEdit = (): number =>
    params.id ? parseInt(params.id, 10) : -2;
  const getTypeOfTournamentToSaveOrEdit = (): string => params.type ?? "NONE";
  const getUserAction = (): string => params.action ?? UserActions.NONE;

  const tournaments = useAppSelector((state) => state.tournament.tournaments);

  const [id, setId] = useState<number>(getIdOfTournamentToSaveOrEdit());
  const [type, setType] = useState<string>(getTypeOfTournamentToSaveOrEdit());
  const [displayedTournament, setDisplayedTournament] = useState<Tournament>(
    findTournamentById(tournaments, id, type)
  );
  const [currentAction, setCurrentAction] = useState<string>(getUserAction());
  const [startDate, setStartDate] = useState<Date>(
    displayedTournament.startDate
  );
  const [endDate, setEndDate] = useState<Date>(displayedTournament.endDate);
  const [groupSize, setGroupSize] = useState(displayedTournament.groupSize);
  const [comment, setComment] = useState<string>(displayedTournament.comment);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDisplayedTournament = (
    tournamentId: number,
    tournamentType: string
  ) => {
    if (tournamentId !== id || tournamentType !== type) {
      log("UPDATING...");
      const currentTournamentToDisplay: Tournament = findTournamentById(
        tournaments,
        tournamentId,
        tournamentType
      );

      setCurrentAction((prev) => getUserAction());
      setDisplayedTournament((prev) => currentTournamentToDisplay);
      setId((prev) => currentTournamentToDisplay.id);
      setStartDate((prev) => currentTournamentToDisplay.startDate);
      setEndDate((prev) => currentTournamentToDisplay.endDate);
      setType((prev) => currentTournamentToDisplay.type);
      setGroupSize((prev) => currentTournamentToDisplay.groupSize);
      setComment((prev) => currentTournamentToDisplay.comment);
    }
  };

  useEffect(() => {
    if (getUserAction() === UserActions.NONE) {
      navigate("/nosuchpath");
    }
  }, [navigate, getUserAction]);

  useEffect(() => {
    log("ADDOREDIT TOURNAMENT - PARAMS: ", params);
  });

  useEffect(() => {
    // console.log("ADDOREDIT PANEL SHOWS:", displayedTournament);
    // console.log("startdate", startDate);
    // console.log("enddate", endDate);
    // console.log("type", type);
    // console.log("id", id);
    // console.log("displayedTournament", displayedTournament);
  });

  return (
    <div className="darkModal max-w-7xl mx-auto">
      <form className="border border-red-500">
        <div className="m-8 border border-sky-500">
          <div className="overflow-x-scroll overflow-y-visible w-full mb-20 pb-60">
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
                        selected={new Date(startDate)}
                        onChange={(date) =>
                          date ? setStartDate((prev) => date) : {}
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
                        selected={new Date(endDate)}
                        onChange={(date) =>
                          date ? setEndDate((prev) => date) : {}
                        }
                      />
                    </div>
                  </td>
                  {params.action === "add" && (
                    <td className="text text-center">
                      <label htmlFor="" />
                      <select
                        className="font-bold px-2"
                        value={type}
                        onChange={(e) => {
                          setType((prev) => e.target.value);
                        }}
                      >
                        <option value={TournamentType.DOUBLES}>
                          {TournamentType.DOUBLES}
                        </option>
                        <option value={TournamentType.SINGLES}>
                          {TournamentType.SINGLES}
                        </option>
                      </select>
                    </td>
                  )}
                  {params.action !== "add" && (
                    <td className="text text-center">{type}</td>
                  )}
                  {displayedTournament.groups.length === 0 && (
                    <td className="text text-center">
                      <div className="font-bold">
                        <label htmlFor="" />
                        <select
                          className="font-bold px-2"
                          value={groupSize}
                          onChange={(e) =>
                            setGroupSize((prev) => +e.target.value)
                          }
                        >
                          {numericOptions(11)}
                        </select>
                      </div>
                    </td>
                  )}
                  {displayedTournament.groups.length !== 0 && (
                    <td>{displayedTournament.groupSize}</td>
                  )}
                  <td className="text text-center">
                    <div className="font-bold">
                      <label htmlFor="" />
                      <input
                        style={{ paddingLeft: "10px" }}
                        placeholder=""
                        value={comment}
                        onChange={(e) => setComment((prev) => e.target.value)}
                      />
                    </div>
                  </td>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs bg-slate-600"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          saveTournament({
                            id,
                            type,
                            startDate,
                            endDate,
                            groupSize,
                            comment,
                          })
                        );
                      }}
                    >
                      {getUserAction() === UserActions.ADD ? "dodaj" : "zapisz"}
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
      <TournamentList
        displayedTournamentUpdater={updateDisplayedTournament}
        idOfTournamentDisplayedForEditingData={displayedTournament.id}
        typeOfTournamentDisplayedForEditingData={displayedTournament.type}
      />
      <button className="btn btn-ghost btn-xs bg-slate-600 w-10 h-10 positionMeTopRight">
        <Link to="/tournaments">x</Link>
      </button>
    </div>
  );
}

export default AddOrEditTournament;
