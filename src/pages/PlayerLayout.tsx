import { Link, Outlet } from "react-router-dom";

export interface IPlayerLayoutProps {}

export function PlayerLayout(props: IPlayerLayoutProps) {
  return (
    <div style={{}}>
      <Outlet context={{ decor: "++" }} />
    </div>
  );
}
