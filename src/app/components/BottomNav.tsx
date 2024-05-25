"use client";

import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/', src: '/svgs/home.svg', alt: 'Home' },
  { href: '/shop', src: '/svgs/shop.svg', alt: 'Shop' },
  { href: '/create', src: '/svgs/create.svg', alt: 'Create' },
  { href: '/inbox', src: '/svgs/inbox.svg', alt: 'Inbox' },
  { href: '/profile', src: '/svgs/profile.svg', alt: 'Profile' },
];

const BottomNav = () => {
  const showToast = (message: string) => {
    toast.error(message, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const handleItemClick = (id: string) => {
    if (id !== 'Home')
        showToast("Currently Unavailable");
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-black">
        <ul className="flex justify-around items-center h-14">
          {navItems.map((item) => (
            <li key={item.href}>
              {/* <Link href={item.href} legacyBehavior>
                <a className="flex flex-col items-center" onClick={() => handleItemClick(`${item.alt} clicked`)}>
                  <Image src={item.src} alt={item.alt} width={50} height={50} />
                </a>
              </Link> */}
              <button onClick={() => handleItemClick(item.alt)} className="flex flex-col items-center">
                <Image src={item.src} alt={item.alt} width={50} height={50} />
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <ToastContainer />
    </>
  );
};

export default BottomNav;
