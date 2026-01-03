import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Attendance = () => {
    const { user, fetchAttendanceStatus } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ present: 0, leaves: 0, total: 0 });
    const [status, setStatus] = useState('');
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchAttendance = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/api/attendance/my`, config);
            setData(data);

            // Calculate mock stats based on data
            const present = data.filter(d => d.status === 'Present').length;
            setStats({
                present,
                leaves: 0, // Need to fetch leaves for real accuracy
                total: 22 // Mock standard working days
            });

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [user]);

    const handleCheckIn = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/attendance/checkin`, {}, config);
            fetchAttendance();
            fetchAttendanceStatus();
            setStatus('Checked In Successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus(error.response?.data?.message || 'Error checking in');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const handleCheckOut = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/attendance/checkout`, {}, config);
            fetchAttendance();
            fetchAttendanceStatus();
            setStatus('Checked Out Successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus(error.response?.data?.message || 'Error checking out');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    // Calculate Work Hours
    const calculateHours = (inTime, outTime) => {
        if (!inTime || !outTime) return '-';
        const start = new Date(inTime);
        const end = new Date(outTime);
        const diff = (end - start) / (1000 * 60 * 60); // hours
        return diff.toFixed(2) + ' hrs';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }} className="mobile-flex-col">
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', margin: 0 }}>Attendance</h1>
                    <p style={{ color: '#374151', marginTop: '0.2rem', fontWeight: '500' }}>Track your daily work hours.</p>
                </div>

                {/* Stats Widget */}
                <div style={{ display: 'flex', borderRadius: '2px', overflow: 'hidden', border: '1px solid #1f2937', background: 'white', flexWrap: 'wrap' }}>
                    <div style={{ padding: '0.8rem 1.5rem', borderRight: '1px solid #e5e7eb' }} className="mobile-p-sm">
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '700' }}>Days Present</span>
                        <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#059669' }}>{stats.present}</div>
                    </div>
                    <div style={{ padding: '0.8rem 1.5rem', borderRight: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '700' }}>Leaves</span>
                        <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#dc2626' }}>{stats.leaves}</div>
                    </div>
                    <div style={{ padding: '0.8rem 1.5rem' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '700' }}>Working Days</span>
                        <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#714B67' }}>{stats.total}</div>
                    </div>
                </div>
            </div>

            {/* Check In / Check Out Area */}
            <div className="card mobile-p-md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '1.5rem', background: '#ffffff', borderRadius: '2px', border: '1px solid #1f2937', boxShadow: 'none', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }} className="mobile-gap-sm">
                    <div style={{ padding: '12px', background: '#f3f4f6', borderRadius: '2px', color: '#111827', border: '1px solid #e5e7eb' }}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: '500' }}>Today's Activity</div>
                    </div>
                    {status && (
                        <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="badge badge-info"
                            style={{ marginLeft: '1rem', padding: '0.5rem 1rem', borderRadius: '2px', background: '#e0f2f1', color: '#00695c', border: '1px solid #b2dfdb' }}
                        >
                            {status}
                        </motion.span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="mobile-w-full mobile-gap-sm">
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        onClick={handleCheckIn}
                        className="btn mobile-w-full"
                        style={{ minWidth: '140px', padding: '0.8rem 1.5rem', fontSize: '1rem', background: '#059669', color: 'white', borderRadius: '2px', border: '1px solid #047857', fontWeight: '700', textTransform: 'uppercase' }}
                    >
                        Check In
                    </motion.button>
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        onClick={handleCheckOut}
                        className="btn mobile-w-full"
                        style={{ minWidth: '140px', padding: '0.8rem 1.5rem', fontSize: '1rem', background: '#ffffff', color: '#dc2626', borderRadius: '2px', border: '1px solid #dc2626', fontWeight: '700', textTransform: 'uppercase' }}
                    >
                        Check Out
                    </motion.button>
                </div>
            </div>

            {/* List View Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e5e7eb', borderRadius: '2px', boxShadow: 'none' }}>
                {/* Controls Bar */}
                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #e5e7eb', background: '#f8f9fa' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', borderRadius: '2px' }}><ChevronLeft size={16} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', borderRadius: '2px' }}><ChevronRight size={16} /></button>
                    </div>
                    <span style={{ fontWeight: '700', color: '#111827', textTransform: 'uppercase', fontSize: '0.9rem' }}>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>

                    <div style={{ flex: 1 }}></div>

                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{ padding: '0.5rem 0.5rem 0.5rem 2.2rem', border: '1px solid #d1d5db', borderRadius: '2px', outline: 'none', fontSize: '0.9rem', width: '200px', background: 'white' }}
                        />
                    </div>
                </div>

                <div className="table-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '600px' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '0.8rem' }}>Date</th>
                            <th style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '0.8rem' }}>Check In</th>
                            <th style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '0.8rem' }}>Check Out</th>
                            <th style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '0.8rem' }}>Work Hours</th>
                            <th style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '0.8rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={item._id}
                                style={{ borderBottom: '1px solid #f3f4f6', background: 'white' }}
                            >
                                <td style={{ padding: '1rem 1.2rem', color: '#111827', fontWeight: '500' }}>{new Date(item.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem 1.2rem', color: '#4b5563' }}>{item.checkIn ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                <td style={{ padding: '1rem 1.2rem', color: '#4b5563' }}>{item.checkOut ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#714B67' }}>{calculateHours(item.checkIn, item.checkOut)}</td>
                                <td style={{ padding: '1rem 1.2rem' }}>
                                    <span className={`badge ${item.status === 'Present' ? 'badge-success' : 'badge-warning'}`} style={{ borderRadius: '2px' }}>{item.status}</span>
                                </td>
                            </motion.tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>No attendance records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>                </div>            </div>
        </motion.div>
    );
};

export default Attendance;
