import React, { createContext, useState, useEffect } from 'react';
import hashPackService from '../services/hashPackService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState(null);

  useEffect(() => {
    const initWallet = async () => {
      try {
        await hashPackService.init();
        
        if (hashPackService.isWalletConnected()) {
          const accountId = hashPackService.getAccountId();
          setAccountId(accountId);
          setIsAuthenticated(true);
          
          // Determine role based on account ID
          determineUserRole(accountId);
        }
      } catch (error) {
        console.error('Error initializing wallet:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initWallet();
  }, []);
  
  const determineUserRole = (accountId) => {
    switch(accountId) {
      case "0.0.1111":
        setRole("admin");
        break;
      case "0.0.2222":
        setRole("manufacturer");
        break;
      case "0.0.3333":
        setRole("distributor");
        break;
      case "0.0.4444":
        setRole("retailer");
        break;
      default:
        setRole("user");
    }
  };
  
  const connectWallet = async () => {
    try {
      const accountId = await hashPackService.connectWallet();
      setAccountId(accountId);
      setIsAuthenticated(true);
      determineUserRole(accountId);
      return accountId;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      showToast('Failed to connect wallet', 'error');
      return null;
    }
  };
  
  const logout = () => {
    hashPackService.disconnect();
    setIsAuthenticated(false);
    setAccountId(null);
    setRole(null);
    showToast('Disconnected from wallet', 'info');
  };
  
  const showToast = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };
  
  const clearToast = () => {
    setToastMessage(null);
  };
  
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      accountId,
      role,
      loading,
      connectWallet,
      logout,
      showToast,
      clearToast,
      toastMessage,
      toastType
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;