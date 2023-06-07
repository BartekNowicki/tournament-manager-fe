import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import { assignPlayersToTournament, deleteTournament, fetchAllTournaments, } from "../storeContent/storeSlices/tournamentSlice";
import { getAdjustedDates } from "../utils/dates"; // @ts-ignore
import PlayerList from "./PlayerList";
import { checkPlayers, fetchAllPlayers, } from "../storeContent/storeSlices/playerSlice";
import { checkTeams } from "../storeContent/storeSlices/teamSlice";
const TournamentList = ({ idOfTournamentDisplayedForEditingData, typeOfTournamentDisplayedForEditingData, displayedTournamentUpdater, }) => {
    const tournaments = useAppSelector((state) => state.tournament.tournaments);
    const players = useAppSelector((state) => state.player.players);
    const teams = useAppSelector((state) => state.team.teams);
    const dispatch = useAppDispatch();
    const [idOfTournamentDisplayedForEditingParticipants, setIdOfTournamentDisplayedForEditingParticipants,] = useState(-1);
    const [typeOfTournamentDisplayedForEditingParticipants, setTypeOfTournamentDisplayedForEditingParticipants,] = useState(typeOfTournamentDisplayedForEditingData);
    const isAddingOrEditingTournamentMode = () => idOfTournamentDisplayedForEditingData !== -1;
    const injectHeaders = () => (_jsxs(_Fragment, { children: [_jsx("th", { className: "text text-center", children: "Data" }), _jsx("th", { className: "text text-center", children: "Rodzaj" }), _jsx("th", { className: "text text-center", children: "Rozmiar grupy" }), _jsx("th", { className: "text text-center", children: "Uwagi" })] }));
    const isToBeHighlightedForEditingParticipants = (id, type) => id === idOfTournamentDisplayedForEditingParticipants &&
        type === typeOfTournamentDisplayedForEditingParticipants;
    const isToBeHighlightedForEditingData = (id, type) => id === idOfTournamentDisplayedForEditingData &&
        type === typeOfTournamentDisplayedForEditingData;
    const highlighted = () => "border-solid border-2 border-sky-500";
    const matchPlayerIsCheckedDBStatusToTournamentParticipation = (tournamentId, tournamentType) => {
        console.log("matching for tournament type: ", tournamentType, "tournamentId: ", tournamentId);
        const selectedTournament = tournaments.find((t) => t.id === tournamentId &&
            t.type === typeOfTournamentDisplayedForEditingParticipants);
        if (selectedTournament) {
            const participants = typeOfTournamentDisplayedForEditingParticipants === "SINGLES"
                ? selectedTournament.participatingPlayers
                : selectedTournament.participatingTeams;
            const participantIds = participants && participants.map((p) => p.id);
            console.log("matching for tournament type: ", typeOfTournamentDisplayedForEditingParticipants, "id: ", idOfTournamentDisplayedForEditingParticipants, "participants: ", participantIds);
            const newIdToCheckStatusMapping = new Map();
            if (typeOfTournamentDisplayedForEditingParticipants === "SINGLES" &&
                typeof participantIds !== "undefined") {
                // eslint-disable-next-line no-restricted-syntax
                for (const p of players) {
                    newIdToCheckStatusMapping.set(p.id, false);
                }
                // eslint-disable-next-line no-restricted-syntax
                for (const id of participantIds) {
                    newIdToCheckStatusMapping.set(id, true);
                }
                if (newIdToCheckStatusMapping.size > 0) {
                    // console.log("DISPATCH: ", newIdToCheckStatusMapping);
                    dispatch(checkPlayers(newIdToCheckStatusMapping));
                }
            }
            else if (typeOfTournamentDisplayedForEditingParticipants === "DOUBLES" &&
                typeof participantIds !== "undefined") {
                // eslint-disable-next-line no-restricted-syntax
                for (const t of teams) {
                    newIdToCheckStatusMapping.set(t.id, false);
                }
                // eslint-disable-next-line no-restricted-syntax
                for (const id of participantIds) {
                    newIdToCheckStatusMapping.set(id, true);
                }
                if (newIdToCheckStatusMapping.size > 0) {
                    checkTeams(newIdToCheckStatusMapping);
                }
            }
        }
    };
    const handleParticipantsClick = (tournamentId, tournamentType) => {
        console.log("click uczestnicy: ", tournamentId, tournamentType);
        setIdOfTournamentDisplayedForEditingParticipants((prev) => tournamentId);
        setTypeOfTournamentDisplayedForEditingParticipants((prev) => tournamentType);
        matchPlayerIsCheckedDBStatusToTournamentParticipation(tournamentId, tournamentType);
    };
    useEffect(() => {
        console.log(`TournamentList showing participants of: ${idOfTournamentDisplayedForEditingParticipants} data: ${idOfTournamentDisplayedForEditingData}`);
    });
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "m-8 border border-sky-500", children: _jsx("div", { className: "overflow-x-auto w-full", children: _jsxs("table", { className: "table w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [injectHeaders(), !isAddingOrEditingTournamentMode() && _jsx("th", {}), _jsx("th", {}), _jsx("th", {})] }) }), _jsx("tbody", { children: Boolean(tournaments.length) &&
                                    tournaments.map((tournament) => (_jsxs("tr", { className: isToBeHighlightedForEditingParticipants(tournament.id, tournament.type) ||
                                            isToBeHighlightedForEditingData(tournament.id, tournament.type)
                                            ? highlighted()
                                            : "", children: [_jsx("td", { children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "avatar", children: _jsx("div", { className: "mask mask-squircle w-12 h-12", children: _jsx("img", { src: "https://img.icons8.com/fluency/96/null/medal.png", alt: "Avatar" }) }) }), _jsx("div", { children: _jsx("div", { className: "font-bold", children: _jsx("div", { children: getAdjustedDates(tournament.startDate, tournament.endDate) }) }) })] }) }), _jsx("td", { className: "text text-center", children: tournament.type }), _jsx("td", { className: "text text-center", children: tournament.groupSize }), _jsx("td", { className: "text text-center", children: tournament.comment }), _jsx("th", { children: _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600", onClick: () => {
                                                        if (displayedTournamentUpdater)
                                                            displayedTournamentUpdater();
                                                    }, disabled: isToBeHighlightedForEditingData(tournament.id, tournament.type), children: _jsx(Link, { to: `/tournaments/addoredit/edit${tournament.id}`, children: "edytuj" }) }) }), _jsx("th", { children: _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600", onClick: (e) => {
                                                        dispatch(deleteTournament(tournament.id));
                                                    }, disabled: isToBeHighlightedForEditingData(tournament.id, tournament.type), children: "usu\u0144" }) }), !isAddingOrEditingTournamentMode() && (_jsx("th", { children: _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600", onClick: () => {
                                                        handleParticipantsClick(tournament.id, tournament.type);
                                                    }, children: "uczestnicy" }) }))] }, tournament.id + tournament.startDate + tournament.comment))) }), _jsx("tfoot", { children: _jsxs("tr", { children: [!isAddingOrEditingTournamentMode() && _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {})] }) })] }) }) }), idOfTournamentDisplayedForEditingParticipants > -1 &&
                createPortal(_jsxs("div", { className: "darkModal max-w-7xl mx-auto", children: [_jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600 w-10 h-10 positionMeTopRight", onClick: () => setIdOfTournamentDisplayedForEditingParticipants((prev) => -1), children: "x" }), _jsx("div", { className: "m-8 border border-sky-500", children: _jsx("div", { style: { maxHeight: "25vh" }, className: "overflow-x-auto w-full", children: _jsxs("table", { className: "table w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [injectHeaders(), !isAddingOrEditingTournamentMode() && _jsx("th", {})] }) }), _jsx("tbody", { children: Boolean(tournaments.length) &&
                                                tournaments.map((tournament) => (_jsxs("tr", { className: isToBeHighlightedForEditingParticipants(tournament.id, tournament.type)
                                                        ? highlighted()
                                                        : "", children: [_jsx("td", { children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "avatar", children: _jsx("div", { className: "mask mask-squircle w-12 h-12", children: _jsx("img", { src: "https://img.icons8.com/fluency/96/null/medal.png", alt: "Avatar" }) }) }), _jsx("div", { children: _jsx("div", { className: "font-bold", children: _jsx("div", { children: getAdjustedDates(tournament.startDate, tournament.endDate) }) }) })] }) }), _jsx("td", { className: "text text-center", children: tournament.type }), _jsx("td", { className: "text text-center", children: tournament.groupSize }), _jsx("td", { className: "text text-center", children: tournament.comment }), !isAddingOrEditingTournamentMode() && (_jsx("th", { children: _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600", onClick: () => {
                                                                    handleParticipantsClick(tournament.id, tournament.type);
                                                                }, children: "uczestnicy" }) }))] }, tournament.id +
                                                    tournament.type +
                                                    tournament.startDate))) }), _jsx("tfoot", { children: _jsxs("tr", { children: [!isAddingOrEditingTournamentMode() && _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {})] }) })] }) }) }), _jsx(PlayerList, { isEditingTournamentParticipants: true, idOfTournamentDisplayedForEditingParticipants: idOfTournamentDisplayedForEditingParticipants, isParticipantsSingles: typeOfTournamentDisplayedForEditingParticipants === "SINGLES", displayedPlayerUpdater: () => { }, assignPlayersToTournament: async ({ tournamentId, type, }) => {
                                await dispatch(assignPlayersToTournament({
                                    tournamentId: idOfTournamentDisplayedForEditingParticipants,
                                    type,
                                }));
                                await dispatch(fetchAllPlayers());
                                dispatch(fetchAllTournaments());
                            } })] }), document.body)] }));
};
export default TournamentList;
