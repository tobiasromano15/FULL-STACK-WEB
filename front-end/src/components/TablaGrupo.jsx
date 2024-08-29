export default function TablaGrupo({ grupo }) {
  return (
    <div className='col-span-6  grid items-stretch rounded  border border-white bg-black text-sm text-white'>
      <table className='mt-4'>
        <thead>
          <tr className='border-b border-white text-blue-400  '>
            <th>#</th>
            <th>Equipo</th>
            <th>Pts</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>DIF</th>
          </tr>
        </thead>
        <tbody>
          {grupo.table.map((objeto) => {
            console.log(objeto);
            return (
              <tr>
                <th className='h-10 w-12'>{objeto.position}</th>
                <th className='w-40'>
                  {
                    <div className='grid grid-cols-6'>
                      <img
                        src={objeto.team.crest}
                        alt={objeto.team.name}
                        className='h-6 w-6'
                      ></img>
                      <p className='col-span-5 text-left'>{objeto.team.name}</p>
                    </div>
                  }
                </th>
                <th className='w-12'>{objeto.points}</th>
                <th className='w-10'>{objeto.playedGames}</th>
                <th className='w-10'>{objeto.won}</th>
                <th className='w-10'>{objeto.draw}</th>
                <th className='w-10'>{objeto.lost}</th>
                <th className='w-10'>{objeto.goalsFor}</th>
                <th className='w-10'>{objeto.goalsAgainst}</th>
                <th className='w-10'>{objeto.goalDifference}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
