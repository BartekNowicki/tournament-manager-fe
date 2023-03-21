/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Player {
  id: number;
  isChecked: boolean;
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
      id: -1,
      isChecked: false,
      firstName: "allPlayers",
      lastName: "allPlayers",
      strength: 0,
      comment: "no comment0",
    },
    {
      id: 0,
      isChecked: false,
      firstName: "bubba0",
      lastName: "smith0",
      strength: 0,
      comment: "no comment0",
    },
    {
      id: 1,
      isChecked: false,
      firstName: "bubba1",
      lastName: "smith1",
      strength: 1,
      comment: "no comment1",
    },
    {
      id: 2,
      isChecked: false,
      firstName: "bubba2",
      lastName: "smith2",
      strength: 2,
      comment: "no commen2",
    },
    {
      id: 3,
      isChecked: false,
      firstName: "bubb3",
      lastName: "smith3",
      strength: 3,
      comment: "no comment3",
    },
    {
      id: 4,
      isChecked: false,
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
          isChecked: false,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          strength: action.payload.strength,
          comment: action.payload.comment,
        },
      ];
    },
    checkPlayer: (
      state,
      action: PayloadAction<{
        id: number;
        firstName: string;
        isChecked: boolean;
        lastName: string;
        strength: number;
        comment: string;
      }>
    ) => {
      state.players = state.players.map((player) => player);
    },
  },
});

export default PlayerSlice.reducer;
export const { addPlayer, checkPlayer } = PlayerSlice.actions;
