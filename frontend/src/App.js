import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectUser } from './features/userSlice';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import GoogleCallback from './pages/GoogleCallback';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import UserProfile from './components/UserProfile';
import Notifications from './components/Notifications';
import ReptileDetails from './components/ReptileDetails';
import ForumPost from './pages/ForumPost';
import ForumThreads from './pages/ForumThreads';
import ForumCategories from './pages/ForumCategories';

function App() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          dispatch(loginUser(res.data));
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/notifications" element={<Notifications userId="USER_ID" />} />
        <Route path="/reptiles/:reptileId" element={<ProtectedRoute><ReptileDetails /></ProtectedRoute>} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <NavBar></NavBar>
              <Home />
              <Footer></Footer>
            </ProtectedRoute>
          }
        />

        <Route path="/forum" element={<ProtectedRoute><NavBar /><ForumCategories /><Footer /></ProtectedRoute>} />
        <Route path="/forum/categories/:categoryId" element={<ProtectedRoute><NavBar /><ForumThreads /><Footer /></ProtectedRoute>} />
        <Route path="/forum/threads/:threadId" element={<ProtectedRoute><NavBar /><ForumPost /><Footer /></ProtectedRoute>} />
        <Route path="/login-google-callback" element={<GoogleCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
