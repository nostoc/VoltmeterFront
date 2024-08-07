import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const socket = io('http://localhost:3000');

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Receive initial data
    socket.on('initialData', (initialData) => {
      console.log('Received initial data:', initialData);
      setData(initialData);
    });

    // Receive new data
    socket.on('newData', (newData) => {
      console.log('Received new data:', newData);
      setData((prevData) => {
        const newDataWithUniqueTimestamps = newData.filter(
          newDatum => !prevData.some(prevDatum => prevDatum.timestamp === newDatum.timestamp)
        );
        return [...prevData, ...newDataWithUniqueTimestamps];
      });
    });

    return () => {
      socket.off('initialData');
      socket.off('newData');
    };
  }, []);

  return (
    <LineChart
      width={1000}
      height={600}
      data={data}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default App;
