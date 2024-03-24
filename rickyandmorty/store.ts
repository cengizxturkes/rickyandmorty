import {configureStore} from '@reduxjs/toolkit';
import favoritesReducer from './src/redux/favoritesSlice';

const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
});

export default store;
