/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Tournament {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  groupSize: number;
  comment: string;
}

interface TournamentSliceState {
  tournaments: Tournament[];
}

const initialState: TournamentSliceState = {
  tournaments: [
    {
      id: 0,
      type: "singles",
      startDate: new Date("January 1, 2023").toLocaleDateString(),
      endDate: new Date("January 2, 2023").toLocaleDateString(),
      groupSize: 8,
      comment: "no comment",
    },
  ],
};

export const TournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    addTournament: (
      state,
      action: PayloadAction<{
        type: string;
        startDate: string;
        endDate: string;
        groupSize: number;
        comment: string;
      }>
    ) => {
      state.tournaments = [
        ...state.tournaments,
        {
          id: state.tournaments.length,
          type: action.payload.type,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          groupSize: action.payload.groupSize,
          comment: action.payload.comment,
        },
      ];
    },
  },
});

export default TournamentSlice.reducer;
export const { addTournament } = TournamentSlice.actions;
