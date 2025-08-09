import { configureStore } from '@reduxjs/toolkit'
import { personDetailSlice } from '../features/auth/personDetails'

export default configureStore({
  reducer: {
    personDetail: personDetailSlice.reducer,
  },
})