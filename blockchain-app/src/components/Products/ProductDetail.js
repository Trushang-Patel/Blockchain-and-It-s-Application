import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import hederaService from '../../services/hederaService';
import Spinner from '../Layout/Spinner';

const ProductDetail = () => {
  const { id } = useParams();
  const { showToast } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const productData = await hederaService.getProduct(id);
        const historyData = await hederaService.getTrackingHistory(id);
        setProduct(productData);
        setTrackingHistory(historyData);
      } catch (error) {
        console.error('Error fetching product details:', error);
        showToast(`Failed to load product details: ${error.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, showToast]);

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

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Product not found</div>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  // Try to parse metadata if it's a string
  let metadata = {};
  try {
    metadata = typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata;
  } catch (e) {
    metadata = {};
  }

  return (
    <div className="container mt-4">
      <h1>{product.name}</h1>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5>Product Details</h5>
            </div>
            <div className="card-body">
              <p><strong>Product ID:</strong> {product.productId}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Current Status:</strong> <span className="badge bg-info">{getStatusName(product.status)}</span></p>
              <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
              <p><strong>Current Owner:</strong> {product.currentOwner}</p>
              <p><strong>Last Updated:</strong> {new Date(product.timestamp).toLocaleString()}</p>
            </div>
          </div>

          {Object.keys(metadata).length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>Additional Information</h5>
              </div>
              <div className="card-body">
                {Object.entries(metadata).map(([key, value]) => (
                  <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Tracking History</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {trackingHistory.map((event, index) => (
                  <div key={index} className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{getStatusName(event.status)}</h5>
                      <small>{new Date(event.timestamp).toLocaleString()}</small>
                    </div>
                    <p className="mb-1">{event.comments}</p>
                    <small><strong>Location:</strong> {event.location}</small><br />
                    <small><strong>Actor:</strong> {event.actor}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/dashboard" className="btn btn-secondary me-2">Back to Dashboard</Link>
        <Link to={`/products/track`} className="btn btn-primary">Track Another Product</Link>
      </div>
    </div>
  );
};

export default ProductDetail;