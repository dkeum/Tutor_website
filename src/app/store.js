import { configureStore } from '@reduxjs/toolkit'
import { personDetailSlice } from '../features/auth/personDetails'
import { dogDetailSlice } from '../features/dog/dogSlice'

export default configureStore({
  reducer: {
    personDetail: personDetailSlice.reducer,
    dogDetail: dogDetailSlice.reducer,
  },
})