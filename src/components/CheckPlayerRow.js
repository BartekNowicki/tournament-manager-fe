import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import PlayerInfoColumns from "./PlayerInfoColumns";
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const CheckPlayerRow = ({ handleCheck, id, isChecked, player, }) => {
    return (_jsxs(_Fragment, { children: [_jsx("th", { children: _jsx("label", { children: _jsx("input", { type: "checkbox", className: "checkbox", id: id.toString(), checked: isChecked(id), onChange: handleCheck }) }) }), _jsx(PlayerInfoColumns, { player: player })] }));
};
export default CheckPlayerRow;
