import { configureStore } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { PlayerSlice } from "./storeSlices/playerSlice";
import { TeamSlice } from "./storeSlices/teamSlice";
import { TournamentSlice } from "./storeSlices/tournamentSlice";
import { GroupSlice } from "./storeSlices/groupSlice";

export const store = configureStore({
  reducer: {
    player: PlayerSlice.reducer,
    team: TeamSlice.reducer,
    tournament: TournamentSlice.reducer,
    group: GroupSlice.reducer,
  },
  devTools: true,
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
