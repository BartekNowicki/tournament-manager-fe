/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";

export enum TournamentType {
  // SINGLES = "singles",
  // DOUBLES = "doubles",
  SINGLES = "SINGLES",
  DOUBLES = "DOUBLES",
}

interface ITournamentProps {
  id: number;
  type: string;
  startDate: Date;
  endDate: Date;
  groupSize: number;
  comment: string;
}

const Tournament: React.FunctionComponent<ITournamentProps> = ({
  id,
  type,
  startDate,
  endDate,
  groupSize,
  comment,
}) => {
  return (
    <div key={id}>
      {id} {type} {startDate.getDate()}
      {endDate.getDate()} {groupSize}
      {comment}
    </div>
  );
};

export default Tournament;
