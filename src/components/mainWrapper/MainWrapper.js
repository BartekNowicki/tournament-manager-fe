import { jsx as _jsx } from "react/jsx-runtime";
const MainWrapper = ({ children, }) => {
    const primaryMainBg = "bg-transparent";
    return (_jsx("div", { className: `max-w-7xl mx-auto border border-black ${primaryMainBg}`, children: children }));
};
export default MainWrapper;
