import axios from 'axios';
import { getAuthToken } from '../utils/auth';

// Tạo một instance của axios với cấu hình mặc định
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Xuất Base URL cho hình ảnh (bỏ phần /api ở cuối)
export const imageBaseUrl = baseURL.replace('/api', '');

// Can thiệp (intercept) vào mỗi request trước khi nó được gửi đi
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            // Nếu có token, thêm nó vào header Authorization
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Xử lý lỗi nếu có
        return Promise.reject(error);
    }
);

export default api;