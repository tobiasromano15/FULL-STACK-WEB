'use client';
import TablaGrupo from '@/components/TablaGrupo';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Page({ params }) {
  const [grupo, setGrupo] = useState(null);
  useEffect(() => {
    fetch('/api/grupos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGrupo(
          data.find((grupo) => {
            return encodeURIComponent(grupo.group) === params.grupo;
          })
        );
      });
  }, []);
  return (
    <>
      {grupo ? (
        <main className='h-[93vh] justify-center bg-black'>
          <div className='flex justify-center pt-8'>
            <TablaGrupo grupo={grupo} key={grupo.group} />
          </div>
        </main>
      ) : (
        <div className='h-[94vh] bg-black'>
          <div className='flex justify-center pt-20'>
            <CircularProgress />
          </div>
        </div>
      )}
    </>
  );
}
