/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";

export enum TournamentType {
  singles,
  doubles,
}

interface ITournamentProps {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
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
      {id} {type} {startDate}
      {endDate} {groupSize}
      {comment}
    </div>
  );
};

export default Tournament;
