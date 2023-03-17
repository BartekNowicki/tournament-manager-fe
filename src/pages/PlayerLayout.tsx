import { Link, Outlet } from "react-router-dom";

export interface IPlayerLayoutProps {}

export function PlayerLayout(props: IPlayerLayoutProps) {
  return (
    <div style={{ border: "1px solid pink" }}>
      <Outlet context={{ decor: "++" }} />
    </div>
  );
}
