import { combineReducers } from 'redux';
import { sockets } from './socketReducer';

const socketReducers = combineReducers({
  sockets,
});

export default socketReducers;
