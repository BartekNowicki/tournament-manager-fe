import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeContent/store";
import { checkPlayers, deletePlayer, } from "../storeContent/storeSlices/playerSlice";
import { checkTeams } from "../storeContent/storeSlices/teamSlice";
import CheckPlayerRow from "./CheckPlayerRow";
import CheckTeamRow from "./CheckTeamRow";
import PlayerInfoColumns from "./PlayerInfoColumns";
const PlayerList = ({ displayedPlayerUpdater, isEditingTournamentParticipants, idOfTournamentDisplayedForEditingParticipants, isParticipantsSingles, assignPlayersToTournament, }) => {
    const players = useAppSelector((state) => state.player.players);
    const teams = useAppSelector((state) => state.team.teams);
    const forceRenderCount = useAppSelector((state) => state.player.forceRerenderPlayerListCount);
    const dispatch = useAppDispatch();
    const findPlayerById = useCallback((id) => {
        return players.filter((player) => player.id === id)[0];
    }, [players]);
    const findTeamById = useCallback((id) => {
        return teams.filter((team) => team.id === id)[0];
    }, [teams]);
    const isPlayerChecked = useCallback((id) => {
        const found = findPlayerById(id);
        return found && found.isChecked === true;
    }, [findPlayerById]);
    const isTeamChecked = useCallback((id) => {
        const found = findTeamById(id);
        return found && found.isChecked === true;
    }, [findTeamById]);
    const handleCheck = useCallback((e, type) => {
        const key = +e.target.id;
        const newIdToCheckStatusMapping = new Map();
        if (key !== -1) {
            if (type === "player") {
                const player = findPlayerById(key);
                newIdToCheckStatusMapping.set(player.id, !isPlayerChecked(player.id));
                dispatch(checkPlayers(newIdToCheckStatusMapping));
            }
            else if (type === "team") {
                const team = findTeamById(key);
                newIdToCheckStatusMapping.set(team.id, !isTeamChecked(team.id));
                dispatch(checkTeams(newIdToCheckStatusMapping));
            }
            // need this redundant if otherwise the linter goes crazy changing code
        }
        else if (key === -1) {
            if (type === "player") {
                const commonOppositeStateForAll = !isPlayerChecked(-1) || false;
                // eslint-disable-next-line no-restricted-syntax
                for (const p of players) {
                    newIdToCheckStatusMapping.set(p.id, commonOppositeStateForAll);
                }
                if (newIdToCheckStatusMapping) {
                    dispatch(checkPlayers(newIdToCheckStatusMapping));
                }
            }
            else if (type === "team") {
                const commonOppositeStateForAll = !isTeamChecked(-1) || false;
                // eslint-disable-next-line no-restricted-syntax
                for (const t of teams) {
                    newIdToCheckStatusMapping.set(t.id, commonOppositeStateForAll);
                }
                if (newIdToCheckStatusMapping) {
                    dispatch(checkTeams(newIdToCheckStatusMapping));
                }
            }
        }
    }, [
        dispatch,
        findPlayerById,
        findTeamById,
        isPlayerChecked,
        isTeamChecked,
        players,
        teams,
    ]);
    useEffect(() => { });
    // this should not be required under normal flow but here we have a tailwind table and that requires an explicit rerender
    useEffect(() => { }, [forceRenderCount]);
    const items = !isParticipantsSingles ? teams : players;
    return (_jsx("div", { className: "m-8 border border-sky-500 addPlayersPanel", children: _jsxs("div", { style: isEditingTournamentParticipants
                ? { maxHeight: "65vh" }
                : { maxHeight: "75vh" }, className: "overflow-x-auto w-full", children: [_jsxs("table", { className: "table w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [isEditingTournamentParticipants && (_jsx("th", { children: _jsx("label", { children: _jsx("input", { type: "checkbox", className: "checkbox", id: "-1", checked: isParticipantsSingles
                                                    ? isPlayerChecked(-1) === true
                                                    : isTeamChecked(-1), onChange: isParticipantsSingles
                                                    ? (e) => handleCheck(e, "player")
                                                    : (e) => handleCheck(e, "team") }) }) })), _jsx("th", { className: "text text-center", children: "Imi\u0119 i Nazwisko" }), _jsx("th", { className: "text text-center", children: "Si\u0142a" }), _jsx("th", { className: "text text-center", children: "Uwagi" }), !isEditingTournamentParticipants && _jsx("th", {}), !isEditingTournamentParticipants && _jsx("th", {})] }) }), _jsx("tbody", { children: Boolean(items.length) &&
                                items
                                    // @ts-ignore
                                    .filter((item) => item.id !== -1)
                                    .map((item) => (_jsxs("tr", { children: [isEditingTournamentParticipants &&
                                            (isParticipantsSingles ? (_jsx(CheckPlayerRow, { handleCheck: (e) => handleCheck(e, "player"), id: item.id, isChecked: isPlayerChecked, player: item })) : (_jsx(CheckTeamRow, { handleCheck: (e) => handleCheck(e, "team"), id: item.id, isChecked: isTeamChecked, team: item, findPlayerById: findPlayerById }))), !isEditingTournamentParticipants && (_jsxs(_Fragment, { children: [_jsx(PlayerInfoColumns, { player: item }), _jsx("th", { children: _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600", onClick: () => {
                                                            if (displayedPlayerUpdater)
                                                                displayedPlayerUpdater();
                                                        }, children: _jsx(Link, { to: `/players/addoredit/edit${item.id}`, children: "edytuj" }) }) }), _jsx("th", { children: _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600", onClick: (e) => {
                                                            dispatch(deletePlayer(item.id));
                                                        }, children: "usu\u0144" }) })] }))] }, isParticipantsSingles // @ts-ignore
                                    ? item.id + item.firstName + item.lastName // @ts-ignore
                                    : item.id + item.playerOneId + item.playerTwoId))) }), _jsx("tfoot", { children: _jsxs("tr", { children: [!isEditingTournamentParticipants && _jsx("th", {}), !isEditingTournamentParticipants && _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), _jsx("th", {}), isEditingTournamentParticipants && _jsx("th", {})] }) })] }), isEditingTournamentParticipants && (_jsx("div", { children: _jsx("button", { className: "btn btn-ghost btn-xs bg-slate-600 positionMeBottomRight", onClick: isParticipantsSingles
                            ? () => assignPlayersToTournament({
                                tournamentId: idOfTournamentDisplayedForEditingParticipants,
                                type: "singles",
                            })
                            : () => assignPlayersToTournament({
                                tournamentId: idOfTournamentDisplayedForEditingParticipants,
                                type: "doubles",
                            }), children: "zapisz uczestnik\u00F3w" }) }))] }) }));
};
export default PlayerList;
