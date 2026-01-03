import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, TrendingUp, Users, Calendar, Clock, Activity, Flame, Rocket, Plus, X, Trash2 } from 'lucide-react';
import { API_URL } from '../config/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        attendanceCount: 0,
        leaveBalance: 0,
        pendingTasks: 0,
        activity: []
    });
    const [announcements, setAnnouncements] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', type: 'info' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_URL}/api/users/dashboard/stats`, config);
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        
        const fetchAnnouncements = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_URL}/api/announcements`, config);
                setAnnouncements(data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };
        
        fetchStats();
        fetchAnnouncements();
    }, [user]);
    
    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/announcements`, newAnnouncement, config);
            setIsModalOpen(false);
            setNewAnnouncement({ title: '', message: '', type: 'info' });
            
            // Refresh announcements
            const { data } = await axios.get('http://localhost:5000/api/announcements', config);
            setAnnouncements(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create announcement');
        }
    };
    
    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_URL}/api/announcements/${id}`, config);
            setAnnouncements(announcements.filter(a => a._id !== id));
        } catch (error) {
            alert('Failed to delete announcement');
        }
    };
    
    const getAnnouncementStyle = (type) => {
        const styles = {
            info: { bg: '#eff6ff', border: '#bfdbfe', icon: Rocket, color: '#1e40af' },
            warning: { bg: '#fffbeb', border: '#fcd34d', icon: Flame, color: '#92400e' },
            success: { bg: '#f0fdf4', border: '#86efac', icon: Calendar, color: '#166534' },
            error: { bg: '#fef2f2', border: '#fca5a5', icon: Activity, color: '#991b1b' }
        };
        return styles[type] || styles.info;
    };

    // Odoo-style Card Component
    const DashboardCard = ({ title, value, subtext, icon: Icon, color }) => (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '2px', // Sharp corners
            border: '1px solid #1f2937', // Black/Dark Border
            boxShadow: 'none', // No soft shadows
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '0.9rem', color: '#1f2937', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{title}</h3>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', margin: 0 }}>{value}</h2>
                </div>
                <div style={{ padding: '0.5rem', background: `${color}20`, borderRadius: '4px' }}>
                    <Icon size={24} color={color} />
                </div>
            </div>
            {subtext && <p style={{ fontSize: '0.85rem', color: '#374151', margin: 0, fontWeight: '500' }}>{subtext}</p>}
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
                    Dashboard
                </h1>
                <p style={{ color: '#374151', fontSize: '0.95rem', fontWeight: '500' }}>
                    Welcome back, {user && user.name.split(' ')[0]}! Here's what's happening today.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }} className="mobile-grid-2">
                <DashboardCard
                    title="Attendance"
                    value={stats.attendanceCount}
                    subtext="Days present this month"
                    icon={Calendar}
                    color="#017e84"
                />
                <DashboardCard
                    title="Leave Balance"
                    value={stats.leaveBalance}
                    subtext="Available paid leaves"
                    icon={Clock}
                    color="#d63384"
                />
                <DashboardCard
                    title="Pending Tasks"
                    value={stats.pendingTasks}
                    subtext="Requires your attention"
                    icon={Activity}
                    color="#f59e0b"
                />
                <DashboardCard
                    title="Total Employees"
                    value={stats.totalEmployees || 0}
                    subtext="Active workforce"
                    icon={Users}
                    color="#10b981"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="mobile-grid-1">
                {/* Recent Activity */}
                <div style={{
                    background: 'white',
                    padding: '0',
                    borderRadius: '2px',
                    border: '1px solid #1f2937'
                }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', background: '#f8f9fa' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Recent Activity</h3>
                    </div>
                    <div style={{ padding: '0' }}>
                        {stats.activity && stats.activity.length > 0 ? (
                            stats.activity.map((item, index) => (
                                <div key={index} style={{
                                    padding: '1rem 1.5rem',
                                    borderBottom: index < stats.activity.length - 1 ? '1px solid #f3f4f6' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: item.type === 'attendance' ? '#017e84' : '#d63384'
                                    }}></div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.9rem' }}>{item.title}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#4b5563' }}>
                                            {new Date(item.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`badge ${item.status === 'Present' || item.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No recent activity</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Announcements */}
                <div style={{
                    background: 'white',
                    padding: '0',
                    borderRadius: '2px',
                    border: '1px solid #1f2937'
                }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', background: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Announcements</h3>
                        {(user.role === 'Admin' || user.role === 'HR') && (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="btn btn-primary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#714B67', borderColor: '#714B67' }}
                            >
                                <Plus size={14} /> Add
                            </button>
                        )}
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                        {announcements.length > 0 ? announcements.map((announcement) => {
                            const style = getAnnouncementStyle(announcement.type);
                            const Icon = style.icon;
                            return (
                                <div key={announcement._id} style={{ background: style.bg, border: `1px solid ${style.border}`, padding: '1rem', borderRadius: '2px', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Icon size={16} color={style.color} />
                                            <h4 style={{ margin: 0, color: style.color, fontSize: '0.95rem' }}>{announcement.title}</h4>
                                        </div>
                                        {(user.role === 'Admin' || user.role === 'HR') && (
                                            <button 
                                                onClick={() => handleDeleteAnnouncement(announcement._id)}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                                            >
                                                <Trash2 size={14} color={style.color} />
                                            </button>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: style.color }}>{announcement.message}</p>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                <p>No announcements yet.</p>
                                {(user.role === 'Admin' || user.role === 'HR') && (
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="btn btn-secondary"
                                        style={{ marginTop: '1rem' }}
                                    >
                                        Create First Announcement
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Announcement Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(2px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="card"
                            style={{ width: '100%', maxWidth: '500px', margin: '2rem', padding: '0', overflow: 'hidden', borderRadius: '2px' }}
                        >
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#111827' }}>New Announcement</h2>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateAnnouncement} style={{ padding: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input 
                                        required 
                                        className="form-input" 
                                        value={newAnnouncement.title} 
                                        onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} 
                                        placeholder="e.g. New Policy Update" 
                                        style={{ borderRadius: '2px' }} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea 
                                        required 
                                        className="form-input" 
                                        value={newAnnouncement.message} 
                                        onChange={e => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })} 
                                        placeholder="Announcement details..." 
                                        rows="4"
                                        style={{ borderRadius: '2px' }} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select 
                                        className="form-input" 
                                        value={newAnnouncement.type} 
                                        onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                        style={{ borderRadius: '2px' }}
                                    >
                                        <option value="info">Info (Blue)</option>
                                        <option value="warning">Warning (Yellow)</option>
                                        <option value="success">Success (Green)</option>
                                        <option value="error">Important (Red)</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, borderRadius: '2px' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '2px', background: '#714B67', borderColor: '#714B67' }}>Create</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
