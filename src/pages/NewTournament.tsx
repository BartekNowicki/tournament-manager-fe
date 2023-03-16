import { useOutletContext } from "react-router-dom";

export interface INewTournamentProps {}

export function NewTournament(props: INewTournamentProps) {
  const obj: { decor: string } = useOutletContext();
  const { decor } = obj;
  return (
    <div>
      {decor} NewTournament {decor}
    </div>
  );
}
