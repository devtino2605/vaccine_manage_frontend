import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import LayoutClient from './components/client/layout.client';
import NotFound from './components/share/not.found';
import ShopPage from './pages/client/_shop';
import DashboardPage from './pages/admin/dashboard';
import RegisterPage from './pages/auth/register';
import LoginPage from './pages/auth/login';
import LayoutAdmin from './components/admin/layout.admin';
import { fetchAccount } from './redux/slice/accountSlide';
import LayoutApp from './components/share/layout.app';
import ProtectedAdminRoute from './components/share/protected-route';
import VaccinePage from './pages/admin/vaccine';
import AppointmentPage from './pages/admin/appointment';
import CenterPage from './pages/admin/center';
import UserPage from './pages/admin/user';
import MySchedulePage from './pages/admin/my-schedule';
import ProfilePage from './pages/auth/profile';
import ProtectedUserRoute from './components/share/protected-route/user-protected';
import PermissionPage from './pages/admin/permission';
import RolePage from './pages/admin/role';

import BlogPage from './pages/client/_blog';
import HomePage from './pages/client/_home';
import SuccessPage from './pages/client/_success';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount());
  });

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <LayoutApp>
          <LayoutClient />
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'shop', element: <ShopPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'success', element: <SuccessPage /> },
        {
          path: 'profile',
          element: (
            <ProtectedUserRoute>
              <ProfilePage />
            </ProtectedUserRoute>
          ),
        },
      ],
    },

    {
      path: '/admin',
      element: (
        <ProtectedAdminRoute>
          <LayoutApp>
            <LayoutAdmin />
          </LayoutApp>
        </ProtectedAdminRoute>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: 'vaccines',
          element: <VaccinePage />,
        },
        {
          path: 'users',
          element: <UserPage />,
        },
        {
          path: 'centers',
          element: <CenterPage />,
        },
        {
          path: 'permissions',
          element: <PermissionPage />,
        },
        {
          path: 'roles',
          element: <RolePage />,
        },
        {
          path: 'appointments/update',
          element: <AppointmentPage />,
        },
        {
          path: 'my-schedule',
          element: <MySchedulePage />,
        },
      ],
    },

    {
      path: '/login',
      element: <LoginPage />,
    },

    {
      path: '/register',
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
