import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-empty-interface */
import { NavLink } from "react-router-dom";
export function Navbar(props) {
    const linkActive = "border border-sky-500 border-b-1";
    const linkClass = "btn btn-ghost normal-case text-xl";
    const activeLinkClass = `${linkClass} ${linkActive}`;
    const destinations = [
        "Home",
        "Turnieje",
        "Uczestnicy",
        "Lokalizacja",
        "Kontakt",
    ];
    const routeToDestinationMapping = new Map();
    routeToDestinationMapping.set("Home", "/");
    routeToDestinationMapping.set("Turnieje", "/tournaments");
    routeToDestinationMapping.set("Uczestnicy", "/players");
    routeToDestinationMapping.set("Lokalizacja", "/location");
    routeToDestinationMapping.set("Kontakt", "/contact");
    return (_jsx("nav", { className: "navbar bg-neutral text-neutral-content flex justify-around mx-auto", children: destinations.map((destination, index) => (_jsx(NavLink, { to: routeToDestinationMapping.get(destination), className: ({ isActive }) => (isActive ? activeLinkClass : linkClass), children: destination }, String(index + destination)))) }));
}
