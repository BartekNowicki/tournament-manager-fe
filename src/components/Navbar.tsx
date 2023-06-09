/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { NavLink } from "react-router-dom";

export function Navbar() {
  const linkActive = "border border-sky-500 border-b-1";
  const linkClass = "btn btn-ghost normal-case text-xl";
  const activeLinkClass = `${linkClass} ${linkActive}`;
  const destinations: string[] = [
    "Home",
    "Turnieje",
    "Uczestnicy",
    "Pary",
    "Lokalizacja",
    "Kontakt",
  ];
  const routeToDestinationMapping = new Map();
  routeToDestinationMapping.set("Home", "/");
  routeToDestinationMapping.set("Turnieje", "/tournaments");
  routeToDestinationMapping.set("Uczestnicy", "/players");
  routeToDestinationMapping.set("Pary", "/teams");
  routeToDestinationMapping.set("Lokalizacja", "/location");
  routeToDestinationMapping.set("Kontakt", "/contact");

  return (
    <nav className="navbar bg-neutral-900 opacity-80 rounded-lg text-neutral-content text-sky-500 flex justify-around mx-auto">
      {destinations.map((destination, index) => (
        <NavLink
          key={String(index + destination)}
          to={routeToDestinationMapping.get(destination)}
          className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
        >
          {destination}
        </NavLink>
      ))}
    </nav>
  );
}
