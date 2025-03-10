// Object and plant information database
const objectInfo = {
    // Animals
    'cat': {
        vi: 'mèo',
        uses: 'Thú cưng, bạn đồng hành',
        description: 'Động vật có vú thuộc họ mèo, thường được nuôi làm thú cưng.'
    },
    'dog': {
        vi: 'chó',
        uses: 'Thú cưng, bảo vệ, động vật hỗ trợ',
        description: 'Động vật có vú thuộc họ chó, được biết đến là bạn thân thiết nhất của con người.'
    },
    
    // Plants
    'flower': {
        vi: 'hoa',
        uses: 'Trang trí, làm đẹp, ý nghĩa tâm linh',
        description: 'Bộ phận sinh sản của thực vật có hoa.'
    },
    'tree': {
        vi: 'cây',
        uses: 'Cung cấp oxy, che bóng mát, làm đẹp cảnh quan',
        description: 'Thực vật có thân gỗ, rễ và lá.'
    },
    
    // Common objects
    'chair': {
        vi: 'ghế',
        uses: 'Dùng để ngồi',
        description: 'Đồ nội thất dùng để ngồi, thường có tựa lưng.'
    },
    'table': {
        vi: 'bàn',
        uses: 'Đặt đồ vật, làm việc, ăn uống',
        description: 'Đồ nội thất có mặt phẳng ngang được nâng đỡ bởi chân.'
    },
    'bottle': {
        vi: 'chai',
        uses: 'Đựng chất lỏng',
        description: 'Vật dụng dùng để chứa chất lỏng, thường làm từ nhựa hoặc thủy tinh.'
    },
    'cup': {
        vi: 'cốc',
        uses: 'Đựng đồ uống',
        description: 'Vật dụng nhỏ dùng để uống nước hoặc đồ uống khác.'
    }
};

// Get information about an object
function getObjectInfo(prediction) {
    // Convert prediction to lowercase and remove any extra spaces
    const searchTerm = prediction.toLowerCase().trim();
    
    // Search for exact matches first
    if (objectInfo[searchTerm]) {
        return objectInfo[searchTerm];
    }
    
    // Search for partial matches
    for (const [key, info] of Object.entries(objectInfo)) {
        if (searchTerm.includes(key) || key.includes(searchTerm)) {
            return info;
        }
    }
    
    // Return default info if no match found
    return {
        vi: 'Không có thông tin',
        uses: 'Chưa có thông tin về công dụng',
        description: 'Chưa có thông tin chi tiết về đối tượng này.'
    };
}

// Format confidence score
function formatConfidence(confidence) {
    return (confidence * 100).toFixed(1) + '%';
}
