import { configureStore } from '@reduxjs/toolkit';
import hotelReducer from '../features/hotels/hotelSlice';

export const store = configureStore({
    reducer:{
        hotels: hotelReducer,
    
    },
});