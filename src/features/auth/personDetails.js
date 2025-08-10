import { createSlice } from "@reduxjs/toolkit";

export const personDetailSlice = createSlice({
  name: "persondetails",
  initialState: {
    name: "",
    class: "",
    grade: "",
    email: "",
    isSubscribed: false, // ✅ add isSubscribed

    loginInfo: [], // e.g., GitHub info
    progressArray: [],
    completionProgress: 0,
    current_grade: 0,
    timeGoals: 0,
    marks_section: [],
  },
  reducers: {
    initializeState: (state, action) => {
      const data = action.payload.data;
      // console.log(data);

      state.name = data.name || "";
      state.class = data.class || "";
      state.grade = data.grade || "";
      state.email = data.email || "";
      state.isSubscribed = data.isSubscribed || false;

      // Optionally initialize others if needed:
      //   state.loginInfo = data.loginInfo || [];
      //   state.marks_section = data.marks_section || [];
    },
    setName: (state, action) => {
      state.name = action.payload.name;
    },

    setProfileInfo: (state, action) => {
      state.loginInfo = action.payload.github_activity;
      state.completionProgress = action.payload.completion_progress;
      state.current_grade = action.payload.current_grade;
      state.progressArray = action.payload.progressArray;
      state.timeGoals = action.payload.timeCommitment
    },
  },
});

// Action creators
export const { initializeState, setName, setProfileInfo } = personDetailSlice.actions;

export default personDetailSlice.reducer;
