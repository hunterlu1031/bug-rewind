import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { BugsProvider } from './context/BugsContext';
import { RecordingProvider } from './context/RecordingContext';
import { ReplayProvider } from './context/ReplayContext';
import { PlaygroundLayout } from './playground/PlaygroundLayout';
import { PlaygroundCartPage } from './playground/pages/PlaygroundCartPage';
import { PlaygroundCheckoutPage } from './playground/pages/PlaygroundCheckoutPage';
import { PlaygroundLoginPage } from './playground/pages/PlaygroundLoginPage';
import { PlaygroundProductDetailPage } from './playground/pages/PlaygroundProductDetailPage';
import { PlaygroundProductsPage } from './playground/pages/PlaygroundProductsPage';
import { BugDetailsPage } from './pages/BugDetailsPage';
import { CreateBugPage } from './pages/CreateBugPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  return (
    <BugsProvider>
      <BrowserRouter>
        <ReplayProvider>
          <RecordingProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="bugs/new" element={<CreateBugPage />} />
                <Route path="bugs/:id" element={<BugDetailsPage />} />
              </Route>
              <Route path="playground" element={<PlaygroundLayout />}>
                <Route index element={<Navigate to="login" replace />} />
                <Route path="login" element={<PlaygroundLoginPage />} />
                <Route path="products" element={<PlaygroundProductsPage />} />
                <Route path="products/:productId" element={<PlaygroundProductDetailPage />} />
                <Route path="cart" element={<PlaygroundCartPage />} />
                <Route path="checkout" element={<PlaygroundCheckoutPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </RecordingProvider>
        </ReplayProvider>
      </BrowserRouter>
    </BugsProvider>
  );
}
