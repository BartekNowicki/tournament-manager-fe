/* eslint-disable import/prefer-default-export */
/* eslint-disable react/button-has-type */
import { Link } from "react-router-dom";
import PlayerList from "../components/PlayerList";
import { appHeight } from "../utils/settings";

export function Teams() {
  return (
    <div className={`flex flex-col ${appHeight}`}>
      <p className="prose prose-2xl font font-bold mx-auto mt-12 text text-center">
        {/* Pary */}
      </p>
      <button className="btn btn-wide mb-[1vh] mx-auto">
        <Link to="/teams/addoredit/add">nowa para</Link>
      </button>
      <PlayerList
        displayedPlayerUpdater={() => {}}
        assignPlayersToTournament={() => {}}
        isEditingTournamentParticipants={false}
        // eslint-disable-next-line react/jsx-boolean-value
        isParticipantsSingles={false}
        idOfTournamentDisplayedForEditingParticipants={-1}
      />
    </div>
  );
}
