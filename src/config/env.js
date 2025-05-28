// Solana Configuration
const env = {
    // Secret key từ Phantom wallet (đã chuyển đổi thành mảng số)
    SECRET_KEY: [216, 99, 155, 179, 168, 116, 186, 81, 208, 170, 139, 71, 117, 8, 248, 102, 167, 41, 159, 65, 116, 179, 169, 165, 173, 88, 0, 189, 93, 28, 243, 177, 81, 221, 21, 124, 11, 104, 82, 55, 129, 164, 115, 167, 167, 28, 15, 242, 198, 69, 55, 61, 229, 164, 231, 143, 208, 141, 241, 37, 136, 66, 178, 135],
    
    // Program ID của smart contract
    PROGRAM_ID: '6WZYySoDCmuojNLvGEcwMqjHt6f9gEnN1yWpV3JbtK4S',
    
    // Các cấu hình khác nếu cần
    NETWORK: 'devnet',
    RPC_URL: 'https://api.devnet.solana.com',
    CENTER_WALLET_ADDRESS: "5Wez24X5gvioJSLmtkTNHtTcWEFpiY2iXCoGyteAgCGQ"
};

export default env; 