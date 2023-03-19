/* eslint-disable @typescript-eslint/no-empty-interface */
import { NavLink } from "react-router-dom";

export interface INavbarProps {}

export function Navbar(props: INavbarProps) {
  const primaryNavBg = "bg-neutral-200";
  const primaryLinkBg = "bg-green-500";
  const linkActive = "bg-green-400 border border-sky-500 border-b-4";
  const linkClass = `flex items-center border m-4 px-4 py-2 text-gray-700 rounded hover:bg-green-400 transition duration-300`;
  const activeLinkClass = `${linkClass} ${linkActive}`;
  const inactiveLinkClass = `${linkClass} ${primaryLinkBg}`;
  const destinations: string[] = [
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

  return (
    <nav
      className={`max-w-3xl flex justify-around mx-auto border mb-5 ${primaryNavBg}`}
    >
      {destinations.map((destination, index) => (
        <NavLink
          key={String(index + destination)}
          to={routeToDestinationMapping.get(destination)}
          className={({ isActive }) =>
            isActive ? activeLinkClass : inactiveLinkClass
          }
        >
          {destination}
        </NavLink>
      ))}
    </nav>
  );
}
