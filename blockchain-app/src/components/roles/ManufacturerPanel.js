import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import hederaService from '../../services/hederaService';
import Spinner from '../Layout/Spinner';

const ManufacturerPanel = () => {
  const { user, accountId, showToast } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching manufacturer products
  useEffect(() => {
    const fetchManufacturerProducts = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch products from the blockchain
        // Here we're using our mock service
        
        // Simulate API delay
        setTimeout(() => {
          // Filter for products where currentOwner matches accountId
          const manufacturerProducts = Object.values(hederaService.products)
            .filter(product => product.manufacturer === accountId);
          
          setProducts(manufacturerProducts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching products:', error);
        showToast('Failed to load products', 'error');
        setLoading(false);
      }
    };
    
    fetchManufacturerProducts();
  }, [accountId, showToast]);

  const updateProductStatus = async (productId, newStatus) => {
    try {
      setLoading(true);
      await hederaService.updateProductStatus(
        productId, 
        newStatus, 
        "Manufacturing Facility", 
        "Product status updated by manufacturer", 
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
      <h1>Manufacturer Dashboard</h1>
      <p className="lead">Manage your manufacturing operations</p>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Products Managed</h5>
              <h2>{products.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <Link to="/products/create" className="btn btn-success me-2">
                Register New Product
              </Link>
              <Link to="/products/track" className="btn btn-info">
                Track Product
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5>Your Products</h5>
        </div>
        <div className="card-body">
          {products.length === 0 ? (
            <div className="alert alert-info">
              You haven't created any products yet. 
              <Link to="/products/create" className="ms-2">Create your first product</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Created</th>
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
                          {product.status === 0 && (
                            <button 
                              className="btn btn-outline-success"
                              onClick={() => updateProductStatus(product.productId, 1)}
                            >
                              Complete Manufacturing
                            </button>
                          )}
                          {product.status === 1 && (
                            <button 
                              className="btn btn-outline-info"
                              onClick={() => updateProductStatus(product.productId, 2)}
                            >
                              Ship to Distributor
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
    </div>
  );
};

export default ManufacturerPanel;