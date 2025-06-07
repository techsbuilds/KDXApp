import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import {userReducer} from './user';

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  // blacklist: ['currentUser'],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  // transaction: transactionReducer,
});

export default rootReducer;
