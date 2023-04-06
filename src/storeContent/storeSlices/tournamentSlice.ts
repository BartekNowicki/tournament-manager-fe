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
import { TournamentType } from "../../components/Tournament";

export interface Tournament {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  groupSize: number;
  comment: string;
}

interface TournamentSliceState {
  tournaments: Tournament[];
}

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const fetchTournaments = createAsyncThunk(
  "tournaments/get",
  async (thunkAPI) => {
    const response = await axios.get(
      "http://localhost:8080/api/data/tournaments"
    );
    return response.data;
  }
);

const getEnumKeyByValue = (val: string) =>
  Object.keys(TournamentType)[Object.values(TournamentType).indexOf(val)];

const convertToMysqlDatetime6 = (dateString: string) => {
  // required by mysql: datetime(6)
  // e.g. `java.util.Date` from String "5.04.2023"
  const dateArr: string[] = dateString.split(".");
  // return new Date(`"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`).getTime();
  const convertedDate: Date = new Date(
    `"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`
  );
  // need to set the date one day after as sql stores the date one day before
  convertedDate.setDate(convertedDate.getDate() + 1);
  return convertedDate;
};

export const saveTournament = createAsyncThunk(
  "tournaments/save",
  async (tournament: Tournament, { rejectWithValue }) => {
    const tournamentWithTypeConvertedToEnumKey = {
      ...tournament,
      type: getEnumKeyByValue(tournament.type),
    };

    try {
      const response = await axios.put(
        "http://localhost:8080/api/data/tournaments",
        {
          ...tournamentWithTypeConvertedToEnumKey,
          startDate: convertToMysqlDatetime6(tournament.startDate),
          endDate: convertToMysqlDatetime6(tournament.endDate),
        }
      );

      return response.data;
    } catch (error) {
      // return rejectWithValue(error.message);
      return rejectWithValue("error saving the tournament");
    }
  }
);

export const deleteTournament = createAsyncThunk(
  "tournaments/delete",
  async (tournamentId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/data/tournaments/${tournamentId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("error deleting the tournament");
    }
  }
);

interface TournamentSliceState {
  tournaments: Tournament[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  tournaments: [],
  loading: "idle",
} as TournamentSliceState;

export const TournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    addTournament: (
      state,
      action: PayloadAction<{
        type: string;
        startDate: string;
        endDate: string;
        groupSize: number;
        comment: string;
      }>
    ) => {
      state.tournaments = [
        ...state.tournaments,
        {
          id: state.tournaments.length,
          type: action.payload.type,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          groupSize: action.payload.groupSize,
          comment: action.payload.comment,
        },
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.tournaments = action.payload;
        console.info("tournament fetch promise fulfilled");
      })
      .addCase(fetchTournaments.pending, () => {
        console.info("fetch promise pending...");
      })
      .addCase(saveTournament.fulfilled, (state, action) => {
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
                };
          });
        } else {
          state.tournaments = [...state.tournaments, action.payload];
        }
        console.info("save tournament promise fulfilled");
      })
      .addCase(saveTournament.rejected, () => {
        console.warn("save tournament promise rejected!");
      })
      .addCase(saveTournament.pending, () => {
        console.info("save tournament promise pending...");
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
      })
      .addCase(deleteTournament.rejected, () => {
        console.warn("delete tournament promise rejected!");
      })
      .addCase(deleteTournament.pending, () => {
        console.info("delete tournament promise pending...");
      })
      .addMatcher(isRejectedAction, () => {
        console.info("promise rejected");
      })
      .addDefaultCase(() => {
        console.log("thunk in default mode");
      });
  },
});

export default TournamentSlice.reducer;
