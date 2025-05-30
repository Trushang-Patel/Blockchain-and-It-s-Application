import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import hederaService from '../../services/hederaService';

const ProductCreate = () => {
  const { accountId, showToast } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productId: '',
    name: '',
    description: '',
    location: '',
    metadata: {}
  });

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleMetadataChange = (e) => {
    setProductData({
      ...productData,
      metadata: {
        ...productData.metadata,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productData.productId || !productData.name) {
      showToast('Product ID and Name are required', 'error');
      return;
    }

    try {
      setLoading(true);
      await hederaService.createProduct(productData, accountId);
      showToast('Product created successfully', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating product:', error);
      showToast(`Failed to create product: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create New Product</h1>
      <div className="card mt-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="productId" className="form-label">Product ID</label>
              <input
                type="text"
                className="form-control"
                id="productId"
                name="productId"
                value={productData.productId}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Product Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={productData.description}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Manufacturing Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={productData.location}
                onChange={handleChange}
              />
            </div>
            
            <h5 className="mt-4">Product Metadata</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="model" className="form-label">Model</label>
                <input
                  type="text"
                  className="form-control"
                  id="model"
                  name="model"
                  onChange={handleMetadataChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="color" className="form-label">Color</label>
                <input
                  type="text"
                  className="form-control"
                  id="color"
                  name="color"
                  onChange={handleMetadataChange}
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="weight" className="form-label">Weight</label>
                <input
                  type="text"
                  className="form-control"
                  id="weight"
                  name="weight"
                  onChange={handleMetadataChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="dimensions" className="form-label">Dimensions</label>
                <input
                  type="text"
                  className="form-control"
                  id="dimensions"
                  name="dimensions"
                  onChange={handleMetadataChange}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;