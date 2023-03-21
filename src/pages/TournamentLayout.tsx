import { Link, Outlet } from "react-router-dom";

export interface ITournamentLayoutProps {}

export function TournamentLayout(props: ITournamentLayoutProps) {
  return (
    <div style={{}}>
      <Outlet context={{ decor: "**" }} />
    </div>
  );
}
