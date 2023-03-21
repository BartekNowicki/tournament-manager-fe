/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Link } from "react-router-dom";
import TournamentList from "../components/TournamentList";

export interface ITournamentsProps {}

export function Tournaments(props: ITournamentsProps) {
  return (
    <>
      <p className="prose prose-2xl font font-bold mx-auto mt-12">Turnieje</p>
      <button className="btn btn-wide m-2 mb-12">
        <Link to="/tournaments/add">Dodaj nowy</Link>
      </button>
      <TournamentList />
    </>
  );
}
