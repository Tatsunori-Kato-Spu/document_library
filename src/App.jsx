import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SearchBar from './pages/Searchbar/Searchbar';


import Layout from './Layout/Layout';
import Permission from './pages/Permission/Permission';
import Stats from './pages/Stats/Stats';
import Navbar from './Layout/Navber/Navber';


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import './App.css'



function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
    },
    { path: "search",
      element: <Navbar />,
    },{
      path: "permission",
      element: <Permission />,
    },
    {
      path: "stats",
      element: <Stats />,
    }
  ]);
  return (
   <RouterProvider router={router}/>
  )
}

export default App

