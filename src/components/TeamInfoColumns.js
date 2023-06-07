import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
const TeamInfoColumns = ({ playerOne, playerTwo, team, }) => {
    return (_jsxs(_Fragment, { children: [_jsx("td", { children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "avatar", children: _jsx("div", { className: "mask mask-squircle w-12 h-12", children: _jsx("img", { src: "https://img.icons8.com/fluency/96/null/user-male-circle.png", alt: "Avatar" }) }) }), _jsx("div", { children: _jsx("div", { className: "font-bold", children: _jsxs("p", { children: [playerOne.firstName, " ", playerOne.lastName, " ", "       +       ", playerTwo.firstName, " ", playerTwo.lastName] }) }) })] }) }), _jsx("td", { className: "text text-center", children: team.strength }), _jsx("td", { className: "text text-center", children: team.comment })] }));
};
export default TeamInfoColumns;
