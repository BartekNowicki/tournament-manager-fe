import { useOutletContext } from "react-router-dom";

export interface IAddTournamentProps {}

export function AddTournament(props: IAddTournamentProps) {
  const obj: { decor: string } = useOutletContext();
  const { decor } = obj;
  return (
    <div>
      {decor} AddTournament {decor}
    </div>
  );
}
