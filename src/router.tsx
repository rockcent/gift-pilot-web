import { createBrowserRouter, Navigate } from 'react-router-dom';
import { UserLayout } from './layout/UserLayout';
import { AdminLayout } from './layout/AdminLayout';
import { AdminAuthGuard } from './guards/AdminAuthGuard';

// C 端用户页面
import { HomePage } from './pages/user/HomePage';
import { RecommendPage } from './pages/user/RecommendPage';
import { ContentPage } from './pages/user/ContentPage';
import { CoverPage } from './pages/user/CoverPage';
import { PublishConfirmPage } from './pages/user/PublishConfirmPage';
import { PublishSuccessPage } from './pages/user/PublishSuccessPage';
import { OrdersPage } from './pages/user/OrdersPage';
import { ReviewPage } from './pages/user/ReviewPage';
import { NextPlanPage } from './pages/user/NextPlanPage';
import { MemoryPage } from './pages/user/MemoryPage';

// 管理后台页面
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { GiftsPage } from './pages/admin/GiftsPage';
import { AdminOrdersPage } from './pages/admin/OrdersPage';
import { UsersPage } from './pages/admin/UsersPage';
import { ContentReviewPage } from './pages/admin/ContentReviewPage';
import { MemoryAuditPage } from './pages/admin/MemoryAuditPage';
import { FinancePage } from './pages/admin/FinancePage';

export const router = createBrowserRouter([
  // C 端用户
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'recommend', element: <RecommendPage /> },
      { path: 'content', element: <ContentPage /> },
      { path: 'cover', element: <CoverPage /> },
      { path: 'publish-confirm', element: <PublishConfirmPage /> },
      { path: 'publish-success', element: <PublishSuccessPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'next-plan', element: <NextPlanPage /> },
      { path: 'memory', element: <MemoryPage /> }
    ]
  },

  // 管理后台登录（公开）
  { path: '/admin/login', element: <LoginPage /> },

  // 管理后台（鉴权）
  {
    path: '/admin',
    element: (
      <AdminAuthGuard>
        <AdminLayout />
      </AdminAuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'gifts', element: <GiftsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'content', element: <ContentReviewPage /> },
      { path: 'memory', element: <MemoryAuditPage /> },
      { path: 'finance', element: <FinancePage /> }
    ]
  },

  // 兜底
  { path: '*', element: <Navigate to="/" replace /> }
]);
