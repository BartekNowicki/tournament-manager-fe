import { Link } from "react-router-dom";

export interface ITournamentsProps {}

export function Tournaments(props: ITournamentsProps) {
  return (
    <>
      <div>Tournaments</div>
      <Link to="/tournaments/new">Dodaj nowy</Link>
    </>
  );
}
