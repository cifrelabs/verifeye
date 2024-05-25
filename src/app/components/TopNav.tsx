import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const TopNav = () => {
  return (
    <nav className="bg-black fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center h-16 px-4">
        {/* Group 1: Single SVG */}
        <div>
          <Link href="/live" legacyBehavior>
            <a className="flex items-center">
              <Image src="/svgs/live.svg" alt="Live" width={24} height={24} />
            </a>
          </Link>
        </div>

        {/* Group 2: Three Buttons */}
        <div className="flex space-x-4">
          <Link href="/friends" legacyBehavior>
            <a className="flex items-center">
              <Image src="/svgs/friends.svg" alt="Friends" width={76} height={24} />
            </a>
          </Link>
          <Link href="/following" legacyBehavior>
            <a className="flex items-center">
              <Image src="/svgs/following.svg" alt="Following" width={76} height={24} />
            </a>
          </Link>
          <Link href="/fyp" legacyBehavior>
            <a className="flex items-center">
              <Image src="/svgs/fyp.svg" alt="FYP" width={76} height={24} />
            </a>
          </Link>
        </div>

        {/* Group 3: Single SVG */}
        <div>
          <Link href="/search" legacyBehavior>
            <a className="flex items-center">
              <Image src="/svgs/search.svg" alt="Search" width={24} height={30} />
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
