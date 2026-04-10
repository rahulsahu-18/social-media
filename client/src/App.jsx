import { useEffect, createContext, useRef } from 'react'
import ChatPage from './components/ChatPage'
import EditProfile from './components/Editprofil'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux'
// import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
      },
      {
        path: '/account/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])


export const SocketContext = createContext(null);

function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      socketRef.current = io('http://localhost:3000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });

      socketRef.current.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketRef.current.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketRef.current?.close();
        socketRef.current = null;
      }
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      <RouterProvider router={browserRouter} />
    </SocketContext.Provider>
  )
}

export default App