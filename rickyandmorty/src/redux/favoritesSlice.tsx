// favoritesSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Character = {
    id: number;
    name: string;
    status: string;
    species: string;
    image: string;
    
};

export type FavoritesState = {
    favorites: Character[];
};

const initialState: FavoritesState = {
    favorites: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addToFavorites: (state, action: PayloadAction<Character>) => {
            state.favorites.push(action.payload);
        },
        removeFromFavorites: (state, action: PayloadAction<number>) => {
            state.favorites = state.favorites.filter(character => character.id !== action.payload);
        },
    },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
