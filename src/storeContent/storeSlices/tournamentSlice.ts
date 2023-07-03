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
import { Player, RejectedAction, StateStatus, baseUrl } from "./playerSlice";
// eslint-disable-next-line import/no-cycle
import { Team } from "./teamSlice";
// eslint-disable-next-line import/no-cycle
import { Group } from "./groupSlice";
import { TournamentType } from "../../components/Tournament";
// eslint-disable-next-line import/no-cycle
import { log } from "../../utils/funcs";

export interface Tournament {
  id: number;
  type: string;
  startDate: Date;
  endDate: Date;
  groupSize: number;
  comment: string;
  participatingPlayers?: number[];
  // participatingPlayerIds: number[];
  participatingTeams?: number[];
  // participatingTeamIds: number[];
  groups?: number[];
  // groupIds: number[];
}

export const placeholderTournament: Tournament = {
  id: -2,
  startDate: new Date(),
  endDate: new Date(),
  type: TournamentType.SINGLES,
  groupSize: 0,
  comment: "",
  participatingPlayers: [],
  // participatingPlayerIds: [],
  participatingTeams: [],
  // participatingTeamIds: [],
  groups: [],
  // groupIds: [],
};

export const emptyTournament: Tournament = {
  id: 999,
  startDate: new Date(),
  endDate: new Date(),
  type: TournamentType.SINGLES,
  groupSize: 0,
  comment: "",
  participatingPlayers: [],
  // participatingPlayerIds: [],
  participatingTeams: [],
  // participatingTeamIds: [],
  groups: [],
  // groupIds: [],
};

interface TournamentSliceState {
  tournaments: Tournament[];
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const fetchAllTournaments = createAsyncThunk(
  "tournaments/get",
  // async (thunkAPI) => {
  async () => {
    const response = await axios.get(`${baseUrl}/api/data/tournaments`);
    return response.data;
  }
);

export const saveTournament = createAsyncThunk(
  "tournaments/save",
  async (tournament: Tournament, { rejectWithValue }) => {
    try {
      // log("SAVE REQUEST: ", tournament);
      const response = await axios.put(`${baseUrl}/api/data/tournaments`, {
        ...tournament,
      });
      // console.log("SAVE RESPONSE: tournament, response.data");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(`error saving the tournament: ${error.message}`);
    }
  }
);
export interface TData {
  tournamentId: number;
  type: string;
}

export const assignPlayersToTournament = createAsyncThunk(
  "tournaments/assignPlayers",
  async (tdata: TData, { rejectWithValue }) => {
    try {
      const { tournamentId, type } = tdata;
      const URL =
        type === "singles"
          ? `${baseUrl}/api/data/tournaments/assignToSingles?tournamentId=${tournamentId}`
          : `${baseUrl}/api/data/tournaments/assignToDoubles?tournamentId=${tournamentId}`;
      // console.log("ASSIGNING: ", tournamentId, type);
      const response = await axios.get(URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(`error saving the tournament: ${error?.message}`);
    }
  }
);

export const deleteTournament = createAsyncThunk(
  "tournaments/delete",
  async (tdata: TData, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/data/tournaments/${tdata.type}/${tdata.tournamentId}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        `error deleting the tournament: ${error?.message}`
      );
    }
  }
);

interface TournamentSliceState {
  tournaments: Tournament[];
  status: StateStatus;
  error: string | null;
}

const initialState = {
  tournaments: [],
  status: "idle",
  error: null,
} as TournamentSliceState;

