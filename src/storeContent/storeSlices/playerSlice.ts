/* eslint-disable no-param-reassign */
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Action,
  AnyAction,
  createAction,
  isPending,
} from "@reduxjs/toolkit";

export interface Player {
  id: number;
  isChecked: boolean;
  firstName: string;
  lastName: string;
  strength: number;
  comment: string;
}

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const fetchPlayers = createAsyncThunk(
  "players/get",
  async (thunkAPI) => {
    const response = await fetch("http://localhost:8080/api/data/players", {
      method: "GET",
    });
    const data = response.json();
    return data;
  }
);

export const savePlayer = createAsyncThunk(
  "players/save",
  async (player: Player, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8080/api/data/players", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(player),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

interface PlayerSliceState {
  players: Player[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  players: [],
  loading: "idle",
} as PlayerSliceState;

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
        isChecked: boolean;
      }>
    ) => {
      state.players = state.players.map((player) =>
        player.id !== action.payload.id
          ? player
          : { ...player, isChecked: action.payload.isChecked }
      );
    },
    checkAllPlayers: (
      state,
      action: PayloadAction<{
        isChecked: boolean;
      }>
    ) => {
      state.players = state.players.map((player) => ({
        ...player,
        isChecked: action.payload.isChecked,
      }));
    },
    updatePlayer: (
      state,
      action: PayloadAction<{
        idToEdit: number;
        firstName: string;
        lastName: string;
        strength: number;
        comment: string;
      }>
    ) => {
      state.players = state.players.map((player) => {
        if (player.id === action.payload.idToEdit) {
          return {
            id: player.id,
            isChecked: player.isChecked,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            strength: action.payload.strength,
            comment: action.payload.comment,
          };
        }
        return {
          ...player,
        };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.players = action.payload;
        console.info("players fetch promise fulfilled");
      })
      .addCase(fetchPlayers.pending, () => {
        console.info("fetch promise pending...");
      })
      .addCase(savePlayer.fulfilled, (state, action) => {
        state.players.push(action.payload);
        console.info("save player promise fulfilled");
      })
      .addCase(savePlayer.rejected, () => {
        console.warn("save player promise rejected!");
      })
      .addCase(savePlayer.pending, () => {
        console.info("save player promise pending...");
      })
      .addMatcher(isRejectedAction, () => {
        console.info("promise rejected");
      })
      .addDefaultCase(() => {
        console.log("thunk switched to default mode, maybe initially only");
      });
  },
});

export default PlayerSlice.reducer;
export const { addPlayer, checkPlayer, checkAllPlayers, updatePlayer } =
  PlayerSlice.actions;
