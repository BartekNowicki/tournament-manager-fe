import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { savePlayer } from "../storeContent/storeSlices/playerSlice";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import PlayerList from "./PlayerList";
export var UserActions;
(function (UserActions) {
    UserActions["ADD"] = "add";
    UserActions["EDIT"] = "edit";
    UserActions["NONE"] = "none";
})(UserActions || (UserActions = {}));
function AddOrEditPlayer() {
    const navigate = useNavigate();
    const params = useParams() ?? {};
    const dispatch = useAppDispatch();
    // id = -2 => reserved for adding a new player
    // id = -1 => reserved for hidden allPlayers isChecked
    const getIdOfPlayerToSaveOrEdit = () => {
        let idOfPlayerToSaveOrEdit = -2;
        if (params.action) {
            idOfPlayerToSaveOrEdit =
                params.action !== "add"
                    ? parseInt(params.action.split("").slice(4).join(""), 10)
                    : idOfPlayerToSaveOrEdit;
        }
        return idOfPlayerToSaveOrEdit;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getUserAction = () => {
        return params.action ?? UserActions.NONE;
    };
    const players = useAppSelector((state) => state.player.players);
    const findById = (id) => {
        const placeholderPlayer = {
            id: -2,
            isChecked: false,
            firstName: "",
            lastName: "",
            strength: 0,
            comment: "",
        };
        if (id === -2)
            return placeholderPlayer;
        return players.filter((player) => player.id === id)[0];
    };
    const initialDisplayedPlayer = findById(getIdOfPlayerToSaveOrEdit());
    const [displayedPlayer, setDisplayedPlayer] = useState(initialDisplayedPlayer);
    const [currentAction, setCurrentAction] = useState();
    const [firstName, setFirstName] = useState(displayedPlayer.firstName);
    const [lastName, setLastName] = useState(displayedPlayer.lastName);
    const [strength, setStrength] = useState(displayedPlayer.strength);
    const [comment, setComment] = useState(displayedPlayer.comment);
    useEffect(() => {
        if (getUserAction() === UserActions.NONE) {
            navigate("/nosuchpath");
        }
    }, [navigate, getUserAction]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateDisplayedPlayer = () => {
        if (getUserAction() === UserActions.ADD ||
            getIdOfPlayerToSaveOrEdit() !== displayedPlayer.id ||
            firstName !== displayedPlayer.firstName ||
            lastName !== displayedPlayer.lastName ||
            comment !== displayedPlayer.comment ||
            strength !== displayedPlayer.strength) {
            const currentPlayerToDisplay = findById(getIdOfPlayerToSaveOrEdit());
            setDisplayedPlayer((prev) => currentPlayerToDisplay);
            setFirstName((prev) => currentPlayerToDisplay.firstName);
            setLastName((prev) => currentPlayerToDisplay.lastName);
            setStrength((prev) => currentPlayerToDisplay.strength);
            setComment((prev) => currentPlayerToDisplay.comment);
        }
    };
    useEffect(() => {
        if (currentAction !== getUserAction()) {
            setCurrentAction((prev) => getUserAction());
            updateDisplayedPlayer();
        }
    }, [currentAction, getUserAction, params.action, updateDisplayedPlayer]);
    // is this not done already in the above useffect?
    useEffect(() => {
        updateDisplayedPlayer();
        // do not follow this gudeline or infinite loop ensues:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (_jsxs("div", { className: "darkModal max-w-7xl mx-auto", children: [_jsx("form", { className: "mx-auto", children: _jsx("div", { className: "m-8 border border-sky-500", children: _jsx("div", { className: "overflow-x-auto w-full", children: _jsxs("table", { className: "table w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "text text-center", children: "Imi\u0119 i Nazwisko" }), _jsx("th", { className: "text text-center", children: "Si\u0142a" }), _jsx("th", { className: "text text-center", children: "Uwagi" }), _jsx("th", {}), _jsx("th", {})] }) }), _jsx("tbody", { children: _jsxs("tr", { children: [_jsx("td", { children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "avatar", children: _jsx("div", { className: "mask mask-squircle w-12 h-12", children: _jsx("img", { src: "https://img.icons8.com/fluency/96/null/user-male-circle.png", alt: "Avatar" }) }) }), _jsx("div", { children: _jsxs("div", { className: "font-bold", children: [_jsx("label", { htmlFor: "" }), _jsx("input", { style: { paddingLeft: "10px" }, placeholder: "imi\u0119", value: firstName, onChange: (e) => setFirstName((prev) => e.target.value) })] }) })] }) }), _jsx("td", { children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "avatar", children: _jsx("div", { className: "mask mask-squircle w-12 h-12", children: _jsx("img", { src: "https://img.icons8.com/fluency/96/null/user-male-circle.png", alt: "Avatar" }) }) }), _jsx("div", { children: _jsxs("div", { className: "font-bold", children: [_jsx("label", { htmlFor: "" }), _jsx("input", { style: { paddingLeft: "10px" }, placeholder: "nazwisko", value: lastName, onChange: (e) => setLastName((prev) => e.target.value) })] }) })] }) }), _jsx("td", { className: "text text-center", children: _jsxs("div", { className: "font-bold", children: [_jsx("label", { htmlFor: "" }), _jsxs("select", { value: strength, onChange: (e) => setStrength((prev) => +e.target.value), children: [_jsx("option", { value: 0, children: "0" }), _jsx("option", { value: 1, children: "1" }), _jsx("option", { value: 2, children: "2" }), _jsx("option", { value: 3, children: "3" }), _jsx("option", { value: 4, children: "4" }), _jsx("option", { value: 5, children: "5" }), _jsx("option", { value: 6, children: "6" }), _jsx("option", { value: 7, children: "7" }), _jsx("option", { value: 8, children: "8" }), _jsx("option", { value: 9, children: "9" }), _jsx("option", { value: 10, children: "10" })] })] }) }), _jsx("td", { className: "text text-center", children: _jsxs("div", { className: "font-bold", children: [_jsx("label", { htmlFor: "" }), _jsx("input", { style: { paddingLeft: "10px" }, placeholder: "uwagi", value: comment, onChange: (e) => setComment((prev) => e.target.value) })] }) }), _jsx("th", { children: _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600", onClick: (e) => {
                                                        e.preventDefault();
                                                        console.log("idToEdit: ", getIdOfPlayerToSaveOrEdit());
                                                        dispatch(savePlayer({
                                                            id: getIdOfPlayerToSaveOrEdit(),
                                                            isChecked: false,
                                                            firstName,
                                                            lastName,
                                                            strength,
                                                            comment,
                                                        }));
                                                    }, children: getUserAction() === UserActions.ADD ? "dodaj" : "zapisz" }) })] }) }), _jsx("tfoot", { children: _jsxs("tr", { children: [_jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {})] }) })] }) }) }) }), _jsx(PlayerList, { isEditingTournamentParticipants: false, isParticipantsSingles: false, displayedPlayerUpdater: updateDisplayedPlayer, assignPlayersToTournament: () => { } }), _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600 w-10 h-10 positionMeTopRight", children: _jsx(Link, { to: "/players", children: "x" }) })] }));
}
export default AddOrEditPlayer;
