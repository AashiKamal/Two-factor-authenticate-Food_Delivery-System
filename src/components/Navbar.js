
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useCart } from './ContextReducer';
export default function Navbar() {
  const [cartView, setCartView] = useState(false);
  let data = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst italic" to="/">
            FOODAPP
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto mb-2">
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              {localStorage.getItem('authToken') ? (
                <li className="nav-item">
                  <Link className="nav-link active fs-5" aria-current="page" to="/myorder">
                    My Orders
                  </Link>
                </li>
              ) : null}
            </ul>

            {!localStorage.getItem('authToken') ? (
              <div className="d-flex">
                <Link className="btn bg-white text-success mx-1" to="/login">
                  Login
                </Link>
                <Link className="btn bg-white text-success mx-1" to="/createuser">
                  Signup
                </Link>
              </div>
            ) : (
              <>
                <div className="btn bg-white text-success mx-2" onClick={() => setCartView(true)}>
                  My Cart{' '}
                  <Badge pill bg="danger">
                    {data.length}
                  </Badge>
                </div>

                {cartView ? <Modal onClose={() => setCartView(false)}><Cart /></Modal> : null}

                <div className="btn bg-white text-success mx-2 text-danger" onClick={handleLogout}>
                  Log Out
                </div>
                <Link className="btn bg-white text-success mx-2 text-danger" to="/createtotp">
  TwoFAc
</Link>

                
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
