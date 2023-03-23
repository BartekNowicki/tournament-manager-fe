/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Link } from "react-router-dom";
import PlayerList from "../components/PlayerList";

export interface IPlayersProps {}

export function Players(props: IPlayersProps) {
  return (
    <>
      <p className="prose prose-2xl font font-bold mx-auto mt-12">
        Uczestniczy
      </p>
      <button className="btn btn-wide m-2 mb-12">
        <Link to="/players/addoredit/add">nowy uczestnik</Link>
      </button>
      <PlayerList />
    </>
  );
}
