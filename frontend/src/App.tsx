import { useEffect, useState } from 'react';

type HelloResponse = {
  message: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function App() {
  const [message, setMessage] = useState('Connecting to the API…');

  useEffect(() => {
    fetch(`${API_URL}/api/hello`)
      .then((response) => {
        if (!response.ok) throw new Error('API request failed');
        return response.json() as Promise<HelloResponse>;
      })
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('The API is unavailable. Start the Docker services and try again.'));
  }, []);

  return (
    <main>
      <p className="eyebrow">Helpdesk ticketing system</p>
      <h1>Hello, world.</h1>
      <p className="message">{message}</p>
      <p className="caption">React frontend · Express API · PostgreSQL</p>
    </main>
  );
}

export default App;

