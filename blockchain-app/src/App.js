import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';  // Fixed case sensitivity
import Home from './components/pages/Home';
import Dashboard from './components/Dashboard/Dashboard';
import ProductCreate from './components/products/ProductCreate';
import ProductDetail from './components/products/ProductDetail';
import ProductTrack from './components/products/ProductTrack';
import ProductScan from './components/products/ProductScan';
import ManufacturerPanel from './components/roles/ManufacturerPanel';
import DistributorPanel from './components/roles/DistributorPanel';
import RetailerPanel from './components/roles/RetailerPanel';
import AdminPanel from './components/admin/AdminPanel';
import NotFound from './components/pages/NotFound';
import AuthContext from './context/AuthContext';
import hashPackService from './services/hashPackService';
import Spinner from './components/Layout/Spinner';  // Fixed case sensitivity
import Toast from './components/Layout/Toast';  // Fixed case sensitivity

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin', 'manufacturer', 'distributor', 'retailer'
  const [accountId, setAccountId] = useState(null);
  
  // Application state
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Fetch user profile from backend
  const fetchUserProfile = useCallback(async (accountId) => {
    try {
      // In production, replace with real API call
      setTimeout(() => {
        // Simulate different roles based on account ID for testing
        const lastChar = accountId.toString().slice(-1);
        let userRole;
        
        switch(lastChar) {
          case '1':
            userRole = 'admin';
            break;
          case '2':
            userRole = 'manufacturer';
            break;
          case '3':
            userRole = 'distributor';
            break;
          case '4':
            userRole = 'retailer';
            break;
          default:
            userRole = 'consumer';
        }
        
        setUser({
          accountId: accountId,
          name: `User ${accountId.substring(0, 5)}`,
          email: `user${accountId.substring(0, 5)}@example.com`
        });
        
        setRole(userRole);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      showToast('Failed to load user profile', 'error');
    }
  }, []);

  // Initialize HashPack wallet connection
  useEffect(() => {
    const initializeHashPack = async () => {
      try {
        await hashPackService.init();
        setInitialized(true);

        // Check if wallet is connected
        const accountId = hashPackService.getAccountId();
        if (accountId) {
          setAccountId(accountId);
          fetchUserProfile(accountId); // Call API to get user profile
        }
      } catch (error) {
        console.error('Failed to initialize HashPack:', error);
        showToast('Failed to connect to wallet service', 'error');
      } finally {
        setLoading(false);
      }
    };

    initializeHashPack();
  }, [fetchUserProfile]);

  // Connect wallet function for Home component
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      const accountId = await hashPackService.connectWallet();
      if (accountId) {
        setAccountId(accountId);
        fetchUserProfile(accountId);
        showToast('Wallet connected successfully', 'success');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      showToast('Failed to connect wallet', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Logout function
  const logout = useCallback(() => {
    hashPackService.disconnect();
    setUser(null);
    setRole(null);
    setAccountId(null);
    showToast('Logged out successfully', 'success');
  }, []);

  // Toast notification helper
  const showToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 5000);
  }, []);

  // Auth context value
  const authContextValue = {
    user,
    accountId,
    role,
    isAuthenticated: !!user,
    loading,
    logout,
    showToast,
    connectWallet
  };

  // Private route component
  const PrivateRoute = ({ element, allowedRoles = [] }) => {
    if (loading) return <Spinner />;
    
    if (!user) {
      return <Navigate to="/" />;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      showToast('Access denied: You do not have permission to view this page', 'error');
      return <Navigate to="/dashboard" />;
    }
    
    return element;
  };

  if (loading && !initialized) {
    return <div className="app-loader"><Spinner /></div>;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
              
              {/* Private routes */}
              <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
              
              {/* Role-specific routes */}
              <Route path="/admin" element={<PrivateRoute element={<AdminPanel />} allowedRoles={['admin']} />} />
              
              <Route path="/manufacturer" element={
                <PrivateRoute element={<ManufacturerPanel />} allowedRoles={['admin', 'manufacturer']} />
              } />
              
              <Route path="/distributor" element={
                <PrivateRoute element={<DistributorPanel />} allowedRoles={['admin', 'distributor']} />
              } />
              
              <Route path="/retailer" element={
                <PrivateRoute element={<RetailerPanel />} allowedRoles={['admin', 'retailer']} />
              } />
              
              {/* Product routes - more specific routes first */}
              <Route path="/products/create" element={
                <PrivateRoute element={<ProductCreate />} allowedRoles={['admin', 'manufacturer']} />
              } />
              <Route path="/products/track" element={<PrivateRoute element={<ProductTrack />} />} />
              <Route path="/products/scan" element={<PrivateRoute element={<ProductScan />} />} />
              <Route path="/products/:id" element={<PrivateRoute element={<ProductDetail />} />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {toast.show && <Toast message={toast.message} type={toast.type} />}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;