import App from '../App';
import Header from './Header';
import { Toaster } from './ui/sonner';

export default function Root() {
  return (
    <>
      <Header />
      <main className="p-4 space-y-4 mx-auto md:max-w-5xl">
        <App />
      </main>
      <Toaster />
    </>
  );
}
