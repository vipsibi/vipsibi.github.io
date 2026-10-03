import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async ({ page = 1, search = '', minPrice = '', maxPrice = '', locationType = 'all' } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/hotels', {
        params: { page, limit: 6, search, minPrice, maxPrice, locationType },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch hotels');
    }
  }
);

export const fetchHotelById = createAsyncThunk(
  'hotels/fetchHotelById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/hotels/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Hotel not found');
    }
  }
);

export const fetchHotelBySlug = createAsyncThunk(
  'hotels/fetchHotelBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/hotels/slug/${encodeURIComponent(slug)}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Hotel not found');
    }
  }
);

export const createHotel = createAsyncThunk(
  'hotels/createHotel',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/hotels', formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create hotel');
    }
  }
);

export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/hotels/${id}`, formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update hotel');
    }
  }
);

export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/hotels/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete hotel');
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    items: [],
    selected: null,
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
    successMessage: '',
  },
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
    clearSuccess: (state) => {
      state.successMessage = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.hotels;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHotelBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchHotelBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHotel.fulfilled, (state) => {
        state.successMessage = 'Hotel added successfully!';
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateHotel.fulfilled, (state) => {
        state.successMessage = 'Hotel updated successfully!';
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.items = state.items.filter((h) => h.id !== action.payload);
        state.total -= 1;
        state.successMessage = 'Hotel Deleted Successfully!';
      });
  },
});

export const { clearSelected, clearSuccess, clearError } = hotelSlice.actions;
export default hotelSlice.reducer;