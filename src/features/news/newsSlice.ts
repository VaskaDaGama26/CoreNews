import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { News } from '../../types/News';

interface NewsState {
  newsByDate: Record<string, News[]>;
  loading: boolean;
  error: string | null;
  lastFetchedYear: number;
  lastFetchedMonth: number;
}

const initialState: NewsState = {
  newsByDate: {},
  loading: false,
  error: null,
  lastFetchedYear: new Date().getFullYear(),
  lastFetchedMonth: new Date().getMonth() + 1,
};

export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ year, month }: { year: number; month: number }) => {
    const keyAPI = import.meta.env.VITE_API_KEY;
    const baseURL = import.meta.env.VITE_BASE_URL;

    const res = await fetch(`api/${year}/${month}.json?api-key=${keyAPI}`);
    if (!res.ok) {
      const text = await res.text();
      console.error(`HTTP Error ${res.status}:`, text);
      throw new Error(`HTTP Error ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    console.log(`Fetched news for ${year}/${month}:`, data);

    return data.response.docs as News[];
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<News[]>) => {
        state.loading = false;
        action.payload.forEach((news) => {
          const dateKey = news.pub_date.slice(0, 10);
          if (!state.newsByDate[dateKey]) state.newsByDate[dateKey] = [];
          if (!state.newsByDate[dateKey].some((n) => n.web_url === news.web_url)) {
            state.newsByDate[dateKey].push(news);
          }
        });
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error Loading News';
      });
  },
});

export default newsSlice.reducer;
