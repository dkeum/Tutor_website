import { createSlice } from "@reduxjs/toolkit";

export const dogDetailSlice = createSlice({
  name: "dogDetail",
  initialState: {
    dog_animation: "",
    // dog_answer: "",
  },
  reducers: {
    setDogDetails: (state, action) => {
      // const data = action.payload.dog_animation;
      // console.log("tis is this data from payload: \n")
      // console.log(action)
      // console.log(action.payload);

      state.dog_animation = action.payload.dog_animation || "";
    },
  },
});

// Action creators
export const { setDogDetails } = dogDetailSlice.actions;

export default dogDetailSlice.reducer;
