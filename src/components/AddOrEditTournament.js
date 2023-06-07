import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
const serialize = (date) => date.toLocaleDateString();
const deserialize = (dateString) => {
    const dateArr = dateString.split(".");
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
    const getUserAction = () => {
        return params.action ?? UserActions.NONE;
    };
    const tournaments = useAppSelector((state) => state.tournament.tournaments);
    const findById = (id) => {
        const placeholderTournament = {
            id: -2,
            startDate: serialize(new Date()),
            endDate: serialize(new Date()),
            type: TournamentType.SINGLES,
            groupSize: 0,
            comment: "",
        };
        if (id === -2)
            return placeholderTournament;
        const foundTournament = tournaments.filter((tournament) => tournament.id === id)[0];
        return {
            ...foundTournament,
            type: foundTournament.type,
            startDate: serialize(getDateOneDayBefore(new Date(`${foundTournament.startDate}`))),
            endDate: serialize(getDateOneDayBefore(new Date(`${foundTournament.endDate}`))),
        };
    };
    const initialDisplayedTournament = findById(getIdOfTournamentToSaveOrEdit());
    const [displayedTournament, setDisplayedTournament] = useState(initialDisplayedTournament);
    const [currentAction, setCurrentAction] = useState();
    const [startDate, setStartDate] = useState(displayedTournament.startDate);
    const [endDate, setEndDate] = useState(displayedTournament.endDate);
    const [type, setType] = useState(displayedTournament.type);
    const [groupSize, setGroupSize] = useState(displayedTournament.groupSize);
    const [comment, setComment] = useState(displayedTournament.comment);
    // const [isAddingOrEditingTournament, setIsAddingOrEditingTournament] =
    //   useState<boolean>(false);
    useEffect(() => {
        if (getUserAction() === UserActions.NONE) {
            navigate("/nosuchpath");
        }
    }, [navigate, getUserAction]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateDisplayedTournament = () => {
        if (getUserAction() === UserActions.ADD ||
            getIdOfTournamentToSaveOrEdit() !== displayedTournament.id ||
            startDate !== displayedTournament.startDate ||
            endDate !== displayedTournament.endDate ||
            type !== displayedTournament.type ||
            groupSize !== displayedTournament.groupSize ||
            comment !== displayedTournament.comment) {
            const currentTournamentToDisplay = findById(getIdOfTournamentToSaveOrEdit());
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
    return (_jsxs("div", { className: "darkModal max-w-7xl mx-auto", children: [_jsx("form", { className: "border border-red-500", children: _jsx("div", { className: "m-8 border border-sky-500", children: _jsx("div", { className: "overflow-x-scroll overflow-y-visible w-full mb-20 pb-60", children: _jsxs("table", { className: "table w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: _jsx("label", {}) }), _jsx("th", { className: "text text-center", children: "Data rozpocz\u0119cia" }), _jsx("th", { className: "text text-center", children: "Data zako\u0144czenia" }), _jsx("th", { className: "text text-center", children: "Rodzaj" }), _jsx("th", { className: "text text-center", children: "Rozmiar grupy" }), _jsx("th", { className: "text text-center", children: "Uwagi" }), _jsx("th", {})] }) }), _jsx("tbody", { children: _jsxs("tr", { children: [_jsx("th", { children: _jsx("label", {}) }), _jsx("td", { children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("label", { htmlFor: "" }), _jsx(DatePicker, { className: "text-center font-bold", dateFormat: "dd/MM/yyyy", selected: new Date(deserialize(startDate)), onChange: (date) => date ? setStartDate((prev) => serialize(date)) : {} })] }) }), _jsx("td", { children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("label", { htmlFor: "" }), _jsx(DatePicker, { className: "text-center font-bold", dateFormat: "dd/MM/yyyy", selected: new Date(deserialize(endDate)), onChange: (date) => date ? setEndDate((prev) => serialize(date)) : {} })] }) }), _jsxs("td", { className: "text text-center", children: [_jsx("label", { htmlFor: "" }), _jsxs("select", { className: "font-bold px-2", value: type === "DOUBLES"
                                                            ? TournamentType.DOUBLES
                                                            : TournamentType.SINGLES, onChange: (e) => setType((prev) => e.target.value), children: [_jsx("option", { value: TournamentType.DOUBLES, children: TournamentType.DOUBLES }), _jsx("option", { value: TournamentType.SINGLES, children: TournamentType.SINGLES })] })] }), _jsx("td", { className: "text text-center", children: _jsxs("div", { className: "font-bold", children: [_jsx("label", { htmlFor: "" }), _jsxs("select", { className: "font-bold px-2", value: groupSize, onChange: (e) => setGroupSize((prev) => +e.target.value), children: [_jsx("option", { value: 0, children: "0" }), _jsx("option", { value: 1, children: "1" }), _jsx("option", { value: 2, children: "2" }), _jsx("option", { value: 3, children: "3" }), _jsx("option", { value: 4, children: "4" }), _jsx("option", { value: 5, children: "5" }), _jsx("option", { value: 6, children: "6" }), _jsx("option", { value: 7, children: "7" }), _jsx("option", { value: 8, children: "8" }), _jsx("option", { value: 9, children: "9" }), _jsx("option", { value: 10, children: "10" })] })] }) }), _jsx("td", { className: "text text-center", children: _jsxs("div", { className: "font-bold", children: [_jsx("label", { htmlFor: "" }), _jsx("input", { style: { paddingLeft: "10px" }, placeholder: "", value: comment, onChange: (e) => setComment((prev) => e.target.value) })] }) }), _jsx("th", { children: _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600", onClick: (e) => {
                                                        e.preventDefault();
                                                        dispatch(saveTournament({
                                                            id: getIdOfTournamentToSaveOrEdit(),
                                                            type,
                                                            startDate,
                                                            endDate,
                                                            groupSize,
                                                            comment,
                                                        }));
                                                    }, children: getUserAction() === UserActions.ADD ? "dodaj" : "zapisz" }) })] }) }), _jsx("tfoot", { children: _jsxs("tr", { children: [_jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {})] }) })] }) }) }) }), _jsx(TournamentList, { displayedTournamentUpdater: updateDisplayedTournament, idOfTournamentDisplayedForEditingData: displayedTournament.id, typeOfTournamentDisplayedForEditingData: displayedTournament.type }), _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600 w-10 h-10 positionMeTopRight", children: _jsx(Link, { to: "/tournaments", children: "x" }) })] }));
}
export default AddOrEditTournament;
