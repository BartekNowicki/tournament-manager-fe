/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TournamentType } from "../../components/Tournament";

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
      type: TournamentType.SINGLES,
      startDate: new Date("January 10, 2023").toLocaleDateString(),
      endDate: new Date("January 20, 2023").toLocaleDateString(),
      groupSize: 0,
      comment: "no comment0",
    },
    {
      id: 1,
      type: TournamentType.DOUBLES,
      startDate: new Date("January 11, 2023").toLocaleDateString(),
      endDate: new Date("January 21, 2023").toLocaleDateString(),
      groupSize: 1,
      comment: "no comment1",
    },
    {
      id: 2,
      type: TournamentType.SINGLES,
      startDate: new Date("January 12, 2023").toLocaleDateString(),
      endDate: new Date("January 22, 2023").toLocaleDateString(),
      groupSize: 2,
      comment: "no comment2",
    },
    {
      id: 3,
      type: TournamentType.DOUBLES,
      startDate: new Date("January 13, 2023").toLocaleDateString(),
      endDate: new Date("January 23, 2023").toLocaleDateString(),
      groupSize: 3,
      comment: "no comment3",
    },
    {
      id: 4,
      type: TournamentType.DOUBLES,
      startDate: new Date("January 14, 2023").toLocaleDateString(),
      endDate: new Date("January 24, 2023").toLocaleDateString(),
      groupSize: 4,
      comment: "no comment4",
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
