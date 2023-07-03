/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Action,
  AnyAction,
  // createAction,
  // isPending,
} from "@reduxjs/toolkit";
import axios from "axios";
// eslint-disable-next-line import/no-cycle
import { Tournament } from "./tournamentSlice";
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

export interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const baseUrl = "http://localhost:8080";

// we pass in 'players/get' as the action type prefix
export const fetchAllPlayers = createAsyncThunk(
  "players/get",
  // async (thunkAPI) => { uu if ok
  async () => {
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

export type StateStatus =
  | "idle"
  | "pending"
  | "succeeded"
  | "failed"
  | "pendingFetching"
  | "succeededFetching"
  | "failedFetching"
  | "pendingSaving"
  | "succeededSaving"
  | "failedSaving"
  | "pendingDeleting"
  | "succeededDeleting"
  | "failedDeleting"
  | "pendingAssigning"
  | "succeededAssigning"
  | "failedAssigning"
  | "pendingGrouping"
  | "succeededGrouping"
  | "failedGrouping"
  | "pendingUnGrouping"
  | "succeededUnGrouping"
  | "failedUnGrouping";

interface PlayerSliceState {
  players: Player[];
  forceRerenderPlayerListCount: number;
  status: StateStatus;
  error: string | null;
}

const initialState = {
  players: [],
  forceRerenderPlayerListCount: 0,
  status: "idle",
  error: null,
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
        state.status = "succeededFetching";
        // console.info("fetch players promise fulfilled", state.players);
        console.info("fetch players promise fulfilled");
        // state.forceRerenderPlayerListCount += 1;
      })
      .addCase(fetchAllPlayers.pending, (state) => {
        state.status = "pendingFetching";
        // console.info("fetch promise pending...");
      })
      .addCase(fetchAllPlayers.rejected, (state) => {
        state.status = "failedFetching";
        // console.info("fetch promise failed...");
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
        // console.info("save player promise fulfilled");
        state.status = "succeededSaving";
        // state.forceRerenderPlayerListCount += 1;
      })
      .addCase(savePlayer.rejected, (state) => {
        console.warn("save player promise rejected!");
        state.status = "failedSaving";
      })
      .addCase(savePlayer.pending, (state) => {
        // console.info("save player promise pending...");
        state.status = "pendingSaving";
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
        // console.info("check player promise fulfilled", state.players[1]);
        state.status = "succeeded";
        state.forceRerenderPlayerListCount += 1;
      })
      .addCase(checkPlayers.rejected, (state) => {
        console.warn("check player promise rejected!");
        state.status = "failed";
      })
      .addCase(checkPlayers.pending, (state) => {
        // console.info("check player promise pending...");
        state.status = "pending";
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
        state.status = "succeededDeleting";
        state.forceRerenderPlayerListCount += 1;
      })
      .addCase(deletePlayer.rejected, (state) => {
        console.warn("delete player promise rejected!");
        state.status = "failedDeleting";
      })
      .addCase(deletePlayer.pending, (state) => {
        // console.info("delete player promise pending...");
        state.status = "pendingDeleting";
      })
      .addCase(groupPlayers.pending, (state) => {
        // console.info("group players promise pending");
        state.status = "pendingGrouping";
      })
      .addCase(groupPlayers.fulfilled, (state) => {
        console.info("group players promise fulfilled");
        state.status = "succeededGrouping";
      })
      .addCase(groupPlayers.rejected, (state) => {
        console.warn("group players promise rejected!");
        state.status = "failedGrouping";
      })
      .addCase(unGroupPlayers.pending, (state) => {
        console.info("ungroup players promise pending");
        state.status = "pendingUnGrouping";
      })
      .addCase(unGroupPlayers.fulfilled, (state) => {
        console.info("ungroup players promise fulfilled");
        state.status = "succeededUnGrouping";
      })
      .addCase(unGroupPlayers.rejected, (state) => {
        console.warn("ungroup players promise rejected!");
        state.status = "failedUnGrouping";
      })
      .addMatcher(isRejectedAction, (state) => {
        console.info("promise rejected");
        state.status = "failed";
      })
      .addDefaultCase(() => {
        // console.log("thunk in default mode");
      });
  },
});

export default PlayerSlice.reducer;
