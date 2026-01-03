import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);

        // Add axios interceptor to handle 401 errors
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid, logout user
                    localStorage.removeItem('userInfo');
                    setUser(null);
                    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        window.location.href = '/login';
    };

    const [attendanceStatus, setAttendanceStatus] = useState('Checked Out');

    const fetchAttendanceStatus = async () => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Use API to check open session specifically or parse from list
            // Ideally we create a specific status endpoint, but list works for now
            const { data } = await axios.get(`${API_URL}/api/attendance/my`, config);

            // Check if there is ANY open session (checkOut is null)
            const openSession = data.find(d => !d.checkOut);

            if (openSession) {
                setAttendanceStatus('Checked In');
            } else {
                setAttendanceStatus('Checked Out');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAttendanceStatus();
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, attendanceStatus, fetchAttendanceStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
