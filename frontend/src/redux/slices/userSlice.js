import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {}, 
  requests: [],
  sentRequests: [],
  friends: [],
  online: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.user = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setSentRequests: (state, action) => {
      state.sentRequests = action.payload;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    addRequest: (state, action) => {
      state.sentRequests.push(action.payload);
    },
    addNewRequest: (state, action) => {
      state.requests.push(action.payload);
    },
    acceptRequest: (state, action) => {
      state.friends.push(action.payload);
      state.requests = state.requests.filter(req=> req._id !== action.payload._id);
    },
    declineRequest: (state, action) => {
      state.requests = state.requests.filter(req=> req._id !== action.payload._id);
    },
    deleteFriend: (state, action) => {
      state.friends = state.friends.filter(fr=> fr._id !== action.payload._id);
    },
    setOnline: (state, action) => {
      state.online = action.payload;
    },
    addOnline: (state, action) => {
      state.online.push(action.payload);
    },
    removeOnline: (state, action) => {
      state.online = state.online.filter(id=> id !== action.payload);
    }
  },
});

export const { setProfile, setFriends, setRequests, setSentRequests, acceptRequest, declineRequest, addRequest, deleteFriend, setOnline, addOnline, removeOnline, addNewRequest } = userSlice.actions;
export default userSlice.reducer;