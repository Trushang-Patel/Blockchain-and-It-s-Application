import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ProductTrack = () => {
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!productId.trim()) {
      showToast('Please enter a product ID', 'error');
      return;
    }
    
    setLoading(true);
    // Navigate to product detail page
    navigate(`/products/${productId}`);
  };

  return (
    <div className="container mt-4">
      <h1>Track Product</h1>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Enter Product ID</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter Product ID"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Track Product'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Scan QR Code</h5>
              <p>Use the camera to scan a product QR code.</p>
              <button 
                className="btn btn-success"
                onClick={() => navigate('/products/scan')}
              >
                Open Scanner
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3>Sample Product IDs for Testing:</h3>
        <div className="list-group">
          <button 
            className="list-group-item list-group-item-action"
            onClick={() => setProductId('PROD001')}
          >
            PROD001 - Premium Smartphone
          </button>
          <button 
            className="list-group-item list-group-item-action"
            onClick={() => setProductId('PROD002')}
          >
            PROD002 - Wireless Headphones
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTrack;