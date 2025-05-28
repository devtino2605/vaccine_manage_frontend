// Solana Configuration
const env = {
    // Secret key từ Phantom wallet (đã chuyển đổi thành mảng số)
    SECRET_KEY: [
        // Thay thế bằng mảng số thực tế từ private key của bạn
        // Ví dụ: [123, 456, ...]
    ],
    
    // Program ID của smart contract
    PROGRAM_ID: 'F1vXYCyo7cCUkaqteQZy5b1N5Wvq6SvjoWr2HxAmekay',
    
    // Các cấu hình khác nếu cần
    NETWORK: 'devnet',
    RPC_URL: 'https://api.devnet.solana.com'
};

export default env; 