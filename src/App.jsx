import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { BugsProvider } from './context/BugsContext';
import { TestRunsProvider } from './context/TestRunsContext';
import { RecordingProvider } from './context/RecordingContext';
import { ReplayProvider } from './context/ReplayContext';
import { PlaygroundLayout } from './playground/PlaygroundLayout';
import { PlaygroundCartPage } from './playground/pages/PlaygroundCartPage';
import { PlaygroundCheckoutPage } from './playground/pages/PlaygroundCheckoutPage';
import { PlaygroundProductDetailPage } from './playground/pages/PlaygroundProductDetailPage';
import { PlaygroundProductsPage } from './playground/pages/PlaygroundProductsPage';
import { BugDetailsPage } from './pages/BugDetailsPage';
import { CreateBugPage } from './pages/CreateBugPage';
import { AboutPage } from './pages/AboutPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CreateTestRunPage } from './pages/CreateTestRunPage';
import { DashboardPage } from './pages/DashboardPage';
import { TestRunDetailsPage } from './pages/TestRunDetailsPage';
import { TestRunsPage } from './pages/TestRunsPage';
import { ImagePreviewOverlay } from './components/ui/ImagePreviewOverlay';
import { StoragePage } from './pages/StoragePage';

export default function App() {
  return (
    <BugsProvider>
      <TestRunsProvider>
        <BrowserRouter>
          <ReplayProvider>
            <RecordingProvider>
              <ImagePreviewOverlay />
              <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="storage" element={<StoragePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="bugs/new" element={<CreateBugPage />} />
                <Route path="bugs/:id" element={<BugDetailsPage />} />
                <Route path="test-runs" element={<TestRunsPage />} />
                <Route path="test-runs/new" element={<CreateTestRunPage />} />
                <Route path="test-runs/:id" element={<TestRunDetailsPage />} />
                <Route path="playground" element={<PlaygroundLayout />}>
                  <Route index element={<Navigate to="products" replace />} />
                  <Route path="login" element={<Navigate to="products" replace />} />
                  <Route path="products" element={<PlaygroundProductsPage />} />
                  <Route path="products/:productId" element={<PlaygroundProductDetailPage />} />
                  <Route path="cart" element={<PlaygroundCartPage />} />
                  <Route path="checkout" element={<PlaygroundCheckoutPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </RecordingProvider>
          </ReplayProvider>
        </BrowserRouter>
      </TestRunsProvider>
    </BugsProvider>
  );
}
