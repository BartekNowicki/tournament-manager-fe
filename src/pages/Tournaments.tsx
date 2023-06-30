/* eslint-disable import/no-cycle */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { Link } from "react-router-dom";
import TournamentList from "../components/TournamentList";
import { appHeight } from "../utils/settings";

export interface ITournamentsProps {}

export function Tournaments(props: ITournamentsProps) {
  return (
    // <div className="flex flex-col">
    <div className={`flex flex-col ${appHeight}`}>
      <p className="prose prose-2xl font font-bold mx-auto mt-12 text text-center">
        {/* Turnieje */}
      </p>
      <button className="btn btn-wide mb-[1vh] mx-auto">
        <Link to="/tournaments/addoredit/add/SINGLES/-2">Nowy turniej</Link>
      </button>
      <TournamentList
        displayedTournamentUpdater={() => {}}
        idOfTournamentDisplayedForEditingData={-1}
        typeOfTournamentDisplayedForEditingData="none"
      />
    </div>
  );
}
