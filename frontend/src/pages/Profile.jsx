import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { API_URL } from "../config/api";
import {
    User,
    Shield,
    Briefcase,
    DollarSign,
    Upload
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState("private");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id && user.role !== "Admin") {
            navigate("/dashboard");
            return;
        }
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const endpoint =
                id && user.role === "Admin"
                    ? `${API_URL}/api/users/${id}`
                    : `${API_URL}/api/users/profile`;

            const { data } = await axios.get(endpoint, config);
            setProfile(data);
            setFormData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const endpoint =
                id && user.role === "Admin"
                    ? `${API_URL}/api/users/${id}`
                    : `${API_URL}/api/users/profile`;

            await axios.put(endpoint, formData, config);
            setIsEditing(false);
            fetchProfile();
            alert("Profile updated successfully");
        } catch {
            alert("Update failed");
        }
    };

    if (!profile) {
        return <div style={{ padding: "2rem" }}>Loading profile…</div>;
    }

    const tabs = [
        { id: "resume", label: "Resume", icon: Briefcase },
        { id: "private", label: "Private Info", icon: User },
        { id: "salary", label: "Salary Info", icon: DollarSign, adminOnly: true },
        { id: "security", label: "Security", icon: Shield, adminOnly: true }
    ];

    return (
        <div>
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", alignItems: "center" }} className="mobile-flex-col">
                <h2>{id ? "Employee Profile" : "My Profile"}</h2>

                {!isEditing ? (
                    <button className="btn btn-primary mobile-w-full" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                ) : (
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }} className="mobile-w-full mobile-gap-sm">
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData(profile);
                            }}
                        >
                            Discard
                        </button>
                        <button className="btn btn-primary" onClick={handleUpdate}>
                            Save
                        </button>
                    </div>
                )}
            </div>

            {/* PROFILE CARD */}
            <div className="card" style={{ marginTop: "1.5rem", display: "flex", gap: "2rem" }}>
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            background: "#e9ecef",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                            overflow: "hidden",
                            border: '2px solid #e5e7eb',
                            position: 'relative'
                        }}
                    >
                        {profile.image ? (
                            <img src={profile.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontWeight: '600', color: '#6b7280' }}>
                                {profile.name?.charAt(0)}
                            </span>
                        )}

                        {/* Edit Overlay */}
                        {isEditing && (
                            <label
                                htmlFor="profile-upload"
                                style={{
                                    position: 'absolute',
                                    bottom: 0, left: 0, right: 0, top: 0,
                                    background: 'rgba(0,0,0,0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '0.8rem', cursor: 'pointer',
                                    opacity: 0, transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = 1}
                                onMouseLeave={(e) => e.target.style.opacity = 0}
                            >
                                Change
                            </label>
                        )}
                    </div>
                    {isEditing && (
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setProfile(prev => ({ ...prev, image: reader.result }));
                                        setFormData(prev => ({ ...prev, image: reader.result }));
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    )}
                </div>

                <div>
                    <h3>{profile.name}</h3>
                    <p>{profile.designation || "No designation"}</p>
                    <p>Email: {profile.email}</p>
                    <p>Department: {profile.department || "-"}</p>
                    <p>Employee ID: {profile.empCode || "-"}</p>
                </div>
            </div>

            {/* TABS */}
            <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
                {tabs.map(tab => {
                    if (tab.adminOnly && user.role !== "Admin") return null;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                borderBottom: activeTab === tab.id ? "2px solid blue" : "none",
                                background: "transparent"
                            }}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* CONTENT */}
            <div className="card" style={{ marginTop: "2rem" }}>
                {/* PRIVATE INFO */}
                {activeTab === "private" && (
                    <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Left Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', color: '#714B67' }}>Personal Details</h4>

                            <div className="form-group">
                                <label className="form-label">Date of Birth</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    disabled={!isEditing}
                                    value={formData.dob ? formData.dob.split("T")[0] : ""}
                                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Nationality</label>
                                <input
                                    className="form-input"
                                    disabled={!isEditing}
                                    value={formData.nationality || ""}
                                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                                    placeholder="e.g. Indian"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <select
                                    className="form-input"
                                    disabled={!isEditing}
                                    value={formData.gender || ""}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Marital Status</label>
                                <select
                                    className="form-input"
                                    disabled={!isEditing}
                                    value={formData.maritalStatus || ""}
                                    onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', color: '#714B67' }}>Contact Information</h4>

                            <div className="form-group">
                                <label className="form-label">Residing Address</label>
                                <textarea
                                    className="form-input"
                                    disabled={!isEditing}
                                    value={formData.residingAddress || ""}
                                    onChange={e => setFormData({ ...formData, residingAddress: e.target.value })}
                                    rows="3"
                                    placeholder="e.g. 93 Main St..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Personal Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    disabled={!isEditing}
                                    value={formData.personalEmail || ""}
                                    onChange={e => setFormData({ ...formData, personalEmail: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date of Joining</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    disabled={!isEditing}
                                    value={formData.dateOfJoining ? formData.dateOfJoining.split("T")[0] : ""}
                                    onChange={e => setFormData({ ...formData, dateOfJoining: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', color: '#714B67' }}>Bank Details (Confidential)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Account No</label>
                                    <input className="form-input" disabled={!isEditing} value={formData.bankDetails?.accountNumber || ''} onChange={e => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">PAN No</label>
                                    <input className="form-input" disabled={!isEditing} value={formData.bankDetails?.pan || ''} onChange={e => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, pan: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">UAN No</label>
                                    <input className="form-input" disabled={!isEditing} value={formData.bankDetails?.uan || ''} onChange={e => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, uan: e.target.value } })} />
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* SALARY */}
                {/* SALARY */}
                {activeTab === "salary" && profile.salary && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 1rem' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', color: '#714B67', marginBottom: '1.5rem' }}>Salary Info</h3>
                        <div style={{ background: '#fff3cd', color: '#856404', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #ffeeba' }}>
                            <strong>Note:</strong> Components are auto-calculated based on "Monthly Wage". Adjust the wage to update the structure.
                        </div>

                        {/* Top Summary Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 'bold' }}>Month Wage (Gross)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="number"
                                        className="form-input"
                                        disabled={!isEditing}
                                        value={formData.salary?.monthly || 0}
                                        onChange={e => {
                                            const newWage = Number(e.target.value);
                                            // Auto-Calculation Logic
                                            const basic = newWage * 0.50;
                                            const hra = basic * 0.50;
                                            const stdAlloc = 4167; // Fixed
                                            const perfBonus = basic * 0.0833;
                                            const lta = basic * 0.0833;
                                            const pf = basic * 0.12;
                                            const pt = 200;

                                            // Fixed Allowance = Remainder
                                            // Gross = Basic + HRA + Std + Perf + LTA + Fixed
                                            // Fixed = Gross - (Basic + HRA + Std + Perf + LTA)
                                            let fixedAlloc = newWage - (basic + hra + stdAlloc + perfBonus + lta);
                                            if (fixedAlloc < 0) fixedAlloc = 0;

                                            setFormData({
                                                ...formData,
                                                salary: {
                                                    ...formData.salary,
                                                    monthly: newWage,
                                                    yearly: newWage * 12,
                                                    breakdown: {
                                                        basic: Math.round(basic),
                                                        hra: Math.round(hra),
                                                        standardAllowance: stdAlloc,
                                                        performanceBonus: Math.round(perfBonus),
                                                        travelAllowance: Math.round(lta),
                                                        fixedAllowance: Math.round(fixedAlloc),
                                                        pf: Math.round(pf),
                                                        professionalTax: pt
                                                    }
                                                }
                                            });
                                        }}
                                        style={{ fontWeight: 'bold', fontSize: '1.1rem', borderColor: '#714B67' }}
                                    />
                                    <span style={{ color: '#666' }}>/ Month</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 'bold' }}>No of working days in a week</label>
                                <input
                                    className="form-input"
                                    disabled={!isEditing}
                                    value={formData.salary?.workingDays || 5}
                                    onChange={e => setFormData({ ...formData, salary: { ...formData.salary, workingDays: e.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 'bold' }}>Yearly Wage</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="number"
                                        className="form-input"
                                        disabled
                                        value={formData.salary?.yearly || 0}
                                        style={{ fontWeight: 'bold', fontSize: '1.1rem', background: '#f8f9fa' }}
                                    />
                                    <span style={{ color: '#666' }}>/ Yearly</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 'bold' }}>Break Time</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        className="form-input"
                                        disabled={!isEditing}
                                        value={formData.salary?.breakTime || '1 Hour'}
                                        onChange={e => setFormData({ ...formData, salary: { ...formData.salary, breakTime: e.target.value } })}
                                    />
                                    <span style={{ color: '#666' }}>/ day</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Columns */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                            {/* Left: Components */}
                            <div>
                                <h4 style={{ borderBottom: '2px solid #714B67', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#495057' }}>Salary Components</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {[
                                        { label: 'Basic Salary', key: 'basic', pct: '50% of Gross' },
                                        { label: 'House Rent Allowance', key: 'hra', pct: '50% of Basic' },
                                        { label: 'Standard Allowance', key: 'standardAllowance', pct: 'Fixed 4167' },
                                        { label: 'Performance Bonus', key: 'performanceBonus', pct: '8.33% of Basic' },
                                        { label: 'Leave Travel Allowance', key: 'travelAllowance', pct: '8.33% of Basic' },
                                        { label: 'Fixed Allowance', key: 'fixedAllowance', pct: 'Balancing Figure' }
                                    ].map(item => (
                                        <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f3f5', paddingBottom: '0.5rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '500', color: '#343a40' }}>{item.label}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{item.pct}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    disabled
                                                    value={formData.salary?.breakdown?.[item.key] || 0}
                                                    style={{ width: '100px', padding: '0.2rem', textAlign: 'right', border: 'none', background: 'transparent', fontWeight: 'bold', color: '#495057' }}
                                                />
                                                <span style={{ fontSize: '0.9rem', color: '#495057' }}>₹</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Contributions & Tax */}
                            <div>
                                <h4 style={{ borderBottom: '2px solid #714B67', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#495057' }}>Provident Fund (PF) Contribution</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                    {[
                                        { label: 'Employee', key: 'pf', pct: '12% of Basic' },
                                        { label: "Employer's", key: 'pf', pct: '12% of Basic' }
                                    ].map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f3f5', paddingBottom: '0.5rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '500', color: '#343a40' }}>{item.label}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{item.pct}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    disabled
                                                    value={formData.salary?.breakdown?.pf || 0}
                                                    style={{ width: '100px', padding: '0.2rem', textAlign: 'right', border: 'none', background: 'transparent', fontWeight: 'bold', color: '#d63384' }}
                                                />
                                                <span style={{ fontSize: '0.9rem', color: '#495057' }}>₹</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h4 style={{ borderBottom: '2px solid #714B67', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#495057' }}>Tax Deductions</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f3f5', paddingBottom: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500', color: '#343a40' }}>Professional Tax</div>
                                        <div style={{ fontSize: '0.8rem', color: '#868e96' }}>Fixed 200</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="number"
                                            disabled
                                            value={formData.salary?.breakdown?.professionalTax || 0}
                                            style={{ width: '100px', padding: '0.2rem', textAlign: 'right', border: 'none', background: 'transparent', fontWeight: 'bold', color: '#d63384' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: '#495057' }}>₹</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* RESUME */}
                {activeTab === "resume" && (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                        <Upload size={40} />
                        <p>No resume uploaded</p>
                        {isEditing && <button className="btn">Upload</button>}
                    </div>
                )}

                {/* SECURITY */}
                {activeTab === "security" && (
                    <div>
                        <p>Security settings managed by admin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
