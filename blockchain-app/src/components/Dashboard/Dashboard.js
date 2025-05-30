// src/components/dashboard/Dashboard.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const { user, role } = useContext(AuthContext);

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name || 'User'}!</p>
      
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Track Product</h5>
              <p className="card-text">Scan or enter a product ID to view its supply chain history.</p>
              <Link to="/products/track" className="btn btn-primary">Track Product</Link>
            </div>
          </div>
        </div>
        
        {(role === 'manufacturer' || role === 'admin') && (
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Create Product</h5>
                <p className="card-text">Register a new product on the blockchain.</p>
                <Link to="/products/create" className="btn btn-success">Create Product</Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Scan QR</h5>
              <p className="card-text">Scan a product's QR code to view details.</p>
              <Link to="/products/scan" className="btn btn-info">Scan QR Code</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;