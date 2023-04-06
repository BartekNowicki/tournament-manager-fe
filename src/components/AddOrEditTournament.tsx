/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { saveTournament } from "../storeContent/storeSlices/tournamentSlice";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import "react-datepicker/dist/react-datepicker.css";
import { UserActions } from "./AddOrEditPlayer";
import { TournamentType } from "./Tournament";
import TournamentList from "./TournamentList";
import { getDateOneDayBefore } from "../utils/dates";

// these functions are only to communicate the date from the date picker to component state and back, not with redux and db
// redux and db date conversion takes place in the tournamentSlice
const serialize = (date: Date): string => date.toLocaleDateString();
const deserialize = (dateString: string) => {
  const dateArr: string[] = dateString.split(".");
  return `"${dateArr[1]}.${dateArr[0]}.${dateArr[2]}"`;
};

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
  const findById = (id: number) => {
    const placeholderTournament = {
      id: -2,
      startDate: serialize(new Date()),
      endDate: serialize(new Date()),
      type: TournamentType.SINGLES,
      groupSize: 0,
      comment: "",
    };
    if (id === -2) return placeholderTournament;

    const foundTournament = tournaments.filter(
      (tournament) => tournament.id === id
    )[0];

    return {
      ...foundTournament,
      type: foundTournament.type,
      startDate: serialize(
        getDateOneDayBefore(new Date(`${foundTournament.startDate}`))
      ),
      endDate: serialize(
        getDateOneDayBefore(new Date(`${foundTournament.endDate}`))
      ),
    };
  };

  const initialDisplayedTournament = findById(getIdOfTournamentToSaveOrEdit());
  const [displayedTournament, setDisplayedTournament] = useState(
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

  useEffect(() => {
    if (getUserAction() === UserActions.NONE) {
      navigate("/nosuchpath");
    }
  }, [navigate, getUserAction]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDisplayedTournament = () => {
    console.log(
      type,
      displayedTournament.type,
      type === displayedTournament.type
    );

    if (
      getUserAction() === UserActions.ADD ||
      getIdOfTournamentToSaveOrEdit() !== displayedTournament.id ||
      startDate !== displayedTournament.startDate ||
      endDate !== displayedTournament.endDate ||
      type !== displayedTournament.type ||
      groupSize !== displayedTournament.groupSize ||
      comment !== displayedTournament.comment
    ) {
      const currentTournamentToDisplay = findById(
        getIdOfTournamentToSaveOrEdit()
      );

      setDisplayedTournament((prev) => currentTournamentToDisplay);
      setStartDate((prev) => currentTournamentToDisplay.startDate);
      setEndDate((prev) => currentTournamentToDisplay.endDate);
      setType((prev) => currentTournamentToDisplay.type);
      setGroupSize((prev) => currentTournamentToDisplay.groupSize);
      setComment((prev) => currentTournamentToDisplay.comment);
      console.log("SWITCHING TO ", currentTournamentToDisplay.type);
      // console.log("SWITCHING TO ", currentTournamentToDisplay);
    }
  };

  useEffect(() => {
    if (currentAction !== getUserAction()) {
      setCurrentAction((prev) => getUserAction());
      updateDisplayedTournament();
    }
  }, [currentAction, getUserAction, params.action, updateDisplayedTournament]);

  const updateType = (): TournamentType => {
    if (!type) throw new Error("Function not implemented.");
    return type === TournamentType.DOUBLES
      ? TournamentType.DOUBLES
      : TournamentType.SINGLES;
  };

  // // is this not done already in the above useffect?
  // useEffect(() => {
  //   updateDisplayedTournament();
  //   // do not follow this gudeline or infinite loop ensues:
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
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
                        selected={new Date(deserialize(startDate))}
                        onChange={(date) =>
                          date ? setStartDate((prev) => serialize(date)) : {}
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
                          date ? setEndDate((prev) => serialize(date)) : {}
                        }
                      />
                    </div>
                  </td>
                  <td className="text text-center">
                    <label htmlFor="" />
                    <select
                      className="font-bold px-2"
                      // value={type}
                      value={updateType()}
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
                        onChange={(e) => setComment((prev) => e.target.value)}
                      />
                    </div>
                  </td>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs bg-slate-600"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(
                          "idToEdit: ",
                          getIdOfTournamentToSaveOrEdit()
                        );
                        dispatch(
                          saveTournament({
                            id: getIdOfTournamentToSaveOrEdit(),
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
      <TournamentList displayedTournamentUpdater={updateDisplayedTournament} />;
    </>
  );
}

export default AddOrEditTournament;
