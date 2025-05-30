import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ProductScan = () => {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useContext(AuthContext);

  // Simulate QR scanning functionality
  const startScanning = () => {
    setScanning(true);
    
    // In a real app, this would start the camera and scan a QR code
    // For this demo, we'll simulate a scan after a delay
    setTimeout(() => {
      const mockProductIds = ['PROD001', 'PROD002'];
      const randomProduct = mockProductIds[Math.floor(Math.random() * mockProductIds.length)];
      setResult(randomProduct);
      showToast(`Product ID scanned: ${randomProduct}`, 'success');
      setScanning(false);
    }, 3000);
  };

  const handleRedirect = () => {
    if (result) {
      navigate(`/products/${result}`);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Scan Product QR Code</h1>
      
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body text-center">
              {scanning ? (
                <div>
                  <div className="mb-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Scanning...</span>
                    </div>
                  </div>
                  <p>Scanning QR code... Please hold your camera steady.</p>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => setScanning(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  {result ? (
                    <div>
                      <div className="alert alert-success">
                        <p><strong>Scanned Product ID:</strong> {result}</p>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={handleRedirect}
                      >
                        View Product Details
                      </button>
                      <button 
                        className="btn btn-secondary ms-2"
                        onClick={() => {
                          setResult('');
                          setScanning(false);
                        }}
                      >
                        Scan Another
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <div style={{
                          width: '200px',
                          height: '200px',
                          border: '2px dashed #ccc',
                          margin: '0 auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="fa fa-camera fa-3x text-muted"></i>
                        </div>
                      </div>
                      <p>Point your camera at a product QR code to scan it.</p>
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={startScanning}
                      >
                        Start Scanning
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Manual Entry</h5>
              <p>If scanning doesn't work, you can manually enter the product ID.</p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/products/track')}
              >
                Go to Manual Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScan;