import { useState } from 'react';
import burger from '/icons/burger.svg';
import close from '/icons/close.svg';

const Header = () => {
  const navItems = [
    { id: 1, label: 'SCIENCE', href: '/science' },
    { id: 2, label: 'GENERAL', href: '/general' },
    { id: 3, label: 'ENTERTAINMENT', href: '/entertainment' },
    { id: 4, label: 'TECHNOLOGY', href: '/technology' },
    { id: 5, label: 'BUSINESS', href: '/business' },
    { id: 6, label: 'HEALTH', href: '/health' },
    { id: 7, label: 'SPORTS', href: '/sports' },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <div>
      <header className="flex flex-row justify-between items-center px-5 py-7 relative border-b border-(--gray) mb-3">
        {/* Burger Button */}
        <button onClick={toggleMenu} className="w-5 h-5 flex items-center cursor-pointer">
          <img src={burger} alt="Open Menu" />
        </button>
        {/* LOGO */}
        <a href="/" className="text-2xl leading-none font-bold tracking-widest">
          BESIDER
        </a>
        {/* EMPTY BLOCK FOR SYMMETRY */}
        <div className="w-5 h-5"></div>
      </header>
      {/* MOBILE-MENU */}
      {isOpen && (
        <nav className="h-dvh p-5 w-full bg-white absolute top-0 right-0">
          <button
            onClick={toggleMenu}
            className="w-5 h-5 flex items-center cursor-pointer ms-auto mb-24"
          >
            <img src={close} alt="Open Menu" />
          </button>
          <ul className="flex flex-col gap-7 items-start">
            {navItems.map((item, index) => (
              <li className="text-2xl leading-none font-bold tracking-widest" key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Header;
