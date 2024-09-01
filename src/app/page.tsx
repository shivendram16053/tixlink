import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen mt-[-120px] bg-black text-white">
      {/* Hero Section */}
      <section className="text-center px-6 flex flex-col justify-center items-center">
        <h1 className="text-7xl mb-4 text-blue-100   ">
        Empowering your events with
        </h1>
        <h1 className="text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r h-20 from-violet-600 via-cyan-500 to-blue-500">
        digital connections
        </h1>
        <p className="text-2xl mb-8 text-gray-400">Seamless. Shareable. On Solana.</p>
        
        {/* Buttons */}
        <div className="flex space-x-4">
          <Link href="https://x.com/tix_link">
          <button className="px-6 py-3 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full text-lg">
            Follow on Twitter
          </button>
          </Link>
          <Link href="https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Ftixlink.vercel.app%2Fapi%2Factions%2Fcreate&cluster=mainnet">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600  to-cyan-500 rounded-full text-lg">
            Create Event
          </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
