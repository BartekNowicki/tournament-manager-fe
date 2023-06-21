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
  placeholderTournament,
  saveTournament,
} from "../storeContent/storeSlices/tournamentSlice";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import "react-datepicker/dist/react-datepicker.css";
import { UserActions } from "./AddOrEditPlayer";
import { TournamentType } from "./Tournament";
import TournamentList from "./TournamentList";
import { numericOptions } from "./numericOptions";
import {
  deserializeDate,
  findTournamentById,
  serializeDate,
} from "../utils/funcs";

function AddOrEditTournament() {
  const navigate = useNavigate();
  const params = useParams() ?? {};
  const dispatch = useAppDispatch();
  // id = -2 => reserved for adding a new tournament

  const getIdOfTournamentToSaveOrEdit = () => {
    let idOfTournamentToSaveOrEdit = -2;
    if (params.action) {
      idOfTournamentToSaveOrEdit =
        params.action !== "add"
          ? parseInt(params.action.split("").slice(4).join(""), 10)
          : idOfTournamentToSaveOrEdit;
    }
    return idOfTournamentToSaveOrEdit;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserAction = (): string => {
    return params.action ?? UserActions.NONE;
  };

  const tournaments = useAppSelector((state) => state.tournament.tournaments);

  const initialDisplayedTournament = findTournamentById(
    tournaments,
    getIdOfTournamentToSaveOrEdit()
  );
  const [displayedTournament, setDisplayedTournament] = useState<Tournament>(
    initialDisplayedTournament
  );
  const [currentAction, setCurrentAction] = useState<string>();
  const [startDate, setStartDate] = useState<string>(
    displayedTournament.startDate
  );
  const [endDate, setEndDate] = useState<string>(displayedTournament.endDate);
  const [type, setType] = useState<string>(displayedTournament.type);
  const [groupSize, setGroupSize] = useState(displayedTournament.groupSize);
  const [comment, setComment] = useState<string>(displayedTournament.comment);
  // const [isAddingOrEditingTournament, setIsAddingOrEditingTournament] =
  //   useState<boolean>(false);

  useEffect(() => {
    if (getUserAction() === UserActions.NONE) {
      navigate("/nosuchpath");
    }
  }, [navigate, getUserAction]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDisplayedTournament = () => {
    if (
      getUserAction() === UserActions.ADD ||
      getIdOfTournamentToSaveOrEdit() !== displayedTournament.id ||
      startDate !== displayedTournament.startDate ||
      endDate !== displayedTournament.endDate ||
      type !== displayedTournament.type ||
      groupSize !== displayedTournament.groupSize ||
      comment !== displayedTournament.comment
    ) {
      const currentTournamentToDisplay = findTournamentById(
        tournaments,
        getIdOfTournamentToSaveOrEdit()
      );

      setDisplayedTournament((prev) => currentTournamentToDisplay);
      setStartDate((prev) => currentTournamentToDisplay.startDate);
      setEndDate((prev) => currentTournamentToDisplay.endDate);
      setType((prev) => currentTournamentToDisplay.type);
      setGroupSize((prev) => currentTournamentToDisplay.groupSize);
      setComment((prev) => currentTournamentToDisplay.comment);
      // console.log("SWITCHING TO ", currentTournamentToDisplay.type);
    }
  };

  useEffect(() => {
    if (currentAction !== getUserAction()) {
      setCurrentAction((prev) => getUserAction());
      updateDisplayedTournament();
    }
  }, [currentAction, getUserAction, params.action, updateDisplayedTournament]);

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
                        selected={new Date(deserializeDate(startDate))}
                        onChange={(date) =>
                          date
                            ? setStartDate((prev) => serializeDate(date))
                            : {}
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
                        selected={new Date(deserializeDate(endDate))}
                        onChange={(date) =>
                          date ? setEndDate((prev) => serializeDate(date)) : {}
                        }
                      />
                    </div>
                  </td>
                  <td className="text text-center">
                    <label htmlFor="" />
                    <select
                      className="font-bold px-2"
                      value={
                        type === "DOUBLES"
                          ? TournamentType.DOUBLES
                          : TournamentType.SINGLES
                      }
                      onChange={(e) => setType((prev) => e.target.value)}
                    >
                      <option value={TournamentType.DOUBLES}>
                        {TournamentType.DOUBLES}
                      </option>
                      <option value={TournamentType.SINGLES}>
                        {TournamentType.SINGLES}
                      </option>
                    </select>
                  </td>
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
                        const id = getIdOfTournamentToSaveOrEdit();
                        const t = findTournamentById(tournaments, id);
                        const { participatingPlayers } = t;
                        const { participatingPlayerIds } = t;
                        const { participatingTeams } = t;
                        const { participatingTeamIds } = t;
                        const { groups } = t;
                        const { groupIds } = t;

                        dispatch(
                          saveTournament({
                            id,
                            type,
                            startDate,
                            endDate,
                            groupSize,
                            comment,
                            participatingPlayers,
                            participatingPlayerIds,
                            participatingTeams,
                            participatingTeamIds,
                            groups,
                            groupIds,
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
