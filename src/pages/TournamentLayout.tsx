import { Link, Outlet } from "react-router-dom";

export interface ITournamentLayoutProps {}

export function TournamentLayout(props: ITournamentLayoutProps) {
  return (
    <div style={{ border: "2px solid blue" }}>
      <Outlet context={{ decor: "**" }} />
    </div>
  );
}