export const TournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    addTournament: (
      state,
      action: PayloadAction<{
        type: string;
        startDate: Date;
        endDate: Date;
        groupSize: number;
        comment: string;
        // participatingPlayers: Player[];
        // participatingPlayerIds: number[];
        participatingPlayers: number[];
        // participatingTeams: Team[];
        participatingTeams: number[];
        // participatingTeamIds: number[];
        // groups: Group[];
        groups: number[];
        // groupIds: number[];
      }>
    ) => {
      state.tournaments = [
        ...state.tournaments,
        {
          id: state.tournaments.length || 1,
          type: action.payload.type,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          groupSize: action.payload.groupSize,
          comment: action.payload.comment,
          participatingPlayers: action.payload.participatingPlayers,
          // participatingPlayerIds: action.payload.participatingPlayerIds,
          participatingTeams: action.payload.participatingTeams,
          // participatingTeamIds: action.payload.participatingTeamIds,
          groups: action.payload.groups,
          // groupIds: action.payload.groupIds,
        },
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTournaments.fulfilled, (state, action) => {
        state.tournaments = action.payload;
        // console.info("fetch tournaments promise fulfilled", state.tournaments);
        console.info("fetch tournaments promise fulfilled");
        // state.status = "succeededFetching";
      })
      .addCase(fetchAllTournaments.pending, (state) => {
        // console.info("fetch tournaments promise pending...");
        // state.status = "pendingFetching";
      })
      .addCase(fetchAllTournaments.rejected, (state) => {
        console.warn("fetch tournaments promise rejected!");
        state.status = "failedFetching";
      })
      .addCase(saveTournament.fulfilled, (state, action) => {
        // console.log("PAYLOAD: ", action.payload);
        const tournamentIdAlreadyInState = (id: number) => {
          if (!state.tournaments.length) return false;
          return state.tournaments.filter((t) => t.id === id).length > 0;
        };

        if (tournamentIdAlreadyInState(action.payload.id)) {
          state.tournaments = state.tournaments.map((tournament) => {
            return tournament.id !== action.payload.id
              ? tournament
              : {
                  id: action.payload.id,
                  type: action.payload.type,
                  startDate: action.payload.startDate,
                  endDate: action.payload.endDate,
                  groupSize: action.payload.groupSize,
                  comment: action.payload.comment,
                  participatingPlayers: action.payload.participatingPlayers,
                  participatingPlayerIds: action.payload.participatingPlayerIds,
                  participatingTeams: action.payload.participatingTeams,
                  participatingTeamIds: action.payload.participatingTeamIds,
                  groups: action.payload.groups,
                  groupIds: action.payload.groupIds,
                };
          });
        } else {
          state.tournaments = [...state.tournaments, action.payload];
        }
        console.info("save tournament promise fulfilled");
        state.status = "succeededSaving";
      })
      .addCase(saveTournament.rejected, (state) => {
        console.warn("save tournament promise rejected!");
        state.status = "failedSaving";
      })
      .addCase(saveTournament.pending, (state) => {
        // console.info("save tournament promise pending...");
        state.status = "pendingSaving";
      })
      .addCase(deleteTournament.fulfilled, (state, action) => {
        const tournamentIdNotInState = (id: number) => {
          return state.tournaments.filter((t) => t.id === id).length === 0;
        };
        if (tournamentIdNotInState(action.payload.id)) {
          console.warn("invalid tournament id for deletion");
        } else {
          state.tournaments = state.tournaments.filter(
            (t) => t.id !== action.payload.id
          );
        }
        console.info("delete tournament promise fulfilled");
        state.status = "succeededDeleting";
      })
      .addCase(deleteTournament.rejected, (state) => {
        console.warn("delete tournament promise rejected!");
        state.status = "failedDeleting";
      })
      .addCase(deleteTournament.pending, (state) => {
        // console.info("delete tournament promise pending...");
        state.status = "pendingDeleting";
      })
      .addCase(assignPlayersToTournament.pending, (state) => {
        // console.info("assignPlayersToTournament promise pending...");
        state.status = "pendingAssigning";
      })
      .addCase(assignPlayersToTournament.fulfilled, (state, action) => {
        console.info(
          "assignPlayersToTournament promise fulfilled, fetching updates..."
        );
        state.status = "succeededAssigning";
      })
      .addCase(assignPlayersToTournament.rejected, (state) => {
        console.warn("assignPlayersToTournament promise rejected!");
        state.status = "failedAssigning";
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

export default TournamentSlice.reducer;
