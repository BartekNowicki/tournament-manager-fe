/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  strength: number;
  comment: string;
}

interface PlayerSliceState {
  players: Player[];
}

const initialState: PlayerSliceState = {
  players: [
    {
      id: 0,
      firstName: "bubba",
      lastName: "smith",
      strength: 9,
      comment: "no comment",
    },
  ],
};

export const PlayerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    addPlayer: (
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
        strength: number;
        comment: string;
      }>
    ) => {
      state.players = [
        ...state.players,
        {
          id: state.players.length,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          strength: action.payload.strength,
          comment: action.payload.comment,
        },
      ];
    },
  },
});

export default PlayerSlice.reducer;
export const { addPlayer } = PlayerSlice.actions;
