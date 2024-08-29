'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export default function Nav() {
  const [grupos, setGrupos] = useState(null);
  useEffect(() => {
    fetch('/api/grupos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setGrupos(data));
  }, []);
  return (
    <>
      {grupos ? (
        <div className='flex  justify-around bg-black font-medium'>
          <Link
            className=' border-b-2 bg-black px-4 py-2 text-xl text-white hover:border-amber-500 hover:text-amber-500 '
            href={'/'}
          >
            Home
          </Link>
          {grupos.map((grupo) => {
            return (
              <Link
                className=' border-b-2 px-4 py-2 text-xl  text-white hover:border-amber-500 hover:text-amber-500  '
                href={'/' + grupo.group}
              >
                {grupo.group}
              </Link>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
