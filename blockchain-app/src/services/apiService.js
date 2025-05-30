const API_BASE_URL = '/api';

class ApiService {
    async queryContract(contractId, functionName, parameters) {
        try {
            const response = await fetch(`${API_BASE_URL}/contract/${contractId}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    functionName,
                    parameters
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error querying contract');
            }
            
            return response.json();
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    }
    
    async getProductHistory(productId) {
        try {
            const contractId = process.env.REACT_APP_CONTRACT_ID;
            const result = await this.queryContract(
                contractId,
                'getTrackingHistory',
                [productId]
            );
            return result.data;
        } catch (error) {
            console.error('Error getting product history:', error);
            throw error;
        }
    }
    
    async getProduct(productId) {
        try {
            const contractId = process.env.REACT_APP_CONTRACT_ID;
            const result = await this.queryContract(
                contractId,
                'getProduct',
                [productId]
            );
        } catch (error) {
            console.error('Error getting product:', error);
            throw error;
        }   
    }   
}