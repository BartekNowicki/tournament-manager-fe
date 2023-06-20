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
import { Player } from "./playerSlice";
import { Team } from "./teamSlice";

export interface Group {
  id: number;
  members: Player[] | Team[];
}

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const baseUrl = "http://localhost:8080";

export const fetchAllGroups = createAsyncThunk(
  "groups/get",
  async (thunkAPI) => {
    const response = await axios.get(`${baseUrl}/api/data/groups`);
    return response.data;
  }
);

// TODO: use in V2
// export const saveGroup = createAsyncThunk(
//   "groups/save",
//   async (group: Group, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`${baseUrl}/api/data/groups`, group);

//       return response.data;
//     } catch (error) {
//       // return rejectWithValue(error.message);
//       return rejectWithValue("error saving the player");
//     }
//   }
// );

interface GroupSliceState {
  groups: Group[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  groups: [],
  loading: "idle",
} as GroupSliceState;

export const GroupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
        console.info("fetch groups promise fulfilled", state.groups);
      })
      .addCase(fetchAllGroups.pending, () => {
        // console.info("fetch promise pending...");
      })
      .addMatcher(isRejectedAction, () => {
        console.info("promise rejected");
      })
      .addDefaultCase(() => {
        // console.log("thunk in default mode");
      });
  },
});

export default GroupSlice.reducer;
