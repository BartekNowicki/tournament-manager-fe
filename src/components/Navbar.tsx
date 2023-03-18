/* eslint-disable @typescript-eslint/no-empty-interface */
import { NavLink } from "react-router-dom";

export interface INavbarProps {}

export function Navbar(props: INavbarProps) {
  const activeColor = "#00FF00";
  const inactiveColor = "";
  return (
    <>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          background: isActive ? activeColor : inactiveColor,
        })}
      >
        Home
      </NavLink>
      <NavLink to="/tournaments">Turnieje</NavLink>
      <NavLink to="/players">Uczestnicy</NavLink>
      <NavLink to="/location">Lokalizacja</NavLink>
      <NavLink to="/contact">Kontakt</NavLink>
    </>
  );
}
