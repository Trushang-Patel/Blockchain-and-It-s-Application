import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import hashPackService from '../../services/hashPackService';

const Home = () => {
  const { connectWallet, loading, isAuthenticated } = useContext(AuthContext);
  const [connecting, setConnecting] = useState(false);
  const [pairingString, setPairingString] = useState('');
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initPairing = async () => {
      try {
        const data = await hashPackService.init();
        if (data && data.pairingString) {
          setPairingString(data.pairingString);
        }
      } catch (error) {
        console.error("Error initializing HashPack:", error);
      }
    };

    initPairing();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, loading]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const success = await connectWallet();
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setShowQR(true); // Show QR code as fallback
    } finally {
      setConnecting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pairingString);
    alert("Pairing string copied to clipboard!");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-4">Hedera Supply Chain</h1>
          <p className="lead mb-5">
            A transparent and secure way to track products from manufacture to retail using Hedera's distributed ledger technology
          </p>
          
          <div className="card shadow-lg border-0 mb-5">
            <div className="card-body p-5">
              <h2 className="card-title mb-4">Connect Your HashPack Wallet</h2>
              
              {!showQR ? (
                <div className="d-grid mb-3">
                  <button 
                    className="btn btn-primary btn-lg" 
                    onClick={handleConnect}
                    disabled={connecting || loading}
                  >
                    {connecting || loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Connecting...
                      </>
                    ) : 'Connect HashPack Wallet'}
                  </button>
                  <div className="mt-3">
                    <button 
                      className="btn btn-link" 
                      onClick={() => setShowQR(true)}
                    >
                      Connect using pairing string instead
                    </button>
                  </div>
                </div>
              ) : (
                <div className="qr-container mb-4">
                  <div className="mb-3">
                    <div className="d-flex justify-content-center mb-3">
                      {pairingString ? (
                        <div className="p-3 bg-light rounded">
                          <p className="small text-break">{pairingString}</p>
                        </div>
                      ) : (
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted">Use this pairing string in your HashPack mobile app</p>
                  </div>
                  
                  <div className="d-flex justify-content-center mb-3">
                    <button
                      className="btn btn-outline-secondary me-2"
                      onClick={copyToClipboard}
                      disabled={!pairingString}
                    >
                      Copy Pairing String
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setShowQR(false)}
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-3">
                <p className="text-muted">
                  Don't have HashPack?{' '}
                  <a
                    href="https://www.hashpack.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    Download it here
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="row mt-5">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="text-center mb-3">
                    <i className="bi bi-shield-lock fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Secure</h5>
                  <p className="card-text">Powered by Hedera's secure and energy-efficient distributed ledger technology</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="text-center mb-3">
                    <i className="bi bi-eye fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Transparent</h5>
                  <p className="card-text">Complete visibility into product journeys from manufacturer to consumer</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="text-center mb-3">
                    <i className="bi bi-check-circle fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Verifiable</h5>
                  <p className="card-text">Cryptographically verify product authenticity and ownership transfers</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5">
            <h3>How It Works</h3>
            <div className="timeline mt-4">
              <div className="row g-0">
                <div className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-auto">
                          <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{width: "50px", height: "50px", fontSize: "1.2rem"}}>
                            1
                          </div>
                        </div>
                        <div className="col">
                          <h5 className="mt-0">Connect Your HashPack Wallet</h5>
                          <p className="text-muted">Connect your Hedera wallet to get started, which authenticates your role in the supply chain</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row g-0">
                <div className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-auto">
                          <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{width: "50px", height: "50px", fontSize: "1.2rem"}}>
                            2
                          </div>
                        </div>
                        <div className="col">
                          <h5 className="mt-0">Create or Track Products</h5>
                          <p className="text-muted">Manufacturers create digital product identities, while distributors and retailers verify and update their status</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row g-0">
                <div className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-auto">
                          <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{width: "50px", height: "50px", fontSize: "1.2rem"}}>
                            3
                          </div>
                        </div>
                        <div className="col">
                          <h5 className="mt-0">Record Updates on Hedera</h5>
                          <p className="text-muted">Each transaction is securely recorded on the Hedera network, creating an immutable record of the product journey</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5">
            <div className="card border-0 bg-light">
              <div className="card-body p-4">
                <h4 className="mb-3">Role-Based Access</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <i className="bi bi-gear-fill text-primary fs-4"></i>
                      </div>
                      <div>
                        <h6>Manufacturers</h6>
                        <p className="text-muted small">Create products and initiate their journey</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <i className="bi bi-truck text-primary fs-4"></i>
                      </div>
                      <div>
                        <h6>Distributors</h6>
                        <p className="text-muted small">Verify receipt and transfer products</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <i className="bi bi-shop text-primary fs-4"></i>
                      </div>
                      <div>
                        <h6>Retailers</h6>
                        <p className="text-muted small">Confirm receipt and sell to consumers</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <i className="bi bi-shield-check text-primary fs-4"></i>
                      </div>
                      <div>
                        <h6>Consumers</h6>
                        <p className="text-muted small">Verify product authenticity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-5 text-center">
        <p className="text-muted">
          © {new Date().getFullYear()} Hedera Supply Chain | Built by Trushang-Patel
        </p>
        <p className="text-muted small">
          Running on Hedera {process.env.REACT_APP_HEDERA_NETWORK || 'Testnet'}
        </p>
      </div>
    </div>
  );
};

export default Home;