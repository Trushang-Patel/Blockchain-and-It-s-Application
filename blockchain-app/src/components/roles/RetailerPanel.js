import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import hederaService from '../../services/hederaService';
import Spinner from '../Layout/Spinner';

const RetailerPanel = () => {
  const { user, accountId, showToast } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching retailer products
  useEffect(() => {
    const fetchRetailerProducts = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch products from the blockchain
        // that are currently owned by this retailer
        
        // Simulate API delay
        setTimeout(() => {
          // Filter for products where currentOwner matches accountId
          const retailerProducts = Object.values(hederaService.products)
            .filter(product => product.currentOwner === accountId);
          
          setProducts(retailerProducts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching products:', error);
        showToast('Failed to load products', 'error');
        setLoading(false);
      }
    };
    
    fetchRetailerProducts();
  }, [accountId, showToast]);

  const updateProductStatus = async (productId, newStatus) => {
    try {
      setLoading(true);
      await hederaService.updateProductStatus(
        productId, 
        newStatus, 
        "Retail Store", 
        newStatus === 5 ? "Product received at retail store" : 
        newStatus === 6 ? "Product available for sale" : "Product sold to consumer", 
        accountId
      );
      
      // Refresh product list
      const updatedProducts = products.map(product => 
        product.productId === productId 
          ? { ...product, status: newStatus } 
          : product
      );
      setProducts(updatedProducts);
      
      showToast('Product status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating product status:', error);
      showToast(`Failed to update status: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
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
      <h1>Retailer Dashboard</h1>
      <p className="lead">Manage your retail inventory</p>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Products in Inventory</h5>
              <h2>{products.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <Link to="/products/track" className="btn btn-primary">
                Track Product
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5>Your Inventory</h5>
        </div>
        <div className="card-body">
          {products.length === 0 ? (
            <div className="alert alert-info">
              You don't have any products in your inventory yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Received</th>
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
                      <td>{new Date(product.timestamp).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link to={`/products/${product.productId}`} className="btn btn-outline-primary">
                            View
                          </Link>
                          {product.status === 4 && (
                            <button 
                              className="btn btn-outline-success"
                              onClick={() => updateProductStatus(product.productId, 5)}
                            >
                              Mark as Received
                            </button>
                          )}
                          {product.status === 5 && (
                            <button 
                              className="btn btn-outline-info"
                              onClick={() => updateProductStatus(product.productId, 6)}
                            >
                              Make Available
                            </button>
                          )}
                          {product.status === 6 && (
                            <button 
                              className="btn btn-outline-warning"
                              onClick={() => updateProductStatus(product.productId, 7)}
                            >
                              Mark as Sold
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Generate QR Codes</h5>
            </div>
            <div className="card-body">
              <p>Create QR codes for your products to enable easy tracking and verification.</p>
              <button className="btn btn-outline-primary" disabled>
                Generate QR Codes (Coming Soon)
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Sales Analytics</h5>
            </div>
            <div className="card-body">
              <p>Track product sales performance and verify authenticity.</p>
              <div className="alert alert-secondary">
                Sales analytics will be available once you have sold products.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header">
          <h5>Consumer Verification Portal</h5>
        </div>
        <div className="card-body">
          <p>
            Enable your customers to verify product authenticity by scanning the QR code 
            or entering the product ID on your consumer verification portal.
          </p>
          <div className="d-grid gap-2 col-md-6 mx-auto">
            <button className="btn btn-outline-success" disabled>
              Setup Verification Portal (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerPanel;