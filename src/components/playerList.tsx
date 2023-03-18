/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { useAppSelector } from "../storeContent/store";
import Player from "./Player";

interface IPlayerListProps {}

const PlayerList: React.FunctionComponent<IPlayerListProps> = (props) => {
  const players = useAppSelector((state) => state.player.players);

  return (
    <>
      <p>this is a list of players</p>
      {players.map((player) => (
        <Player
          key={player.id}
          id={player.id}
          firstName={player.firstName}
          lastName={player.lastName}
          strength={player.strength}
          comment={player.comment}
        />
      ))}
    </>
  );
};

export default PlayerList;
