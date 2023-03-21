/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { useAppSelector } from "../storeContent/store";
import Tournament from "./Tournament";

interface ITournamentListProps {}

const TournamentList: React.FunctionComponent<ITournamentListProps> = (
  props
) => {
  const tournaments = useAppSelector((state) => state.tournament.tournaments);

  return (
    <div className="m-8 border border-sky-500">
      {tournaments.map((tournament) => (
        <Tournament
          key={tournament.id}
          id={tournament.id}
          type={tournament.type}
          startDate={tournament.startDate}
          endDate={tournament.endDate}
          groupSize={tournament.groupSize}
          comment={tournament.comment}
        />
      ))}
    </div>
  );
};

export default TournamentList;
