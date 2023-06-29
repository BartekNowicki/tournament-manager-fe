/* eslint-disable no-console */
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
// eslint-disable-next-line import/no-cycle
import { TData, Tournament } from "./tournamentSlice";
import { Group } from "./groupSlice";

export interface Player {
  id: number;
  isChecked?: boolean;
  checked?: boolean;
  firstName: string;
  lastName: string;
  strength: number;
  comment: string;
  playedSinglesTournaments: Tournament[];
  belongsToGroups: Group[];
  belongsToGroupIds: number[];
}

export const placeholderPlayer: Player = {
  id: -2,
  isChecked: false,
  firstName: "",
  lastName: "",
  strength: 0,
  comment: "",
  playedSinglesTournaments: [],
  belongsToGroups: [],
  belongsToGroupIds: [],
};

export const emptyPlayer: Player = {
  id: 999,
  isChecked: false,
  firstName: "",
  lastName: "",
  strength: 999,
  comment: "",
  playedSinglesTournaments: [],
  belongsToGroups: [],
  belongsToGroupIds: [],
};

export type IdToCheckStatusMapping = Map<string, boolean>;

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const baseUrl = "http://localhost:8080";

export const fetchAllPlayers = createAsyncThunk(
  "players/get",
  async (thunkAPI) => {
    const response = await axios.get(`${baseUrl}/api/data/players`);
    return response.data;
  }
);

export const savePlayer = createAsyncThunk(
  "players/save",
  async (player: Player, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}/api/data/players`, player);

      return response.data;
    } catch (error) {
      // return rejectWithValue(error.message);
      return rejectWithValue("error saving the player");
    }
  }
);

export const checkPlayers = createAsyncThunk(
  "players/check",
  async (mapping: IdToCheckStatusMapping, { rejectWithValue }) => {
    try {
      // console.log("SENDING : ", Object.fromEntries(mapping));
      // console.log("SENDING : ", mapping);
      const response = await axios.patch(
        `${baseUrl}/api/data/players`,
        Object.fromEntries(mapping)
      );

      return response.data;
    } catch (error) {
      // return rejectWithValue(error.message);
      return rejectWithValue("error checking or unchecking the players");
    }
  }
);

export const deletePlayer = createAsyncThunk(
  "players/delete",
  async (playerId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/data/players/${playerId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("error deleting the player");
    }
  }
);

export const groupPlayers = createAsyncThunk(
  "players/group",
  async (tournamentId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/data/players/group/${tournamentId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("error grouping the players");
    }
  }
);

export const unGroupPlayers = createAsyncThunk(
  "players/unGroup",
  async (tournamentId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/data/players/ungroup/${tournamentId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("error ungrouping the players");
    }
  }
);

interface PlayerSliceState {
  players: Player[];
  forceRerenderPlayerListCount: number;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  players: [],
  forceRerenderPlayerListCount: 0,
  loading: "idle",
} as PlayerSliceState;

export const PlayerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    addPlayer: (
      state,
      action: PayloadAction<{
        isChecked: false;
        firstName: string;
        lastName: string;
        strength: number;
        comment: string;
        playedSinglesTournaments: Tournament[];
        belongsToSinglesGroups: Group[];
        belongsToSinglesGroupIds: number[];
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
          playedSinglesTournaments: action.payload.playedSinglesTournaments,
          belongsToGroups: action.payload.belongsToSinglesGroups,
          belongsToGroupIds: action.payload.belongsToSinglesGroupIds,
        },
      ];
    },
    checkPlayer: (
      state,
      action: PayloadAction<{
        id: number;
        isChecked: boolean;
        firstName: string;
        lastName: string;
        strength: number;
        comment: string;
      }>
    ) => {
      state.players = state.players.map((player: Player) =>
        player.id !== action.payload.id
          ? player
          : { ...player, isChecked: action.payload.isChecked || false }
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPlayers.fulfilled, (state, action) => {
        state.players = action.payload;
        console.info("fetch players promise fulfilled", state.players);
        state.forceRerenderPlayerListCount += 1;
      })
      .addCase(fetchAllPlayers.pending, () => {
        // console.info("fetch promise pending...");
      })
      .addCase(savePlayer.fulfilled, (state, action) => {
        const playerIdAlreadyInState = (id: number) => {
          if (!state.players.length) return false;
          return state.players.filter((p) => p.id === id).length > 0;
        };

        if (playerIdAlreadyInState(action.payload.id)) {
          state.players = state.players.map((player: Player) => {
            return player.id !== action.payload.id
              ? player
              : {
                  id: action.payload.id,
                  firstName: action.payload.firstName,
                  lastName: action.payload.lastName,
                  isChecked: action.payload.isChecked,
                  strength: action.payload.strength,
                  comment: action.payload.comment,
                  playedSinglesTournaments:
                    action.payload.playedSinglesTournaments,
                  belongsToGroups: action.payload.belongsToSinglesGroups,
                  belongsToGroupIds: action.payload.belongsToSinglesGroupIds,
                };
          });
        } else {
          state.players = [...state.players, action.payload];
        }
        console.info("save player promise fulfilled");
        state.forceRerenderPlayerListCount += 1;
      })
      .addCase(savePlayer.rejected, () => {
        console.warn("save player promise rejected!");
      })
      .addCase(savePlayer.pending, () => {
        // console.info("save player promise pending...");
      })
      .addCase(checkPlayers.fulfilled, (state, action) => {
        // console.log("PAYLOAD: ", action.payload);
        const newIdToCheckStatusMapping: IdToCheckStatusMapping = new Map(
          Object.entries(action.payload)
        );
        state.players = state.players.map((player: Player) => {
          return !newIdToCheckStatusMapping.has(String(player.id))
            ? player
            : {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                isChecked: newIdToCheckStatusMapping.get(String(player.id)),
                strength: player.strength,
                comment: player.comment,
                playedSinglesTournaments:
                  action.payload.playedSinglesTournaments,
                belongsToGroups: action.payload.belongsToSinglesGroups,
                belongsToGroupIds: action.payload.belongsToSinglesGroupIds,
              };
        });
        console.info("check player promise fulfilled", state.players[1]);
        state.forceRerenderPlayerListCount += 1;
      })
      .addCase(checkPlayers.rejected, () => {
        console.warn("check player promise rejected!");
      })
      .addCase(checkPlayers.pending, () => {
        // console.info("check player promise pending...");
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
        state.forceRerenderPlayerListCount += 1;
      })
      .addCase(deletePlayer.rejected, () => {
        console.warn("delete player promise rejected!");
      })
      .addCase(deletePlayer.pending, () => {
        // console.info("delete player promise pending...");
      })
      .addCase(groupPlayers.fulfilled, (state, action) => {
        console.info("group players promise fulfilled");
      })
      .addCase(groupPlayers.rejected, () => {
        console.warn("group players promise rejected!");
      })
      .addCase(unGroupPlayers.fulfilled, (state, action) => {
        console.info("ungroup players promise fulfilled");
      })
      .addCase(unGroupPlayers.rejected, () => {
        console.warn("ungroup players promise rejected!");
      })
      .addMatcher(isRejectedAction, () => {
        console.info("promise rejected");
      })
      .addDefaultCase(() => {
        // console.log("thunk in default mode");
      });
  },
});

export default PlayerSlice.reducer;
