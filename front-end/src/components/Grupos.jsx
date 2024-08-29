'use client';
import { useState, useEffect } from 'react';
import TablaGrupo from './TablaGrupo';
import { CircularProgress } from '@mui/material';
export default function Grupos() {
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
        <div className='grid grid-cols-12 bg-black'>
          {grupos.map((grupo) => {
            return <TablaGrupo grupo={grupo} key={grupo.group} />;
          })}
        </div>
      ) : (
        <div className='mt-20 flex justify-center'>
          <CircularProgress />
        </div>
      )}
    </>
  );
}
