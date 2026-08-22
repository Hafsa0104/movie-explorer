import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { FavouritesProvider } from './contexts/FavouritesContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavouritesProvider>
          <AppRoutes />
        </FavouritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;