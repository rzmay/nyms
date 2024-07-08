import relations from 'lib/constants/relations';
import Head from 'next/head';
import React from 'react';
import './global.css';

export const metadata = {
  title: 'nyms',
  description: 'daily word-traversal puzzle',
  authors: [{ name: 'Robert May', url: 'https://rzmay.com' }],
  creator: 'Robert May',
};

export const viewport = {
  themeColor: relations.null.hex,
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </Head>
      <body className="bg-null">
        <p className="absolute ml-5 mt-2 font-karnak text-4xl drop-shadow-md text-white z-50">nyms</p>
        {children}
      </body>
    </html>
  );
}
