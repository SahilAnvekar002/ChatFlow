import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
    updateChat: (state, action) => {
      const index = state.chats.findIndex(chat => chat._id === action.payload.chat._id);
      if (index !== -1) {
        state.chats[index].latestMessage = action.payload;
        state.chats[index].updatedAt = new Date().toISOString();
      }
      const updatedChat = state.chats.splice(index, 1)[0];
      state.chats.unshift(updatedChat);
    },
    deleteGroupChat: (state, action) => {
      const index = state.chats.findIndex(chat=> chat._id === action.payload);
      if (index !== -1){
        state.chats[index].isDeleted = true;
        state.chats[index].updatedAt = new Date().toISOString();
      }
    },
    removeMembers: (state, action) => {
      const index = state.chats.findIndex(chat=> chat._id === action.payload._id);
      state.chats[index] = action.payload;
    }
    
  },
});

export const { setChats, addChat, updateChat, deleteGroupChat, removeMembers } = chatSlice.actions;
export default chatSlice.reducer;