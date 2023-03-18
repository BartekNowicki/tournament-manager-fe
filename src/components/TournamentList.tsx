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
    <>
      <p>this is a list of Tournaments</p>
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
    </>
  );
};

export default TournamentList;
