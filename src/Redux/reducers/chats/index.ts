import { combineReducers } from 'redux';
import { chat } from './chatReducer';

const chatReducers = combineReducers({
  chat,
});

export default chatReducers;
