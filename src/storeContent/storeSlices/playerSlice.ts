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
      firstName: "bubba0",
      lastName: "smith0",
      strength: 0,
      comment: "no comment0",
    },
    {
      id: 1,
      firstName: "bubba1",
      lastName: "smith1",
      strength: 1,
      comment: "no comment1",
    },
    {
      id: 2,
      firstName: "bubba2",
      lastName: "smith2",
      strength: 2,
      comment: "no commen2",
    },
    {
      id: 3,
      firstName: "bubb3",
      lastName: "smith3",
      strength: 3,
      comment: "no comment3",
    },
    {
      id: 4,
      firstName: "bubba4",
      lastName: "smit4",
      strength: 4,
      comment: "no comment4",
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
