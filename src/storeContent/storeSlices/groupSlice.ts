/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, AnyAction } from "@reduxjs/toolkit";
import axios from "axios";
// eslint-disable-next-line import/no-cycle
import { RejectedAction, StateStatus, baseUrl } from "./playerSlice";

export interface Group {
  id: number;
  members: number[];
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const fetchAllGroups = createAsyncThunk("groups/get", async () => {
  const response = await axios.get(`${baseUrl}/api/data/groups`);
  return response.data;
});

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
        state.status = "succeededFetching";
      })
      .addCase(fetchAllGroups.pending, (state) => {
        // console.info("fetch promise pending...");
        state.status = "pendingFetching";
      })
      .addMatcher(isRejectedAction, (state) => {
        console.info("promise rejected");
        state.status = "failedFetching";
      })
      .addDefaultCase(() => {
        // console.log("thunk in default mode");
      });
  },
});

export default GroupSlice.reducer;
