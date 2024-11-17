import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

import './Header.css';
function Header() {
    return ( 
        <div className="header-container">
            <header className="header">
        <img
          src='/public/Logo.png' // โลโก้ที่อยู่ใน public
          alt="Logo"
          className="header-logo"
        />
        <nav>
          <ul className="header-nav">
            <li className="nav-item">
              <a href="#Notifications">
                <FontAwesomeIcon icon={faBell} size="lg" style={{ color: 'orange' }} />
              </a>
            </li>
            <li className="nav-item">
              <a href="#profile">
                <FontAwesomeIcon icon={faUser} size="lg" style={{ color: 'orange' }} />
              </a>
            </li>
            <li className="nav-item">
              <a href="#login-logout">
                <FontAwesomeIcon icon={faRightToBracket} size="lg" style={{ color: 'orange' }} />
              </a>
            </li>
          </ul>
        </nav>
      </header>
        </div>
     );
}

export default Header;