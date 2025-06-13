import newsAPI from '/icons/newsAPI.png';

const Footer = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const listItems = [
    { id: 1, label: 'Log In', href: '/login' },
    { id: 2, label: 'About Us', href: '/about' },
    { id: 3, label: 'Publishers', href: '/publishers' },
    { id: 4, label: 'Sitemap', href: '/sitemap' },
  ];
  return (
    <div className="flex flex-col gap-5 items-center justify-between max-w-80 mx-auto mt-10 mb-8">
      <ul className="flex flex-row gap-5">
        {listItems.map((item, index) => (
          <a key={index} href={item.href}>
            <li className="text-xs font-normal text-center leading-none">{item.label}</li>
          </a>
        ))}
      </ul>
      <div className="flex flex-col gap-2 items-center">
        <p className="text-xs font-normal text-center leading-none">Powered by</p>
        <img className="h-6" src={newsAPI} alt="News API" />
      </div>
      <p className="text-xs font-normal text-center leading-none">
        &copy;{currentYear} Besider. Inspired by Insider
      </p>
    </div>
  );
};

export default Footer;
