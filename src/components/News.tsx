import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import NewsItem from './UI/NewsItem';
import { fetchNews, resetNewAvailable } from '../features/news/newsSlice';

const News = () => {
  const dispatch = useAppDispatch();
  const newsByDate = useAppSelector((state) => state.news.newsByDate);
  const loading = useAppSelector((state) => state.news.loading);
  const error = useAppSelector((state) => state.news.error);
  const newAvailable = useAppSelector((state) => state.news.newAvailable);

  const [currentYear, setCurrentYear] = useState(2019);
  const [currentMonth, setCurrentMonth] = useState(12);
  const [isWaiting, setIsWaiting] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      dispatch(fetchNews({ year, month, checkNewOnly: true }));
    }, 30000); // каждые 30 секунд

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchNews({ year: currentYear, month: currentMonth }));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 100 && !loading && !isWaiting) {
        loadNextMonth();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentYear, currentMonth, loading, isWaiting]);

  const loadNextMonth = () => {
    if (currentYear === 1851 && currentMonth === 1) return;

    setIsWaiting(true);

    setTimeout(() => {
      let nextMonth = currentMonth - 1;
      let nextYear = currentYear;

      if (nextMonth === 0) {
        nextMonth = 12;
        nextYear--;
      }

      setCurrentMonth(nextMonth);
      setCurrentYear(nextYear);
      dispatch(fetchNews({ year: nextYear, month: nextMonth }));
      setIsWaiting(false);
    }, 1000);
  };

  if (error) return <p className="text-sm px-5">Ошибка: {error}</p>;

  return (
    <div className="flex flex-col gap-8 mx-5">
      {newAvailable && (
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm text-center my-4">
          Появились новые новости!{' '}
          <button
            onClick={() => {
              const now = new Date();
              const year = now.getFullYear();
              const month = now.getMonth() + 1;
              dispatch(fetchNews({ year, month }));
              dispatch(resetNewAvailable());
            }}
            className="underline ml-2"
          >
            Обновить
          </button>
        </div>
      )}

      {Object.entries(newsByDate)
        .slice()
        .sort((a, b) => b[0].localeCompare(a[0])) // даты в порядке от новых к старым
        .map(([date, newsList]) => (
          <div className="flex flex-col gap-3" key={date}>
            <h2 className="text-lg font-bold leading-7">{date}</h2>
            <ul className="flex flex-col gap-4">
              {[...newsList]
                .slice()
                .sort((a, b) => b.pub_date.localeCompare(a.pub_date)) // внутри даты — от новых к старым
                .map((news) => (
                  <NewsItem key={news._id} news={news} />
                ))}
            </ul>
          </div>
        ))}

      {loading || isWaiting ? (
        // <p className="text-sm px-5 text-center">Загрузка...</p>
        <div className="flex justify-center my-4">
          <img src="/icons/loading.svg" alt="loading" className="w-8 h-8 animate-spin" />
        </div>
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
};

export default News;
