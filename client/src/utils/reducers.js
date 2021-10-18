import { useReducer } from 'react';

import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from './actions';

export const reducer = (state, action) => {
    switch (action.type) {
        // if action type value is the value of 'UPDATE_PRODUCTS', return a new state object with an updated products array
        case UPDATE_PRODUCTS:
            return {
                ...state, // returns everything within state, spread out as before
                products: [...action.products] // spreads value of action.products across products key
            };

        // if action type value is 'UPDATE_CATEGORIES', return a new state object with an updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            };

        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            }

         // if it's none of these actions, do not update state at all and keep things the same
        default:
            return state;

    }
}

export function useProductReducer(initialState) { // useReducer is like useState for managing a greater level of state, like global
    return useReducer(reducer, initialState);
}