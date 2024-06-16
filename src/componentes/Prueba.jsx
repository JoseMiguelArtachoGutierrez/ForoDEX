// src/Prueba.js
import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Prueba = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/pikachu`);
        const data = await response.json();
        const stats = data.stats.map(stat => ({
          name: stat.stat.name,
          value: stat.base_stat,
        }));
        setStats(stats);
      } catch (error) {
        console.error('Error fetching data from PokeAPI', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: stats.map(stat => stat.name),
    datasets: [
      {
        label: 'Pikachu Stats',
        data: stats.map(stat => stat.value),
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 150,
      },
    },
  };

  return (
    <div>
      <Radar data={data} options={options} />
    </div>
  );
};

export default Prueba;
