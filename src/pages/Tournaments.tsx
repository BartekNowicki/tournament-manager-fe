/* eslint-disable @typescript-eslint/no-empty-interface */
import { Link } from "react-router-dom";
import TournamentList from "../components/TournamentList";

export interface ITournamentsProps {}

export function Tournaments(props: ITournamentsProps) {
  return (
    <>
      <div>Tournaments</div>
      <Link to="/tournaments/add">Dodaj nowy</Link>
      <TournamentList />
    </>
  );
}
