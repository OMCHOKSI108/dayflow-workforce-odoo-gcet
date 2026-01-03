import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, X, Check, XCircle, FileText, Calendar, Filter } from 'lucide-react';
import Navbar from '../components/Sidebar'; // Assuming Sidebar is the navbar based on previous steps
import { API_URL } from '../config/api';

const Leaves = () => {
    const { user } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLeave, setNewLeave] = useState({ type: 'Paid', startDate: '', endDate: '', reason: '' });
    const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar'
    const [filterStatus, setFilterStatus] = useState('All');

    // Stats
    const totalPaid = 24;
    const totalSick = 7;
    // Calculate used based on Approved leaves
    const usedPaid = leaves.filter(l => l.type === 'Paid' && l.status === 'Approved').reduce((acc, curr) => {
        const start = new Date(curr.startDate);
        const end = new Date(curr.endDate);
        const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
        return acc + diff;
    }, 0);
    const usedSick = leaves.filter(l => l.type === 'Sick' && l.status === 'Approved').reduce((acc, curr) => {
        const start = new Date(curr.startDate);
        const end = new Date(curr.endDate);
        const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
        return acc + diff;
    }, 0);

    const fetchLeaves = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const endpoint = user.role === 'Admin'
                ? 'http://localhost:5000/api/leaves'
                : 'http://localhost:5000/api/leaves/my';

            const { data } = await axios.get(endpoint, config);
            setLeaves(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [user, filterStatus]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Start Date < End Date
        if (new Date(newLeave.startDate) > new Date(newLeave.endDate)) {
            alert('End Date cannot be before Start Date');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/leaves`, newLeave, config);
            setIsModalOpen(false);
            setNewLeave({ type: 'Paid', startDate: '', endDate: '', reason: '' });
            fetchLeaves();
            alert('Leave Request Submitted!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit leave');
        }
    };

    const handleAction = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/leaves/${id}`, { status }, config);
            fetchLeaves();
        } catch (error) {
            alert('Action failed');
        }
    };

    const calculateDays = (start, end) => {
        if (!start || !end) return 0;
        const s = new Date(start);
        const e = new Date(end);
        if (e < s) return 0;
        const diffTime = Math.abs(e - s);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    // Filter Logic
    const filteredLeaves = filterStatus === 'All' ? leaves : leaves.filter(l => l.status === filterStatus);

    return (
        <div>
            {/* Header Area matching Sketch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                    Time Off
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem', background: '#f8f9fa', padding: '4px', borderRadius: '4px', border: '1px solid #e9ecef' }}>
                    <button
                        className={`btn`}
                        onClick={() => setFilterStatus('All')}
                        style={{
                            background: filterStatus === 'All' ? '#ffffff' : 'transparent',
                            color: filterStatus === 'All' ? '#1f2937' : '#6b7280',
                            border: 'none',
                            borderRadius: '2px',
                            fontWeight: '600',
                            boxShadow: filterStatus === 'All' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            padding: '0.5rem 1rem',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        all
                    </button>
                    <button
                        className={`btn`}
                        onClick={() => setFilterStatus('Pending')}
                        style={{
                            background: filterStatus === 'Pending' ? '#ffffff' : 'transparent',
                            color: filterStatus === 'Pending' ? '#1f2937' : '#6b7280',
                            border: 'none',
                            borderRadius: '2px',
                            fontWeight: '600',
                            boxShadow: filterStatus === 'Pending' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            padding: '0.5rem 1rem',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        to approve
                    </button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <motion.div
                    whileHover={{ y: -5 }}
                    className="card glass-panel"
                    style={{ borderRadius: '2px', border: '1px solid #1f2937' }}
                >
                    <div style={{ color: '#017e84', fontWeight: '600', marginBottom: '0.5rem' }}>Paid Time Off</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalPaid - usedPaid} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#666' }}>Days Available</span></div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Allowance: {totalPaid} Days</div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="card glass-panel"
                    style={{ borderRadius: '2px', border: '1px solid #1f2937' }}
                >
                    <div style={{ color: '#d63384', fontWeight: '600', marginBottom: '0.5rem' }}>Sick Time Off</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalSick - usedSick} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#666' }}>Days Available</span></div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Allowance: {totalSick} Days</div>
                </motion.div>
            </div>

            {/* Action Bar */}
            <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'white', borderRadius: '2px', border: '1px solid #e5e7eb' }}>
                <button
                    className="btn btn-primary"
                    style={{ background: '#714B67', borderColor: '#714B67' }} // Use primary brand color
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} /> NEW
                </button>
                <div style={{ position: 'relative', width: '300px' }}>
                    <input className="form-input" placeholder="Search..." style={{ background: '#f8f9fa', borderColor: '#e9ecef', borderRadius: '2px' }} />
                </div>
            </div>

            {/* Leaves Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '2px', border: '1px solid #e5e7eb' }}>
                <div className="table-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#495057', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Employee</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#495057', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Time Off Type</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#495057', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Period</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#495057', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Duration</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#495057', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                            {user.role === 'Admin' && <th style={{ padding: '1rem', textAlign: 'right', color: '#495057', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeaves.length > 0 ? filteredLeaves.map((leave, idx) => (
                            <motion.tr
                                key={leave._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{ borderBottom: '1px solid #f1f3f5' }}
                            >
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{leave.user?.name || 'Unknown'}</td>
                                <td style={{ padding: '1rem', color: leave.type === 'Paid' ? '#017e84' : '#d63384', fontWeight: '500' }}>{leave.type}</td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {calculateDays(leave.startDate, leave.endDate)} Days
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`badge ${leave.status === 'Approved' ? 'badge-success' :
                                        leave.status === 'Rejected' ? 'badge-error' : 'badge-warning'
                                        }`}>
                                        {leave.status}
                                    </span>
                                </td>
                                {user.role === 'Admin' && (
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        {leave.status === 'Pending' && (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleAction(leave._id, 'Approved')}
                                                    style={{ background: '#059669', color: 'white', border: 'none', borderRadius: '2px', padding: '4px 8px', cursor: 'pointer' }}
                                                    title="Approve"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(leave._id, 'Rejected')}
                                                    style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: '2px', padding: '4px 8px', cursor: 'pointer' }}
                                                    title="Reject"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                )}
                            </motion.tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#adb5bd' }}>No leave requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>                </div>            </div>

            {/* New Leave Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.5)', zIndex: 1100,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(3px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card"
                            style={{ width: '100%', maxWidth: '500px', padding: 0, overflow: 'hidden' }}
                        >
                            <div style={{ padding: '1rem 1.5rem', background: '#f8f9fa', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Time Off Request</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ color: '#017e84' }}>Time Off Type</label>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        {['Paid', 'Sick', 'Unpaid'].map(type => (
                                            <div
                                                key={type}
                                                onClick={() => setNewLeave({ ...newLeave, type })}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '2px', // Sharper
                                                    border: newLeave.type === type ? '1px solid #017e84' : '1px solid #d1d5db',
                                                    background: newLeave.type === type ? '#e0f2f1' : 'white',
                                                    color: newLeave.type === type ? '#017e84' : '#374151', // Darker text
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">From</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            required
                                            value={newLeave.startDate}
                                            onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">To</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            required
                                            value={newLeave.endDate}
                                            onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginTop: '1rem' }}>
                                    <label className="form-label">Duration</label>
                                    <div style={{ background: '#f3f4f6', padding: '0.6rem 1rem', borderRadius: '2px', fontWeight: 'bold', color: '#111827' }}>
                                        {calculateDays(newLeave.startDate, newLeave.endDate).toFixed(2)} Days
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginTop: '1rem' }}>
                                    <label className="form-label">Description / Reason</label>
                                    <textarea
                                        className="form-input"
                                        rows="3"
                                        value={newLeave.reason}
                                        onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })}
                                        placeholder="Add a note..."
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, borderRadius: '2px' }}>Discard</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '2px' }}>Submit Request</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Leaves;
