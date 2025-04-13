import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { Toaster } from './components/ui/sonner';
function App() {
  return (
    <>
      <Header />
      <main className="p-4 space-y-4 mx-auto md:max-w-5xl">
        <Outlet />;
      </main>
      <Toaster />
    </>
  );
}

export default App;
