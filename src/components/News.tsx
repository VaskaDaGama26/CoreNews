import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import NewsItem from './UI/NewsItem';
import { fetchNews } from '../features/news/newsSlice';
const News = () => {
  const dispatch = useAppDispatch();
  const newsByDate = useAppSelector((state) => state.news.newsByDate);
  const loading = useAppSelector((state) => state.news.loading);
  const error = useAppSelector((state) => state.news.error);

  useEffect(() => {
    dispatch(
      fetchNews({
        year: 2019,
        month: 5,
      })
    );
  }, [dispatch]);
  if (loading) return <p className='text-sm px-5'>Загрузка...</p>;
  if (error) return <p className='text-sm px-5'>Ошибка: {error}</p>;

  return (
    <div className="flex flex-col gap-8 mx-5">
      {Object.entries(newsByDate).map(([date, newsList]) => (
        <div className="flex flex-col gap-3" key={date}>
          <h2 className="text-lg font-bold leading-7">{date}</h2>
          <ul className="flex flex-col gap-4">
            {newsList.map((news) => (
              <NewsItem key={news._id} news={news} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default News;
