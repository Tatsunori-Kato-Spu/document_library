import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Navber from "./Navber/Navber";


function Layout() {
    return ( 
        <div>
            <Header/>
            <Outlet/>
        </div>
     );
}

export default Layout;