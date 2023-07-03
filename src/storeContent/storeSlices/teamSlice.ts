/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  // Action,
  AnyAction,
  // createAction,
  // isPending,
} from "@reduxjs/toolkit";
import axios from "axios";
// eslint-disable-next-line import/no-cycle
import { Tournament } from "./tournamentSlice";
// eslint-disable-next-line import/no-cycle
import {
  IdToCheckStatusMapping,
  RejectedAction,
  StateStatus,
  baseUrl,
} from "./playerSlice";
// eslint-disable-next-line import/no-cycle
import { Group } from "./groupSlice";

export interface Team {
  id: number;
  isChecked?: boolean;
  checked?: boolean;
  playerOneId: number;
  playerTwoId: number;
  strength: number;
  comment: string;
  playedDoublesTournaments: Tournament[];
  belongsToGroups: Group[];
  belongsToGroupIds: number[];
}

export const placeholderTeam = {
  id: -2,
  isChecked: false,
  playerOneId: 1,
  playerTwoId: 2,
  strength: 0,
  comment: "",
  playedDoublesTournaments: [],
  belongsToGroups: [],
  belongsToGroupIds: [],
};

export const emptyTeam = {
  id: 999,
  isChecked: false,
  playerOneId: 999,
  playerTwoId: 999,
  strength: 0,
  comment: "",
  playedDoublesTournaments: [],
  belongsToGroups: [],
  belongsToGroupIds: [],
};

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

// export const baseUrl = "http://localhost:8080";

// export const fetchAllTeams = createAsyncThunk("teams/get", async (thunkAPI) => {
export const fetchAllTeams = createAsyncThunk("teams/get", async () => {
  const response = await axios.get(`${baseUrl}/api/data/teams`);
  return response.data;
});

