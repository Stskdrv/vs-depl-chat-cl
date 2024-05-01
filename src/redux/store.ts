import { configureStore } from '@reduxjs/toolkit'
import { api } from '../services/api'
import messagesSlice from './messagesSlice.ts'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    messages: messagesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
