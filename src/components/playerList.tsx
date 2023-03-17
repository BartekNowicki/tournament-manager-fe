/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { useAppSelector } from "../storeContent/store";

interface IPlayerListProps {}

const PlayerList: React.FunctionComponent<IPlayerListProps> = (props) => {
  const players = useAppSelector((state) => state.player.players);

  return (
    <>
      <p>this is a list of players</p>
      {players.map((player) => (
        <li key={player.id}>
          {player.id} {player.firstName} {player.lastName}
        </li>
      ))}
    </>
  );
};

export default PlayerList;
