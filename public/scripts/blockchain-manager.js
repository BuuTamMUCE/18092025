/**
 * Blockchain Manager for NFT Certificates and Web3 Integration
 * Handles certificate minting, verification, and smart contracts
 */

class BlockchainManager {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.isConnected = false;
        this.account = null;
        this.chainId = null;
        this.contractAddress = '0x...'; // Your smart contract address
        this.contractABI = this.getContractABI();
        
        this.init();
    }

    /**
     * Initialize Blockchain Manager
     */
    async init() {
        try {
            // Check if Web3 is available
            if (typeof window.ethereum !== 'undefined') {
                this.provider = window.ethereum;
                console.log('✅ Web3 provider detected');
            } else {
                console.warn('⚠️ No Web3 provider found. Please install MetaMask.');
                return;
            }

            // Setup event listeners
            this.setupEventListeners();
            
            console.log('✅ Blockchain Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Blockchain Manager:', error);
        }
    }

    /**
     * Connect to Web3 provider
     */
    async connect() {
        try {
            // Request account access
            const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
            this.account = accounts[0];
            this.isConnected = true;

            // Get chain ID
            this.chainId = await this.provider.request({ method: 'eth_chainId' });

            // Setup contract
            await this.setupContract();

            console.log('✅ Connected to Web3:', this.account);
            return this.account;
        } catch (error) {
            console.error('❌ Failed to connect to Web3:', error);
            throw error;
        }
    }

    /**
     * Setup smart contract
     */
    async setupContract() {
        try {
            // Initialize Web3
            const Web3 = window.Web3;
            const web3 = new Web3(this.provider);
            
            // Get signer
            this.signer = web3.eth.accounts.privateKeyToAccount(this.account);
            
            // Initialize contract
            this.contract = new web3.eth.Contract(this.contractABI, this.contractAddress);
            
            console.log('✅ Smart contract initialized');
        } catch (error) {
            console.error('❌ Failed to setup contract:', error);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for account changes
        this.provider.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                this.disconnect();
            } else {
                this.account = accounts[0];
            }
        });

        // Listen for chain changes
        this.provider.on('chainChanged', (chainId) => {
            this.chainId = chainId;
            window.location.reload();
        });
    }

    /**
     * Disconnect from Web3
     */
    disconnect() {
        this.isConnected = false;
        this.account = null;
        this.contract = null;
        console.log('✅ Disconnected from Web3');
    }

    /**
     * Mint NFT Certificate
     */
    async mintCertificate(certificateData) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to Web3');
            }

            const {
                studentId,
                courseId,
                courseName,
                completionDate,
                grade,
                issuerName,
                metadataURI
            } = certificateData;

            // Prepare transaction data
            const transactionData = {
                from: this.account,
                to: this.contractAddress,
                data: this.contract.methods.mintCertificate(
                    studentId,
                    courseId,
                    courseName,
                    completionDate,
                    grade,
                    issuerName,
                    metadataURI
                ).encodeABI(),
                gas: '500000'
            };

            // Send transaction
            const txHash = await this.provider.request({
                method: 'eth_sendTransaction',
                params: [transactionData]
            });

            console.log('✅ Certificate minted:', txHash);
            return txHash;
        } catch (error) {
            console.error('❌ Failed to mint certificate:', error);
            throw error;
        }
    }

    /**
     * Verify Certificate
     */
    async verifyCertificate(certificateId) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to Web3');
            }

            // Call contract method to verify certificate
            const result = await this.contract.methods.verifyCertificate(certificateId).call();
            
            return {
                isValid: result.isValid,
                studentId: result.studentId,
                courseId: result.courseId,
                courseName: result.courseName,
                completionDate: result.completionDate,
                grade: result.grade,
                issuerName: result.issuerName,
                mintDate: result.mintDate
            };
        } catch (error) {
            console.error('❌ Failed to verify certificate:', error);
            throw error;
        }
    }

    /**
     * Get user's certificates
     */
    async getUserCertificates(userId) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to Web3');
            }

            // Call contract method to get user certificates
            const certificates = await this.contract.methods.getUserCertificates(userId).call();
            
            return certificates.map(cert => ({
                id: cert.id,
                courseId: cert.courseId,
                courseName: cert.courseName,
                completionDate: cert.completionDate,
                grade: cert.grade,
                issuerName: cert.issuerName,
                mintDate: cert.mintDate,
                tokenURI: cert.tokenURI
            }));
        } catch (error) {
            console.error('❌ Failed to get user certificates:', error);
            throw error;
        }
    }

    /**
     * Transfer Certificate
     */
    async transferCertificate(certificateId, toAddress) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to Web3');
            }

            const transactionData = {
                from: this.account,
                to: this.contractAddress,
                data: this.contract.methods.transferFrom(
                    this.account,
                    toAddress,
                    certificateId
                ).encodeABI(),
                gas: '200000'
            };

            const txHash = await this.provider.request({
                method: 'eth_sendTransaction',
                params: [transactionData]
            });

            console.log('✅ Certificate transferred:', txHash);
            return txHash;
        } catch (error) {
            console.error('❌ Failed to transfer certificate:', error);
            throw error;
        }
    }

    /**
     * Get certificate metadata
     */
    async getCertificateMetadata(tokenURI) {
        try {
            const response = await fetch(tokenURI);
            const metadata = await response.json();
            return metadata;
        } catch (error) {
            console.error('❌ Failed to get certificate metadata:', error);
            throw error;
        }
    }

    /**
     * Create certificate metadata
     */
    async createCertificateMetadata(certificateData) {
        try {
            const metadata = {
                name: `${certificateData.courseName} Certificate`,
                description: `Certificate of completion for ${certificateData.courseName}`,
                image: certificateData.certificateImage || 'https://via.placeholder.com/400x300',
                attributes: [
                    {
                        trait_type: 'Course',
                        value: certificateData.courseName
                    },
                    {
                        trait_type: 'Grade',
                        value: certificateData.grade
                    },
                    {
                        trait_type: 'Completion Date',
                        value: certificateData.completionDate
                    },
                    {
                        trait_type: 'Issuer',
                        value: certificateData.issuerName
                    },
                    {
                        trait_type: 'Student ID',
                        value: certificateData.studentId
                    }
                ],
                external_url: `https://eduplatform.com/certificate/${certificateData.certificateId}`,
                background_color: 'ffffff',
                animation_url: certificateData.animationUrl || null
            };

            // Upload to IPFS or your preferred storage
            const metadataURI = await this.uploadToIPFS(metadata);
            return metadataURI;
        } catch (error) {
            console.error('❌ Failed to create certificate metadata:', error);
            throw error;
        }
    }

    /**
     * Upload to IPFS
     */
    async uploadToIPFS(data) {
        try {
            // This would typically use a service like Pinata or Infura
            // For demo purposes, we'll return a mock URI
            const mockURI = `https://ipfs.io/ipfs/${Math.random().toString(36).substr(2, 9)}`;
            console.log('✅ Metadata uploaded to IPFS:', mockURI);
            return mockURI;
        } catch (error) {
            console.error('❌ Failed to upload to IPFS:', error);
            throw error;
        }
    }

    /**
     * Generate certificate image
     */
    async generateCertificateImage(certificateData) {
        try {
            // Create canvas for certificate
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 800;
            canvas.height = 600;

            // Background
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Border
            ctx.strokeStyle = '#1173d4';
            ctx.lineWidth = 8;
            ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

            // Title
            ctx.fillStyle = '#1173d4';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 120);

            // Course name
            ctx.fillStyle = '#333';
            ctx.font = '32px Arial';
            ctx.fillText(certificateData.courseName, canvas.width / 2, 200);

            // Student name
            ctx.font = '24px Arial';
            ctx.fillText(`This is to certify that`, canvas.width / 2, 280);
            ctx.font = 'bold 28px Arial';
            ctx.fillText(certificateData.studentName, canvas.width / 2, 320);
            ctx.font = '24px Arial';
            ctx.fillText(`has successfully completed the course`, canvas.width / 2, 360);

            // Grade
            ctx.fillText(`with a grade of ${certificateData.grade}`, canvas.width / 2, 400);

            // Date
            ctx.fillText(`Completed on ${certificateData.completionDate}`, canvas.width / 2, 480);

            // Issuer
            ctx.fillText(`Issued by ${certificateData.issuerName}`, canvas.width / 2, 520);

            // Convert to data URL
            const dataURL = canvas.toDataURL('image/png');
            return dataURL;
        } catch (error) {
            console.error('❌ Failed to generate certificate image:', error);
            throw error;
        }
    }

    /**
     * Get contract ABI
     */
    getContractABI() {
        return [
            {
                "inputs": [
                    {"internalType": "string", "name": "studentId", "type": "string"},
                    {"internalType": "string", "name": "courseId", "type": "string"},
                    {"internalType": "string", "name": "courseName", "type": "string"},
                    {"internalType": "string", "name": "completionDate", "type": "string"},
                    {"internalType": "string", "name": "grade", "type": "string"},
                    {"internalType": "string", "name": "issuerName", "type": "string"},
                    {"internalType": "string", "name": "metadataURI", "type": "string"}
                ],
                "name": "mintCertificate",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "certificateId", "type": "uint256"}],
                "name": "verifyCertificate",
                "outputs": [
                    {"internalType": "bool", "name": "isValid", "type": "bool"},
                    {"internalType": "string", "name": "studentId", "type": "string"},
                    {"internalType": "string", "name": "courseId", "type": "string"},
                    {"internalType": "string", "name": "courseName", "type": "string"},
                    {"internalType": "string", "name": "completionDate", "type": "string"},
                    {"internalType": "string", "name": "grade", "type": "string"},
                    {"internalType": "string", "name": "issuerName", "type": "string"},
                    {"internalType": "uint256", "name": "mintDate", "type": "uint256"}
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
                "name": "getUserCertificates",
                "outputs": [
                    {
                        "components": [
                            {"internalType": "uint256", "name": "id", "type": "uint256"},
                            {"internalType": "string", "name": "courseId", "type": "string"},
                            {"internalType": "string", "name": "courseName", "type": "string"},
                            {"internalType": "string", "name": "completionDate", "type": "string"},
                            {"internalType": "string", "name": "grade", "type": "string"},
                            {"internalType": "string", "name": "issuerName", "type": "string"},
                            {"internalType": "uint256", "name": "mintDate", "type": "uint256"},
                            {"internalType": "string", "name": "tokenURI", "type": "string"}
                        ],
                        "internalType": "struct CertificateContract.Certificate",
                        "name": "",
                        "type": "tuple[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
    }

    /**
     * Get connection status
     */
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            account: this.account,
            chainId: this.chainId,
            contractAddress: this.contractAddress
        };
    }

    /**
     * Check if Web3 is available
     */
    isWeb3Available() {
        return typeof window.ethereum !== 'undefined';
    }

    /**
     * Get current network
     */
    getCurrentNetwork() {
        const networks = {
            '0x1': 'Ethereum Mainnet',
            '0x3': 'Ropsten Testnet',
            '0x4': 'Rinkeby Testnet',
            '0x5': 'Goerli Testnet',
            '0x2a': 'Kovan Testnet',
            '0x89': 'Polygon Mainnet',
            '0x13881': 'Polygon Mumbai Testnet'
        };
        
        return networks[this.chainId] || 'Unknown Network';
    }
}

// Export for use in other modules
window.BlockchainManager = BlockchainManager;

