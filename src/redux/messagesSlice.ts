import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { MessageInterface } from '../types';


const slice = createSlice({
  name: 'messages',
  initialState: [] as MessageInterface[],
  reducers: {
    setCurrentMessages: (
      state,
      action
    ) => {
      state = action.payload;
      return state;
    },
  },
})

export const { setCurrentMessages } = slice.actions

export const selectCurrentMessages = (state: RootState) => state.messages;

export default slice.reducer