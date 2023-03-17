import { configureStore } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { PlayerSlice } from "./storeSlices/playerSlice";

export const store = configureStore({
  reducer: {
    player: PlayerSlice.reducer,
  },
  devTools: true,
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
