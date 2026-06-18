import { createSlice } from "@reduxjs/toolkit";

export const personDetailSlice = createSlice({
  name: "persondetails",
  initialState: {
    // account
    name: "",
    class: "",
    grade: "",
    email: "",
    profile_pic: "https://github.com/shadcn.png",
    isSubscribed: false,
    current_module: null,
    time_logged_pct: 0,
    total_minutes_logged: 0,
    hasActivityHistory: true, // 💡 NEW: Default fallback state for new user tracking
    class_ID: "",

    // subscription & plan
    plan_type: "free",
    ai_credits: 0,
    subscription_status: "inactive",
    is_on_trial: false,
    days_remaining: 0,

    // progress
    loginInfo: [],
    progressArray: [],
    completionProgress: 0,
    current_grade: 0,
    timeGoals: 0,        // weekly goal % — feeds sidebar goal tracker
    actual_time_goal: 0,
    wrong_count: 0,
  },
  reducers: {
    initializeState: (state, action) => {
      const data = action.payload.data;
      state.name = data.name || "";
      state.class = data.class || "";
      state.grade = data.grade || "";
      state.email = data.email || "";
      state.isSubscribed = data.isSubscribed || false;
    },

    setName: (state, action) => {
      // 💡 SAFETY ADVANCEMENT: Handle both an object payload { name: "dan" } and a direct string "dan"
      if (action.payload && typeof action.payload === 'object') {
        state.name = action.payload.name ?? state.name;
      } else {
        state.name = action.payload ?? state.name;
      }
    },

    setProfileInfo: (state, action) => {
      const p = action.payload;
      if (!p) return;

      // account
      state.name = p.name ?? state.name;
      state.profile_pic = p.profile_picture ?? "https://github.com/shadcn.png";
      state.hasActivityHistory = p.hasActivityHistory ?? true; // 💡 NEW: Map new user state directly from backend

      // progress rings
      state.completionProgress = p.completion_progress ?? 0;
      state.current_grade = p.current_grade ?? 0;
      state.time_logged_pct = p.time_logged_pct ?? 0; // → TIME LOGGED ring
      state.total_minutes_logged = p.total_minutes_logged ?? 0;

      // weekly goal (sidebar tracker)
      state.timeGoals = p.timeCommitment ?? 0;
      state.actual_time_goal = p.actual_time_commitment ?? 0;

      // activity + topics
      state.loginInfo = p.github_activity ?? [];
      state.progressArray = p.progressArray ?? [];
      state.wrong_count = p.wrong_count ?? 0;

      // console.log("Progress array from backend:", state.progressArray); // Debug log to verify data structure

      state.current_module = p.current_module ?? null;

      // subscription
      state.plan_type = p.plan_type ?? "free";
      state.ai_credits = p.ai_credits ?? 0;
      state.subscription_status = p.subscription_status ?? "inactive";
      state.is_on_trial = p.is_on_trial ?? false;
      state.days_remaining = p.days_remaining ?? 0;
      state.class = p.class ?? '';

      
      state.class_ID = p.Class_ID ?? 1;
      console.log(state.class_ID)
    },

    setQuestions: (state, action) => {
      state.marks_section = action.payload || [];
    },
  },
});

export const { initializeState, setName, setProfileInfo, setQuestions } =
  personDetailSlice.actions;

export default personDetailSlice.reducer;