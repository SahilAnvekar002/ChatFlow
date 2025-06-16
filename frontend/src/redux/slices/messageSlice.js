import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chat: {},
  messages: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload.messages;
      state.chat = action.payload.chat;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(message => message._id !== action.payload._id);
    },
    updateMessageChat: (state, action) => {
      if (action.payload === state.chat._id) {
        state.chat.isDeleted = true;
      }
    },
    removeFromMessageChat: (state, action) => {
      if (action.payload._id === state.chat._id) {
        state.chat = action.payload;
      }
    }

  },
});

export const { setMessages, addMessage, removeMessage, updateMessageChat, removeFromMessageChat } = messageSlice.actions;
export default messageSlice.reducer;