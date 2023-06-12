import { Link, Outlet } from "react-router-dom";

export interface ITeamLayoutProps {}

export function TeamLayout(props: ITeamLayoutProps) {
  return (
    <div style={{}}>
      <Outlet context={{ decor: "++" }} />
    </div>
  );
}
