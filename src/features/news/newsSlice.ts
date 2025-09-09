import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { News } from '../../types/News';

interface NewsState {
  newsByDate: Record<string, News[]>;
  loading: boolean;
  error: string | null;
  upperDate: string | null;
  lowerYear: number;
  lowerMonth: number;
  newAvailable: boolean;
}

const initialState: NewsState = {
  newsByDate: {},
  loading: false,
  error: null,
  upperDate: null,
  lowerYear: 2019,
  lowerMonth: 12,
  newAvailable: false,
};

export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (
    { year, month, checkNewOnly = false }: { year: number; month: number; checkNewOnly?: boolean },
    { getState }
  ) => {
    const keyAPI = ' rJ7XaUF0IQZG7UYu0jp85Mdqpeu5MnbP';
    const res = await fetch(`api/${year}/${month}.json?api-key=${keyAPI}`);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    const articles = data.response.docs as News[];

    if (checkNewOnly) {
      const state = getState() as { news: NewsState };
      const currentUpperDate = state.news.upperDate;
      const newArticles = articles.filter((n) => {
        const pub = n.pub_date.slice(0, 10);
        return !currentUpperDate || pub > currentUpperDate;
      });
      return { articles: newArticles, year, month, checkNewOnly: true };
    }

    return { articles, year, month };
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    resetNewAvailable(state) {
      state.newAvailable = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNews.fulfilled,
        (
          state,
          action: PayloadAction<{
            articles: News[];
            year: number;
            month: number;
            checkNewOnly?: boolean;
          }>
        ) => {
          state.loading = false;
          const { articles, year, month, checkNewOnly } = action.payload;

          if (checkNewOnly) {
            if (articles.length > 0) {
              state.newAvailable = true;
            }
            return;
          }

          articles.forEach((news) => {
            const dateKey = news.pub_date.slice(0, 10);
            if (!state.newsByDate[dateKey]) state.newsByDate[dateKey] = [];
            if (!state.newsByDate[dateKey].some((n) => n.web_url === news.web_url)) {
              state.newsByDate[dateKey].push(news);
            }

            if (!state.upperDate || news.pub_date.slice(0, 10) > state.upperDate) {
              state.upperDate = news.pub_date.slice(0, 10);
            }
          });

          if (year === state.lowerYear && month === state.lowerMonth) {
            if (month === 1) {
              state.lowerMonth = 12;
              state.lowerYear -= 1;
            } else {
              state.lowerMonth -= 1;
            }
          }
        }
      )
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки новостей';
      });
  },
});

export const { resetNewAvailable } = newsSlice.actions;
export default newsSlice.reducer;
