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
// import { Tournament } from "./tournamentSlice";
import { Player, RejectedAction, StateStatus, baseUrl } from "./playerSlice";
import { Team } from "./teamSlice";

export interface Group {
  id: number;
  members: Player[] | Team[];
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

// export const baseUrl = "http://localhost:8080";

export const fetchAllGroups = createAsyncThunk(
  "groups/get",
  // async (thunkAPI) => {
  async () => {
    const response = await axios.get(`${baseUrl}/api/data/groups`);
    return response.data;
  }
);

interface GroupSliceState {
  groups: Group[];
  status: StateStatus;
  error: string | null;
}

const initialState = {
  groups: [],
  status: "idle",
  error: null,
} as GroupSliceState;

export const GroupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
        // console.info("fetch groups promise fulfilled", state.groups);
        console.info("fetch groups promise fulfilled");
        state.status = "succeeded";
      })
      .addCase(fetchAllGroups.pending, (state) => {
        // console.info("fetch promise pending...");
        state.status = "pending";
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

export default GroupSlice.reducer;
