import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
    credentials: "include",
    // prepareHeaders: (headers, { getState }) => {

    //   // console.log(getState())
    //   const token = getState().auth.token;
    //   // console.log("token is found")
    //   // console.log(token)
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  tagTypes: ["User"],
  endpoints: () => ({}), //builder
});