import { HashRouter,Routes, Route } from 'react-router-dom';
import SearchBar from './pages/Searchbar/Searchbar';


import Layout from './Layout/Layout';


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import './App.css'



function App() {

  return (
    <>
      <div className="App">
        <HashRouter>
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route path='/' element={<SearchBar />} />
          </Route>
        </Routes>
        </HashRouter>
      </div>
    </>
  )
}

export default App

