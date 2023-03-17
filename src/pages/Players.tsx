import { Link } from "react-router-dom";
import PlayerList from "../components/playerList";

export interface IPlayersProps {}

export function Players(props: IPlayersProps) {
  return (
    <>
      <div>Players</div>
      <Link to="/players/add">Dodaj nowy</Link>
      <PlayerList />
    </>
  );
}
