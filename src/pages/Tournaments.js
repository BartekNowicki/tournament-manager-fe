import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
// @ts-nocheck
import { Link } from "react-router-dom";
import TournamentList from "../components/TournamentList";
export function Tournaments(props) {
    return (_jsxs("div", { className: "flex flex-col", children: [_jsx("p", { className: "prose prose-2xl font font-bold mx-auto mt-12 text text-center", children: "Turnieje" }), _jsx("button", { className: "btn btn-wide m-2 mb-12 mx-auto", children: _jsx(Link, { to: "/tournaments/addOrEdit/add", children: "Nowy turniej" }) }), _jsx(TournamentList, { displayedTournamentUpdater: () => { }, idOfTournamentDisplayedForEditingData: -1 })] }));
}
