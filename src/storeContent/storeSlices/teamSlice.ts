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
import { Tournament } from "./tournamentSlice";
import { IdToCheckStatusMapping } from "./playerSlice";
import { Group } from "./groupSlice";

export interface Team {
  id: number;
  isChecked: boolean;
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

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const baseUrl = "http://localhost:8080";

export const fetchAllTeams = createAsyncThunk("teams/get", async (thunkAPI) => {
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
      console.log("SENDING : ", Object.fromEntries(mapping));
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

interface TeamSliceState {
  teams: Team[];
  forceRerenderTeamListCount: number;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  teams: [],
  forceRerenderTeamListCount: 0,
  loading: "idle",
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
        console.info("fetch teams promise fulfilled");
        state.forceRerenderTeamListCount += 1;
      })
      .addCase(fetchAllTeams.pending, () => {
        //        console.info("fetch teams promise pending...");
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
                };
          });
        } else {
          state.teams = [...state.teams, action.payload];
        }
        console.info("save team promise fulfilled");
        state.forceRerenderTeamListCount += 1;
      })
      .addCase(saveTeam.rejected, () => {
        console.warn("save team promise rejected!");
      })
      .addCase(saveTeam.pending, () => {
        // console.info("save team promise pending...");
      })
      .addCase(checkTeams.fulfilled, (state, action) => {
        console.log("PAYLOAD: ", action.payload);
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
                isChecked: newIdToCheckStatusMapping.get(String(team.id)),
                strength: team.strength,
                comment: team.comment,
                playedDoublesTournaments: team.playedDoublesTournaments,
              };
        });
        console.info("check teams promise fulfilled", state.teams[1]);
        state.forceRerenderTeamListCount += 1;
      })
      .addCase(checkTeams.rejected, () => {
        console.warn("check teams promise rejected!");
      })
      .addCase(checkTeams.pending, () => {
        // console.info("check teams promise pending...");
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
        state.forceRerenderTeamListCount += 1;
      })
      .addCase(deleteTeam.rejected, () => {
        console.warn("delete team promise rejected!");
      })
      .addCase(deleteTeam.pending, () => {
        // console.info("delete team promise pending...");
      })
      .addMatcher(isRejectedAction, () => {
        console.info("promise rejected");
      })
      .addDefaultCase(() => {
        // console.log("thunk in default mode");
      });
  },
});

export default TeamSlice.reducer;
