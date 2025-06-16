import React from 'react';
import type { News } from '../../types/News';
import fallbackImg from '/icons/test.png';

interface NewsItemProps {
  news: News;
}

const NewsItem: React.FC<NewsItemProps> = ({ news }) => {
  const imageUrl =
    news.multimedia && news.multimedia[0]
      ? `https://www.nytimes.com/${news.multimedia[0].url}`
      : fallbackImg;

  const date = new Date(news.pub_date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  return (
    <>
      <div className="flex flex-row justify-center gap-3 border-b border-(--gray) pb-4">
        <img
          className="mt-6 object-cover"
          style={{ width: '99px', height: '74px' }}
          src={imageUrl}
          alt="news"
        />
        <div className="flex flex-col gap-2 items-start w-52">
          <h2 className="font-black text-sm text-[#096FFA]">{news.source || 'Unknown Source'}</h2>
          <p key={news.web_url} className="text-base font-normal leading-6">
            <a href={news.web_url} target="_blank" rel="noopener noreferrer">
              {news.abstract || 'No description available'}
            </a>
          </p>
          <p className="text-(--darkGray) text-sm font-normal">{date}</p>
        </div>
      </div>
    </>
  );
};

export default NewsItem;
