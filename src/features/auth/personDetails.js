import { createSlice } from "@reduxjs/toolkit";

export const personDetailSlice = createSlice({
  name: "persondetails",
  initialState: {
    name: "",
    class: "",
    grade: "",
    email: "",
    isSubscribed: false, // ✅ add isSubscribed
    profile_pic:"https://github.com/shadcn.png",

    loginInfo: [], // e.g., GitHub info
    progressArray: [],
    completionProgress: 0,
    current_grade: 0,
    timeGoals: 0,
    actual_time_goal: 0,
    3: [],
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

      // console.log(action.payload)
      state.loginInfo = action.payload.github_activity;
      state.completionProgress = action.payload.completion_progress;
      state.current_grade = action.payload.current_grade;
      state.progressArray = action.payload.progressArray;
      state.timeGoals = action.payload.timeCommitment
      state.actual_time_goal = action.payload.actual_time_commitment

      state.profile_pic = action.payload?.profile_picture
    },

    setQuestions: (state,action) => {
      // console.log(action.payload)
      state.marks_section = action.payload || [];
    },

  },
});

// Action creators
export const { initializeState, setName, setProfileInfo , setQuestions} = personDetailSlice.actions;

export default personDetailSlice.reducer;
