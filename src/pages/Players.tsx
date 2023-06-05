/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Link } from "react-router-dom";
import PlayerList from "../components/PlayerList";

export interface IPlayersProps {}

export function Players(props: IPlayersProps) {
  return (
    <div className="flex flex-col">
      <p className="prose prose-2xl font font-bold mx-auto mt-12 text text-center">
        Uczestnicy
      </p>
      <button className="btn btn-wide m-2 mb-12 mx-auto">
        <Link to="/players/addoredit/add">nowy uczestnik</Link>
      </button>
      <PlayerList
        displayedPlayerUpdater={() => {}}
        assignPlayersToTournament={() => {}}
        isEditingTournamentParticipants={false}
        isParticipantsSingles = {true}
      />
    </div>
  );
}
