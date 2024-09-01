import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between w-full p-5 pl-20 pr-20">
      <Link href="/">
        <Image src={"/logo.png"} width={80} height={80} alt="logo" />
      </Link>

      <div className="nav-items">
        <ul>
          <li><Link href="https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Ftixlink.vercel.app%2Fapi%2Factions%2Fcreate&cluster=mainnet">Create a New Event</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
