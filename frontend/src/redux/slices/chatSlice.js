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
    }
  },
});

export const { setChats, addChat, updateChat } = chatSlice.actions;
export default chatSlice.reducer;