export const saveTeam = createAsyncThunk(
  "teams/save",
  async (team: Team, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}/api/data/teams`, team);

      return response.data;
    } catch (error) {
      // return rejectWithValue(error.message);
      return rejectWithValue("error saving the team");
    }
  }
);

export const checkTeams = createAsyncThunk(
  "teams/check",
  async (mapping: IdToCheckStatusMapping, { rejectWithValue }) => {
    try {
      // console.log("SENDING : ", Object.fromEntries(mapping));
      const response = await axios.patch(
        `${baseUrl}/api/data/teams`,
        Object.fromEntries(mapping)
      );
      return response.data;
    } catch (error) {
      // return rejectWithValue(error.message);
      return rejectWithValue("error checking or unchecking the teams");
    }
  }
);

export const deleteTeam = createAsyncThunk(
  "teams/delete",
  async (teamId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/data/teams/${teamId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("error deleting the team");
    }
  }
);

export const groupTeams = createAsyncThunk(
  "teams/group",
  async (tournamentId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/data/teams/group/${tournamentId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("error grouping the teams");
    }
  }
);

export const unGroupTeams = createAsyncThunk(
  "teams/unGroup",
  async (tournamentId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/data/teams/ungroup/${tournamentId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("error ungrouping the teams");
    }
  }
);

interface TeamSliceState {
  teams: Team[];
  forceRerenderTeamListCount: number;
  status: StateStatus;
  error: string | null;
}

const initialState = {
  teams: [],
  forceRerenderTeamListCount: 0,
  status: "idle",
  error: null,
} as TeamSliceState;

export const TeamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    addTeam: (
      state,
      action: PayloadAction<{
        isChecked: false;
        playerOneId: number;
        playerTwoId: number;
        strength: number;
        comment: string;
        playedDoublesTournaments: Tournament[];
        belongsToDoublesGroups: Group[];
        belongsToDoublesGroupIds: number[];
      }>
    ) => {
      state.teams = [
        ...state.teams,
        {
          id: state.teams.length,
          isChecked: false,
          playerOneId: action.payload.playerOneId,
          playerTwoId: action.payload.playerTwoId,
          strength: action.payload.strength,
          comment: action.payload.comment,
          playedDoublesTournaments: action.payload.playedDoublesTournaments,
          belongsToGroups: action.payload.belongsToDoublesGroups,
          belongsToGroupIds: action.payload.belongsToDoublesGroupIds,
        },
      ];
    },
    checkTeam: (
      state,
      action: PayloadAction<{
        id: number;
        isChecked: boolean;
        playerOneId: number;
        playerTwoId: number;
        strength: number;
        comment: string;
      }>
    ) => {
      state.teams = state.teams.map((team) =>
        team.id !== action.payload.id
          ? team
          : { ...team, isChecked: action.payload.isChecked || false }
      );
    },
    checkAllTeams: (
      state,
      action: PayloadAction<{
        isChecked: boolean;
      }>
    ) => {
      state.teams = state.teams.map((team) => ({
        ...team,
        isChecked: action.payload.isChecked,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        // console.info("fetch teams promise fulfilled", state.teams);
        console.info("fetch teams promise fulfilled");
        state.status = "succeededFetching";
        // state.forceRerenderTeamListCount += 1;
      })
      .addCase(fetchAllTeams.pending, (state) => {
        //        console.info("fetch teams promise pending...");
        state.status = "pendingFetching";
      })
      .addCase(fetchAllTeams.rejected, (state) => {
        //        console.info("fetch teams promise rejected...");
        state.status = "failedFetching";
      })
      .addCase(saveTeam.fulfilled, (state, action) => {
        const teamIdAlreadyInState = (id: number) => {
          if (!state.teams.length) return false;
          return state.teams.filter((t) => t.id === id).length > 0;
        };

        if (teamIdAlreadyInState(action.payload.id)) {
          state.teams = state.teams.map((team) => {
            return team.id !== action.payload.id
              ? team
              : {
                  id: action.payload.id,
                  playerOneId: action.payload.playerOneId,
                  playerTwoId: action.payload.playerTwoId,
                  isChecked: action.payload.isChecked,
                  strength: action.payload.strength,
                  comment: action.payload.comment,
                  playedDoublesTournaments:
                    action.payload.playedDoublesTournaments,
                  belongsToGroups: action.payload.belongsToDoublesGroups,
                  belongsToGroupIds: action.payload.belongsToDoublesGroupIds,
                };
          });
        } else {
          state.teams = [...state.teams, action.payload];
        }
        console.info("save team promise fulfilled");
        state.status = "succeededSaving";
        // state.forceRerenderTeamListCount += 1;
      })
      .addCase(saveTeam.rejected, (state) => {
        console.warn("save team promise rejected!");
        state.status = "failedSaving";
      })
      .addCase(saveTeam.pending, (state) => {
        // console.info("save team promise pending...");
        state.status = "pendingSaving";
      })
      .addCase(checkTeams.fulfilled, (state, action) => {
        const newIdToCheckStatusMapping: IdToCheckStatusMapping = new Map(
          Object.entries(action.payload)
        );
        state.teams = state.teams.map((team) => {
          return !newIdToCheckStatusMapping.has(String(team.id))
            ? team
            : {
                id: team.id,
                playerOneId: team.playerOneId,
                playerTwoId: team.playerTwoId,
                isChecked:
                  newIdToCheckStatusMapping.get(String(team.id)) || false,
                strength: team.strength,
                comment: team.comment,
                playedDoublesTournaments: team.playedDoublesTournaments,
                belongsToGroups: action.payload.belongsToDoublesGroups,
                belongsToGroupIds: action.payload.belongsToDoublesGroupIds,
              };
        });
        // console.info("check teams promise fulfilled", state.teams[1]);
        console.info("check teams promise fulfilled");
        state.status = "succeeded";
        state.forceRerenderTeamListCount += 1;
      })
      .addCase(checkTeams.rejected, (state) => {
        console.warn("check teams promise rejected!");
        state.status = "failed";
      })
      .addCase(checkTeams.pending, (state) => {
        // console.info("check teams promise pending...");
        state.status = "pending";
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        const teamIdNotInState = (id: number) => {
          return state.teams.filter((t) => t.id === id).length === 0;
        };
        if (teamIdNotInState(action.payload.id)) {
          console.warn("invalid team id for deletion");
        } else {
          state.teams = state.teams.filter((t) => t.id !== action.payload.id);
        }
        console.info("delete team promise fulfilled");
        state.status = "succeededDeleting";
        // state.forceRerenderTeamListCount += 1;
      })
      .addCase(deleteTeam.rejected, (state) => {
        console.warn("delete team promise rejected!");
        state.status = "failedDeleting";
      })
      .addCase(deleteTeam.pending, (state) => {
        // console.info("delete team promise pending...");
        state.status = "pendingDeleting";
      })

      .addCase(groupTeams.pending, (state) => {
        // console.info("group teams promise pending");
        state.status = "pendingGrouping";
      })
      .addCase(groupTeams.fulfilled, (state) => {
        // console.info("group teams promise fulfilled");
        state.status = "succeededGrouping";
      })
      .addCase(groupTeams.rejected, (state) => {
        console.warn("group teams promise rejected!");
        state.status = "failedGrouping";
      })
      .addCase(unGroupTeams.pending, (state) => {
        // console.info("ungroup teams promise pending");
        state.status = "pendingUnGrouping";
      })
      .addCase(unGroupTeams.fulfilled, (state) => {
        console.info("ungroup teams promise fulfilled");
        state.status = "succeededUnGrouping";
      })
      .addCase(unGroupTeams.rejected, (state) => {
        console.warn("ungroup teams promise rejected!");
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

export default TeamSlice.reducer;
