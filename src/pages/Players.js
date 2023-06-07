import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Link } from "react-router-dom";
import PlayerList from "../components/PlayerList";
export function Players(props) {
    return (_jsxs("div", { className: "flex flex-col", children: [_jsx("p", { className: "prose prose-2xl font font-bold mx-auto mt-12 text text-center", children: "Uczestnicy" }), _jsx("button", { className: "btn btn-wide m-2 mb-12 mx-auto", children: _jsx(Link, { to: "/players/addoredit/add", children: "nowy uczestnik" }) }), _jsx(PlayerList, { displayedPlayerUpdater: () => { }, assignPlayersToTournament: () => { }, isEditingTournamentParticipants: false, 
                // eslint-disable-next-line react/jsx-boolean-value
                isParticipantsSingles: true })] }));
}
