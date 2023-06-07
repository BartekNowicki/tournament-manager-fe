import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import TeamInfoColumns from "./TeamInfoColumns";
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const CheckTeamRow = ({ handleCheck, id, isChecked, team, findPlayerById, }) => {
    return (_jsxs(_Fragment, { children: [_jsx("th", { children: _jsx("label", { children: _jsx("input", { type: "checkbox", className: "checkbox", id: id.toString(), checked: isChecked(id), onChange: handleCheck }) }) }), _jsx(TeamInfoColumns, { playerOne: findPlayerById(team.playerOneId), playerTwo: findPlayerById(team.playerTwoId), team: team })] }));
};
export default CheckTeamRow;
