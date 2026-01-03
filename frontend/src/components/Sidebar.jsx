import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Calendar, DollarSign, LogOut, Briefcase, Users, PieChart, ChevronDown, CheckCircle, CheckSquare } from 'lucide-react';
import { useContext, useState, useEffect, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { user, logout, attendanceStatus, fetchAttendanceStatus } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

    const links = [
        { path: '/dashboard', label: 'Overview', icon: PieChart },
        { path: '/employees', label: 'Employees', icon: Users, adminOnly: true },
        { path: '/attendance', label: 'Attendance', icon: Calendar },
        { path: '/leaves', label: 'Time Off', icon: Briefcase },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/profile', label: 'Me', icon: User },
    ];

    // No local effect needed, handled by Context now

    const handleCheckIn = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/attendance/checkin', {}, config);
            fetchAttendanceStatus();
            setIsAttendanceOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error checking in');
        }
    };

    const handleCheckOut = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/attendance/checkout', {}, config);
            fetchAttendanceStatus();
            setIsAttendanceOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error checking out');
        }
    };

    return (
        <div className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: '1rem' }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'white', borderRadius: '6px', padding: '4px', display: 'flex', alignItems: 'center' }}>
                    <img src="/logo.png" alt="Dayflow" style={{ height: '24px', width: '24px', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.5px' }}>Dayflow</span>
            </div>

            {/* Navigation Links - Center */}
            <nav style={{ display: 'flex', gap: '0.5rem', flex: 1, justifyContent: 'center', paddingLeft: '2rem' }}>
                {links
                    .filter(link => !link.adminOnly || (user.role === 'Admin' || user.role === 'HR'))
                    .map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            backgroundColor: isActive(link.path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: isActive(link.path) ? '600' : '400',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <link.icon size={16} />
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Right Side Widgets (User & Attendance) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                {/* Attendance Status Widget */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsAttendanceOpen(!isAttendanceOpen)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' }}
                    >
                        <div style={{
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: attendanceStatus === 'Checked In' ? '#4ade80' : '#f87171',
                            boxShadow: attendanceStatus === 'Checked In' ? '0 0 8px #4ade80' : 'none'
                        }}></div>
                        <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: '500', display: window.innerWidth < 768 ? 'none' : 'inline' }}>
                            {attendanceStatus}
                        </span>
                    </button>

                    <AnimatePresence>
                        {isAttendanceOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                style={{
                                    position: 'absolute', top: '120%', right: 0, width: '200px',
                                    background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    padding: '1rem', zIndex: 1000
                                }}
                            >
                                {attendanceStatus === 'Checked In' ? (
                                    <>
                                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                                            Since {checkInTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <button onClick={handleCheckOut} className="btn badge-error" style={{ width: '100%', border: '1px solid #dc3545', background: 'white', color: '#dc3545' }}>
                                            Check Out -&gt;
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={handleCheckIn} className="btn btn-success" style={{ width: '100%' }}>
                                        Check In -&gt;
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Avatar Dropdown */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e9ecef', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.5)' }}>
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#bdbdbd', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                style={{
                                    position: 'absolute', top: '120%', right: 0, width: '180px',
                                    background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    overflow: 'hidden', zIndex: 1000
                                }}
                            >
                                <div style={{ padding: '0.5rem' }}>
                                    <button
                                        onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.8rem', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', color: '#1f2937', fontSize: '0.9rem' }}
                                    >
                                        <User size={16} /> My Profile
                                    </button>
                                    <div style={{ height: '1px', background: '#e5e7eb', margin: '0.25rem 0' }}></div>
                                    <button
                                        onClick={logout}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.8rem', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', color: '#dc2626', fontSize: '0.9rem' }}
                                    >
                                        <LogOut size={16} /> Log Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
