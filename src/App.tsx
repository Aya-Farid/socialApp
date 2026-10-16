// import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './Layout/Layout'
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Notfound from './Pages/Notfound/Notfound';
import AuthContextProvider from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import AuthRoute from './Components/AuthRoute/AuthRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostDetails from './Pages/PostDetails/PostDetails';
import  { Toaster } from 'react-hot-toast';
import { Helmet, HelmetProvider } from "react-helmet-async";
import Notifications from './Components/Notifications/Notifications';
const query = new QueryClient()

const routers = createBrowserRouter([
    {
        path: "",
        element: <Layout />,
        children: [
            { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
            { path: "home", element: <ProtectedRoute><Home /></ProtectedRoute> },
            { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
            { path: "postdetails/:id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
            { path: "notifications", element: <ProtectedRoute><Notifications /></ProtectedRoute> },
            { path: "login", element: <AuthRoute><Login /></AuthRoute> },
            { path: "register", element: <AuthRoute><Register /></AuthRoute> },
            { path: "*", element: <Notfound /> },
        ],
    },
]);







 function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Aya's Route Posts</title>
      </Helmet>

      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <Toaster />
          <RouterProvider router={routers} />
        </AuthContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;