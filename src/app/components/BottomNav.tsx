import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/', src: '/svgs/home.svg', alt: 'Home' },
  { href: '/shop', src: '/svgs/shop.svg', alt: 'Shop' },
  { href: '/create', src: '/svgs/create.svg', alt: 'Create' },
  { href: '/inbox', src: '/svgs/inbox.svg', alt: 'Inbox' },
  { href: '/profile', src: '/svgs/profile.svg', alt: 'Profile' },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black">
      <ul className="flex justify-around items-center h-14">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} legacyBehavior>
              <a className="flex flex-col items-center">
                <Image src={item.src} alt={item.alt} width={50} height={50} />
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-end bottom-3 m-2">
        <div className="flex items-center justify-center">
            <Image src="/svgs/rect.svg" alt="Rect" width={120} height={50} />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;