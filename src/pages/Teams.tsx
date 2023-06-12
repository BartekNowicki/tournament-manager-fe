/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Link } from "react-router-dom";
import PlayerList from "../components/PlayerList";

export interface ITeamsProps {}

export function Teams(props: ITeamsProps) {
  return (
    <div className="flex flex-col">
      <p className="prose prose-2xl font font-bold mx-auto mt-12 text text-center">
        Pary
      </p>
      <button className="btn btn-wide m-2 mb-12 mx-auto">
        <Link to="/teams/addoredit/add">nowa para</Link>
      </button>
      <PlayerList
        displayedPlayerUpdater={() => {}}
        assignPlayersToTournament={() => {}}
        isEditingTournamentParticipants={false}
        // eslint-disable-next-line react/jsx-boolean-value
        isParticipantsSingles={false}
      />
    </div>
  );
}
