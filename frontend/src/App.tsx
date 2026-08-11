import { useHealth } from './hooks/use-health';
import { useHello } from './hooks/use-hello';

const getMessage = (isPending: boolean, isError: boolean, message?: string): string => {
  if (isPending) return 'Connecting to the API…';
  if (isError) return 'The API is unavailable. Start the Docker services and try again.';
  return message ?? 'No message received.';
};

const getApiStatus = (isPending: boolean, isSuccess: boolean): string => {
  if (isPending) return 'Checking API status…';
  return isSuccess ? 'API online' : 'API unavailable';
};

function App() {
  const helloQuery = useHello();
  const healthQuery = useHealth();

  const message = getMessage(helloQuery.isPending, helloQuery.isError, helloQuery.data?.message);
  const apiStatus = getApiStatus(healthQuery.isPending, healthQuery.isSuccess);

  return (
    <main>
      <p className="eyebrow">Helpdesk ticketing system</p>
      <h1>Hello, world.</h1>
      <p className="message">{message}</p>
      <p className="caption">{apiStatus} · React frontend · Express API · PostgreSQL</p>
    </main>
  );
}

export default App;
