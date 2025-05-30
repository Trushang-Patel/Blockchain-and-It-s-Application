import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import hederaService from '../../services/hederaService';
import Spinner from '../Layout/Spinner';

const AdminPanel = () => {
  const { showToast } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real application, these would be API calls to the backend
        // which would then query the blockchain
        setTimeout(() => {
          // Get all products
          const allProducts = Object.values(hederaService.products);
          setProducts(allProducts);
          
          // Get all stakeholders
          const allStakeholders = Object.values(hederaService.stakeholders);
          setStakeholders(allStakeholders);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load admin data', 'error');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [showToast]);

  const getRoleName = (roleCode) => {
    const roles = ['Manufacturer', 'Distributor', 'Retailer', 'Consumer'];
    return roles[roleCode] || 'Unknown';
  };

  const getStatusName = (statusCode) => {
    const statusNames = [
      'Created',
      'Manufacturing Complete',
      'Shipped to Distributor',
      'Received by Distributor',
      'Shipped to Retailer',
      'Received by Retailer',
      'Available for Sale',
      'Sold'
    ];
    return statusNames[statusCode] || 'Unknown';
  };

  if (loading) {
    return <div className="container mt-5"><Spinner /></div>;
  }

  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>
      <p className="lead">Monitor and manage the entire supply chain</p>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Total Products</h5>
              <h2>{products.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Total Stakeholders</h5>
              <h2>{stakeholders.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <Link to="/products/create" className="btn btn-outline-primary me-2">
                Register New Product
              </Link>
              <Link to="/products/track" className="btn btn-outline-info me-2">
                Track Product
              </Link>
              <button className="btn btn-outline-success" disabled>
                Add Stakeholder (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-7">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Product Inventory</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Current Owner</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.productId}>
                        <td>{product.productId}</td>
                        <td>{product.name}</td>
                        <td>
                          <span className="badge bg-info">
                            {getStatusName(product.status)}
                          </span>
                        </td>
                        <td>{product.currentOwner}</td>
                        <td>
                          <Link to={`/products/${product.productId}`} className="btn btn-sm btn-outline-primary">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Stakeholders</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Account ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stakeholders.map(stakeholder => (
                      <tr key={stakeholder.accountId}>
                        <td>{stakeholder.accountId}</td>
                        <td>{stakeholder.name}</td>
                        <td>{getRoleName(stakeholder.role)}</td>
                        <td>
                          <span className={`badge ${stakeholder.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {stakeholder.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h5>Contract Details</h5>
            </div>
            <div className="card-body">
              <p><strong>Contract ID:</strong> {process.env.CONTRACT_ID || '0.0.12345 (Demo)'}</p>
              <p><strong>Network:</strong> {process.env.HEDERA_NETWORK || 'Testnet (Demo)'}</p>
              <p>
                <button className="btn btn-sm btn-outline-secondary" disabled>
                  Update Contract (Coming Soon)
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header">
          <h5>System Metrics</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6>Average Processing Time</h6>
                  <h3>2.3s</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6>Total Transactions</h6>
                  <h3>{products.length * 2}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6>Successful Transactions</h6>
                  <h3>100%</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6>System Uptime</h6>
                  <h3>99.9%</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;