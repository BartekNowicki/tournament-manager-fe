/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";

interface IPlayerProps {
  id: number;
  firstName: string;
  lastName: string;
  strength: number;
  comment: string;
}

const Player: React.FunctionComponent<IPlayerProps> = ({
  id,
  firstName,
  lastName,
  strength,
  comment,
}) => {
  return (
    <li key={id}>
      {id} {firstName} {lastName} {strength} {comment}
    </li>
  );
};

export default Player;
