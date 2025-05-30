import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, role } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Supply Chain Tracker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                {role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin Panel</Link>
                  </li>
                )}
                {(role === 'manufacturer' || role === 'admin') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/manufacturer">Manufacturer</Link>
                  </li>
                )}
                {(role === 'distributor' || role === 'admin') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/distributor">Distributor</Link>
                  </li>
                )}
                {(role === 'retailer' || role === 'admin') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/retailer">Retailer</Link>
                  </li>
                )}
                <li className="nav-item">
                  <a href="#!" className="nav-link" onClick={logout}>Logout</a>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/">Connect Wallet</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;