const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');
const http = require('http');
const fs = require('fs');

// Cấu hình dotenv
dotenv.config();

// --- Import Routes ---

const authRoutes = require('./routes/autRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRouter');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const locationRoutes = require('./routes/locationRoutes');
const tourRoutes = require('./routes/tourRoutes');
const tourDepartureRoutes = require('./routes/tourDepartureRoutes');
const locationCommentRoutes = require('./routes/locationCommentRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const tourPriceRoutes = require('./routes/tourPriceRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const { checkConnection } = require('./config/db');

// --- Khởi tạo Express App và HTTP Server ---
const app = express();
const server = http.createServer(app);

// --- Cấu hình CORS tập trung ---
// Định nghĩa các origin được phép để sử dụng chung cho cả Express và Socket.IO
const allowedOrigins = [
    "http://localhost:3000",      // Web React
    "http://10.0.2.2:3000",      // Web trên Android emulator (nếu dùng)
];

const corsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"], // Thêm các method khác nếu cần
    credentials: true
};

// --- Middlewares ---
app.use(cors(corsOptions)); // Áp dụng cấu hình CORS cho Express
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}));


// --- Serve Static Files (như hình ảnh uploads) ---
// Tạo thư mục uploads nếu chưa tồn tại
const uploadDirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/users'),
    path.join(__dirname, 'uploads/tours'),
    path.join(__dirname, 'uploads/locations'),
    path.join(__dirname, 'uploads/review_images')
];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
    }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Cấu hình Routes ---
app.get('/', (req, res) => {
    res.send('Welcome to the Travel API!');
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/tour-prices', tourPriceRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/tour-departures', tourDepartureRoutes);
app.use('/api/location-comments', locationCommentRoutes);
app.use('/api/hotels', hotelRoutes);



// --- Khởi động Server ---
const PORT = process.env.PORT || 5000;
// Kiểm tra kết nối DB trước khi khởi động server
checkConnection().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🔌 Socket.IO is listening on port ${PORT}`);
    });
});
