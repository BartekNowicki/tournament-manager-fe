import { jsxs as _jsxs } from "react/jsx-runtime";
export var TournamentType;
(function (TournamentType) {
    TournamentType["SINGLES"] = "singles";
    TournamentType["DOUBLES"] = "doubles";
})(TournamentType || (TournamentType = {}));
const Tournament = ({ id, type, startDate, endDate, groupSize, comment, }) => {
    return (_jsxs("div", { children: [id, " ", type, " ", startDate, endDate, " ", groupSize, comment] }, id));
};
export default Tournament;
