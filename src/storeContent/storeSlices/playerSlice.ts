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
import axios from "axios";

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
    const response = await axios.get("http://localhost:8080/api/data/players");
    return response.data;
  }
);

export const savePlayer = createAsyncThunk(
  "players/save",
  async (player: Player, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/data/players",
        player
      );

      return response.data;
    } catch (error) {
      // return rejectWithValue(error.message);
      return rejectWithValue("error saving the player");
    }
  }
);

export const deletePlayer = createAsyncThunk(
  "players/delete",
  async (playerId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/data/players/${playerId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("error deleting the player");
    }
  }
);

interface PlayerSliceState {
  players: Player[];
  playersChangeCount: number;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  players: [],
  playersChangeCount: 0,
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
    // updatePlayer: (
    //   state,
    //   action: PayloadAction<{
    //     idToEdit: number;
    //     firstName: string;
    //     lastName: string;
    //     strength: number;
    //     comment: string;
    //   }>
    // ) => {
    //   state.players = state.players.map((player) => {
    //     if (player.id === action.payload.idToEdit) {
    //       return {
    //         id: player.id,
    //         isChecked: player.isChecked,
    //         firstName: action.payload.firstName,
    //         lastName: action.payload.lastName,
    //         strength: action.payload.strength,
    //         comment: action.payload.comment,
    //       };
    //     }
    //     return {
    //       ...player,
    //     };
    //   });
    // },
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
        const playerIdAlreadyInState = (id: number) => {
          return state.players.filter((p) => p.id === id).length > 0;
        };

        if (playerIdAlreadyInState(action.payload.id)) {
          state.players = state.players.map((player) => {
            return player.id !== action.payload.id
              ? player
              : {
                  id: action.payload.id,
                  firstName: action.payload.firstName,
                  lastName: action.payload.lastName,
                  isChecked: action.payload.isChecked,
                  strength: action.payload.strength,
                  comment: action.payload.comment,
                };
          });
        } else {
          state.players.push(action.payload);
        }
        console.info("save player promise fulfilled");
        state.playersChangeCount += 1;
      })
      .addCase(savePlayer.rejected, () => {
        console.warn("save player promise rejected!");
      })
      .addCase(savePlayer.pending, () => {
        console.info("save player promise pending...");
      })
      .addCase(deletePlayer.fulfilled, (state, action) => {
        const playerIdNotInState = (id: number) => {
          return state.players.filter((p) => p.id === id).length === 0;
        };
        if (playerIdNotInState(action.payload.id)) {
          console.warn("invalid player id for deletion");
        } else {
          state.players = state.players.filter(
            (p) => p.id !== action.payload.id
          );
        }
        console.info("delete player promise fulfilled");
        state.playersChangeCount += 1;
      })
      .addCase(deletePlayer.rejected, () => {
        console.warn("delete player promise rejected!");
      })
      .addCase(deletePlayer.pending, () => {
        console.info("delete player promise pending...");
      })
      .addMatcher(isRejectedAction, () => {
        console.info("promise rejected");
      })
      .addDefaultCase(() => {
        console.log("thunk in default mode");
      });
  },
});

export default PlayerSlice.reducer;
export const { checkPlayer, checkAllPlayers } = PlayerSlice.actions;
