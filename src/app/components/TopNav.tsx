"use client";

import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const TopNav = () => {
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

  const handleButtonClick = (message: string) => {
    showToast(message);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Group 1: Single SVG */}
          <div>
            <button onClick={() => handleButtonClick('Currently Unavailable')} className="flex items-center">
              <Image src="/svgs/live.svg" alt="Live" width={24} height={24} />
            </button>
          </div>

          {/* Group 2: Three Buttons */}
          <div className="flex space-x-4">
            <button onClick={() => handleButtonClick('Currently Unavailable')} className="flex items-center">
              <Image src="/svgs/friends.svg" alt="Friends" width={76} height={24} />
            </button>
            <button onClick={() => handleButtonClick('Currently Unavailable')} className="flex items-center">
              <Image src="/svgs/following.svg" alt="Following" width={76} height={24} />
            </button>
            <button className="flex items-center">
              <Image src="/svgs/fyp.svg" alt="FYP" width={76} height={24} />
            </button>
          </div>

          {/* Group 3: Single SVG */}
          <div>
            <button onClick={() => handleButtonClick('Currently Unavailable')} className="flex items-center">
              <Image src="/svgs/search.svg" alt="Search" width={24} height={30} />
            </button>
          </div>
        </div>
      </nav>
      <ToastContainer />
    </>
  );
};

export default TopNav;
