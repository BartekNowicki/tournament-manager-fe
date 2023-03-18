import { configureStore } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { PlayerSlice } from "./storeSlices/playerSlice";
import { TournamentSlice } from "./storeSlices/tournamentSlice";

export const store = configureStore({
  reducer: {
    player: PlayerSlice.reducer,
    tournament: TournamentSlice.reducer,
  },
  devTools: true,
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
