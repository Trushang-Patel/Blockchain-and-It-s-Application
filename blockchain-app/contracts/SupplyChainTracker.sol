// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainTracker {
    // Define roles for access control
    enum Role { Manufacturer, Distributor, Retailer, Consumer }
    
    // Define product status
    enum Status { 
        Created, 
        ManufacturingComplete, 
        ShippedToDistributor, 
        ReceivedByDistributor, 
        ShippedToRetailer, 
        ReceivedByRetailer, 
        Available, 
        Sold 
    }
    
    // Product structure
    struct Product {
        string productId;
        string name;
        string description;
        address manufacturer;
        address currentOwner;
        Status status;
        uint256 timestamp;
        string metadata;
    }
    
    // Tracking event structure
    struct TrackingEvent {
        address actor;
        Status status;
        uint256 timestamp;
        string location;
        string comments;
    }
    
    // Stakeholder structure
    struct Stakeholder {
        address stakeholderAddress;
        Role role;
        string name;
        bool isActive;
    }
    
    // Mappings
    mapping(string => Product) private products;
    mapping(string => TrackingEvent[]) private trackingHistory;
    mapping(address => Stakeholder) private stakeholders;
    mapping(address => bool) private admins;
    
    // Events
    event ProductCreated(string productId, address manufacturer, uint256 timestamp);
    event StatusChanged(string productId, Status newStatus, address actor, uint256 timestamp);
    event StakeholderAdded(address stakeholder, Role role);
    
    // Constructor sets the deployer as the initial admin
    constructor() {
        admins[msg.sender] = true;
    }
    
    // Modifiers
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can perform this action");
        _;
    }
    
    modifier onlyManufacturer() {
        require(stakeholders[msg.sender].role == Role.Manufacturer && stakeholders[msg.sender].isActive, 
                "Only active manufacturers can perform this action");
        _;
    }
    
    modifier onlyAuthorized(string memory _productId) {
        require(msg.sender == products[_productId].currentOwner || admins[msg.sender], 
                "Not authorized to update this product");
        _;
    }
    
    // Admin functions
    function addAdmin(address _admin) external onlyAdmin {
        admins[_admin] = true;
    }
    
    // Stakeholder management
    function addStakeholder(address _stakeholder, Role _role, string calldata _name) external onlyAdmin {
        stakeholders[_stakeholder] = Stakeholder({
            stakeholderAddress: _stakeholder,
            role: _role,
            name: _name,
            isActive: true
        });
        
        emit StakeholderAdded(_stakeholder, _role);
    }
    
    function updateStakeholderStatus(address _stakeholder, bool _isActive) external onlyAdmin {
        require(stakeholders[_stakeholder].stakeholderAddress != address(0), "Stakeholder does not exist");
        stakeholders[_stakeholder].isActive = _isActive;
    }
    
    // Product functions
    function createProduct(
        string calldata _productId, 
        string calldata _name,
        string calldata _description,
        string calldata _metadata
    ) 
        external 
        onlyManufacturer 
    {
        require(bytes(products[_productId].productId).length == 0, "Product already exists");
        
        products[_productId] = Product({
            productId: _productId,
            name: _name,
            description: _description,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            status: Status.Created,
            timestamp: block.timestamp,
            metadata: _metadata
        });
        
        // Record the initial tracking event
        TrackingEvent memory event_ = TrackingEvent({
            actor: msg.sender,
            status: Status.Created,
            timestamp: block.timestamp,
            location: "",
            comments: "Product created"
        });
        
        trackingHistory[_productId].push(event_);
        
        emit ProductCreated(_productId, msg.sender, block.timestamp);
    }
    
    function updateProductStatus(
        string calldata _productId, 
        Status _newStatus, 
        string calldata _location, 
        string calldata _comments
    ) 
        external 
        onlyAuthorized(_productId) 
    {
        require(bytes(products[_productId].productId).length > 0, "Product does not exist");
        require(_newStatus > products[_productId].status, "New status must be an advancement in the supply chain");
        
        products[_productId].status = _newStatus;
        products[_productId].timestamp = block.timestamp;
        
        // Record the tracking event
        TrackingEvent memory event_ = TrackingEvent({
            actor: msg.sender,
            status: _newStatus,
            timestamp: block.timestamp,
            location: _location,
            comments: _comments
        });
        
        trackingHistory[_productId].push(event_);
        
        emit StatusChanged(_productId, _newStatus, msg.sender, block.timestamp);
    }
    
    function transferOwnership(string calldata _productId, address _newOwner) external onlyAuthorized(_productId) {
        require(bytes(products[_productId].productId).length > 0, "Product does not exist");
        require(stakeholders[_newOwner].isActive, "New owner must be an active stakeholder");
        
        products[_productId].currentOwner = _newOwner;
    }
    
    // View functions
    function getProduct(string calldata _productId) external view returns (Product memory) {
        require(bytes(products[_productId].productId).length > 0, "Product does not exist");
        return products[_productId];
    }
    
    function getTrackingHistory(string calldata _productId) external view returns (TrackingEvent[] memory) {
        require(bytes(products[_productId].productId).length > 0, "Product does not exist");
        return trackingHistory[_productId];
    }
}