import React from 'react';
import './global.css';

export const metadata = {
  title: 'nyms',
  description: 'daily word-traversal puzzle',
  authors: [{ name: 'Robert May', url: 'https://rzmay.com' }],
  creator: 'Robert May',
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-500 dark:bg-slate-800">
        <p className="absolute ml-5 mt-2 font-karnak text-4xl drop-shadow-md text-white z-50">nyms</p>
        {children}
      </body>
    </html>
  );
}
