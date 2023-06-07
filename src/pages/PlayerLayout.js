import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
export function PlayerLayout(props) {
    return (_jsx("div", { style: {}, children: _jsx(Outlet, { context: { decor: "++" } }) }));
}
