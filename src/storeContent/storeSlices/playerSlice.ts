import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
}

interface PlayerSliceState {
  players: Player[];
}

const initialState: PlayerSliceState = {
  players: [{ id: 0, firstName: "bubba", lastName: "smith" }],
};

export const PlayerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    addPlayer: (
      state,
      action: PayloadAction<{ firstName: string; lastName: string }>
    ) => {
      state.players = [
        ...state.players,
        {
          id: state.players.length,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
        },
      ];
    },
  },
});

export default PlayerSlice.reducer;
export const { addPlayer } = PlayerSlice.actions;
