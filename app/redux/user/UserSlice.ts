import {Draft, PayloadAction, Slice, createSlice} from '@reduxjs/toolkit';

import {AuthUser} from '../../types/GlobalTypes';

interface UserInitialState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: UserInitialState = {
  currentUser: null,
  isAuthenticated: false,
  token: null
};

const userSlice: Slice<UserInitialState> = createSlice({
  name: 'userSlice',
  initialState: initialState,
  reducers: {
    setCurrentUser: (
      state: Draft<UserInitialState>,
      action: PayloadAction<AuthUser>,
    ) => {
      state.currentUser = action?.payload;
      state.isAuthenticated = !!action.payload;
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
  },
});

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
