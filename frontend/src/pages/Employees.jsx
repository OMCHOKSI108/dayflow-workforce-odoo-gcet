import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Search, Plus, Filter, Mail, Phone, ChevronRight, Download, X, Plane, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';

const Employees = () => {
    const { user } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmp, setNewEmp] = useState({ name: '', email: '', department: '', designation: '', salary: '' });
    const navigate = useNavigate();

    // In a real app, this status would come from a backend Join operation
    // For now, we randomize it daily or checking if a field exists, or assume Present if not a leave
    // Let's create a simulated status function since we can't join massive data on frontend easily without backend change
    // Or we will just show 'Present' for the purpose of the UI demo if they have no leave.

    const fetchEmployees = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/api/users`, config);

            // Simulating Status for Visualization (Green Dot / Airplane / Yellow)
            // Real implementation would require aggregation in backend
            const enhancedData = data.map(u => ({
                ...u,
                status: Math.random() > 0.8 ? 'Leave' : (Math.random() > 0.3 ? 'Present' : 'Absent')
            }));

            setEmployees(enhancedData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [user]);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleExport = () => {
        const exportData = filteredEmployees.map(emp => ({
            Name: emp.name,
            Email: emp.email,
            Designation: emp.designation || 'N/A',
            Role: emp.role || 'N/A',
            Phone: emp.phone || 'N/A',
            Department: emp.department || 'N/A',
            "Join Date": emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : 'N/A'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, `Employees_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(`${API_URL}/api/users/create`, newEmp, config);

            alert(`Employee Created!\nTemp Password: ${res.data.tempPassword}\nPlease share this with the employee.`);
            setIsModalOpen(false);
            setNewEmp({ name: '', email: '', department: '', designation: '', salary: '' });
            fetchEmployees();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create employee');
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'Present') return <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 4px #22c55e' }} title="Present"></div>;
        if (status === 'Leave') return <Plane size={14} color="#3b82f6" title="On Leave" />;
        return <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} title="Absent"></div>;
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }} className="mobile-flex-col">
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', margin: 0 }}>Team Directory</h1>
                    <p style={{ color: '#374151', marginTop: '0.2rem', fontWeight: '500' }}>Manage your workforce efficiently.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="mobile-w-full mobile-gap-sm">
                    <button className="btn btn-secondary" onClick={handleExport} style={{ border: '1px solid #d1d5db', borderRadius: '2px', color: '#374151', fontWeight: '600' }}>
                        <Download size={16} /> Export to Excel
                    </button>
                    {user.role === 'Admin' && (
                        <button
                            className="btn btn-primary"
                            style={{ background: '#714B67', borderColor: '#714B67', borderRadius: '2px', fontWeight: '700' }}
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus size={16} /> Add Member
                        </button>
                    )}
                </div>
            </div>

            {/* Search/Filter Bar */}
            <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', background: 'white', border: '1px solid #1f2937', borderRadius: '2px', boxShadow: 'none' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        className="form-input"
                        style={{ paddingLeft: '3rem', borderRadius: '2px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ height: '30px', width: '1px', background: '#e5e7eb' }}></div>
                <button className="btn btn-secondary" style={{ borderRadius: '2px', padding: '0.6rem 1.2rem', fontWeight: '600' }}>
                    <Filter size={16} /> Filter View
                </button>
            </div>

            {/* Employee Grid */}
            <div className="grid-view" style={{ gap: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {filteredEmployees.map((emp, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        key={emp._id}
                        style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderBottom: '2px solid #1f2937', // Odoo-like bottom border accent
                            borderRadius: '2px',
                            padding: '0',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.2s ease-in-out'
                        }}
                        whileHover={{ translateY: -3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        onClick={() => navigate(`/employees/${emp._id}`)}
                    >
                        <div style={{ padding: '1.25rem', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {/* Simulating the image card style from the Odoo event screenshot */}
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '2px',
                                    backgroundColor: '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.75rem',
                                    color: '#374151',
                                    fontWeight: '700',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    {emp.image ? (
                                        <img src={emp.image} alt={emp.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
                                    ) : (
                                        emp.name?.charAt(0) || 'U'
                                    )}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.1rem', color: '#111827' }}>{emp.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '600', textTransform: 'uppercase' }}>{emp.designation || 'Staff'} - {emp.department || 'General'}</p>
                                    <span className={`badge ${emp.role === 'Admin' ? 'badge-info' : 'badge-success'}`} style={{ borderRadius: '2px', fontSize: '0.7rem', fontWeight: '700', marginTop: '0.25rem', display: 'inline-block' }}>
                                        {emp.role || 'Employee'}
                                    </span>
                                </div>
                            </div>

                            {/* Status Indicator */}
                            {getStatusIcon(emp.status)}
                        </div>

                        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', marginTop: 'auto' }}>
                            <div style={{ marginTop: '0.75rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#374151' }}>
                                    <Mail size={14} color="#6b7280" />
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.email}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#374151' }}>
                                    <Phone size={14} color="#6b7280" />
                                    <span>{emp.phone || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredEmployees.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280', fontSize: '1.1rem' }}>
                    <p>No team members found matching your search.</p>
                </div>
            )}

            {/* Create Employee Modal */}
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
                            style={{ width: '100%', maxWidth: '500px', margin: '2rem', padding: '0', overflow: 'hidden', borderRadius: '2px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#111827' }}>Add New Member</h2>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateEmployee} style={{ padding: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input required className="form-input" value={newEmp.name} onChange={e => setNewEmp({ ...newEmp, name: e.target.value })} placeholder="e.g. Om Doe" style={{ borderRadius: '2px' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input required type="email" className="form-input" value={newEmp.email} onChange={e => setNewEmp({ ...newEmp, email: e.target.value })} placeholder="Om@example.com" style={{ borderRadius: '2px' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Department</label>
                                        <select className="form-input" value={newEmp.department} onChange={e => setNewEmp({ ...newEmp, department: e.target.value })} style={{ borderRadius: '2px' }}>
                                            <option value="">Select...</option>
                                            <option value="IT">IT</option>
                                            <option value="HR">HR</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Marketing">Marketing</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Designation</label>
                                        <input required className="form-input" value={newEmp.designation} onChange={e => setNewEmp({ ...newEmp, designation: e.target.value })} placeholder="e.g. Developer" style={{ borderRadius: '2px' }} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Monthly Salary (₹)</label>
                                    <input required type="number" className="form-input" value={newEmp.salary} onChange={e => setNewEmp({ ...newEmp, salary: e.target.value })} placeholder="50000" style={{ borderRadius: '2px' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, borderRadius: '2px' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '2px', background: '#714B67', borderColor: '#714B67' }}>Create Account</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Employees;
