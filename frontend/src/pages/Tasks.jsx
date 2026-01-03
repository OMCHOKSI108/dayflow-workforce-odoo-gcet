import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Calendar, User, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const Tasks = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, inprogress, completed
    const [expandedTask, setExpandedTask] = useState(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const endpoint = user.role === 'Employee' ? '/api/tasks/my' : '/api/tasks';
            const { data } = await axios.get(`${API_URL}${endpoint}`, config);
            setTasks(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/tasks/${taskId}`, { status: newStatus }, config);
            fetchTasks();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update task');
        }
    };

    const handleAddComment = async (taskId) => {
        if (!newComment.trim()) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/tasks/${taskId}/comment`, { text: newComment }, config);
            setNewComment('');
            fetchTasks();
        } catch (error) {
            alert('Failed to add comment');
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            Low: '#10b981',
            Medium: '#f59e0b',
            High: '#ef4444',
            Urgent: '#dc2626'
        };
        return colors[priority] || '#6b7280';
    };

    const getStatusIcon = (status) => {
        const icons = {
            Pending: <Clock size={20} />,
            'In Progress': <AlertCircle size={20} />,
            Completed: <CheckCircle size={20} />,
            Cancelled: <ChevronDown size={20} />
        };
        return icons[status] || <Clock size={20} />;
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: '#f59e0b',
            'In Progress': '#3b82f6',
            Completed: '#10b981',
            Cancelled: '#6b7280'
        };
        return colors[status] || '#6b7280';
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending') return task.status === 'Pending';
        if (filter === 'inprogress') return task.status === 'In Progress';
        if (filter === 'completed') return task.status === 'Completed';
        return true;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isOverdue = (dueDate, status) => {
        return status !== 'Completed' && new Date(dueDate) < new Date();
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading tasks...</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                    {user.role === 'Employee' ? 'My Tasks' : 'All Tasks'}
                </h1>
                <p style={{ color: '#6b7280' }}>
                    {user.role === 'Employee' 
                        ? 'View and manage tasks assigned to you'
                        : 'View all company tasks and assignments'}
                </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '2rem',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.5rem',
                flexWrap: 'wrap'
            }} className="mobile-gap-sm">
                {['all', 'pending', 'inprogress', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: filter === f ? '#111827' : 'transparent',
                            color: filter === f ? 'white' : '#6b7280',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: filter === f ? 'bold' : 'normal',
                            textTransform: 'uppercase',
                            fontSize: '0.875rem'
                        }}
                    >
                        {f === 'inprogress' ? 'In Progress' : f} ({
                            f === 'all' ? tasks.length :
                            f === 'pending' ? tasks.filter(t => t.status === 'Pending').length :
                            f === 'inprogress' ? tasks.filter(t => t.status === 'In Progress').length :
                            tasks.filter(t => t.status === 'Completed').length
                        })
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '2px dashed #d1d5db'
                }}>
                    <Clock size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: '#6b7280', fontSize: '1.25rem' }}>No tasks found</h3>
                    <p style={{ color: '#9ca3af' }}>
                        {filter === 'all' 
                            ? 'No tasks have been assigned yet'
                            : `No ${filter === 'inprogress' ? 'in progress' : filter} tasks`}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredTasks.map(task => (
                        <motion.div
                            key={task._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'white',
                                border: '1px solid #1f2937',
                                borderRadius: '2px',
                                padding: '1.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            {/* Task Header */}
                            <div 
                                onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ 
                                            fontSize: '1.25rem', 
                                            fontWeight: 'bold', 
                                            color: '#111827',
                                            margin: 0
                                        }}>
                                            {task.title}
                                        </h3>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: getPriorityColor(task.priority) + '20',
                                            color: getPriorityColor(task.priority),
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                        {task.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <User size={16} />
                                            <span>
                                                {user.role === 'Employee' 
                                                    ? `By: ${task.assignedBy?.name}`
                                                    : `To: ${task.assignedTo?.name}`}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={16} />
                                            <span style={{ 
                                                color: isOverdue(task.dueDate, task.status) ? '#ef4444' : '#6b7280',
                                                fontWeight: isOverdue(task.dueDate, task.status) ? 'bold' : 'normal'
                                            }}>
                                                Due: {formatDate(task.dueDate)}
                                                {isOverdue(task.dueDate, task.status) && ' (Overdue!)'}
                                            </span>
                                        </div>
                                        {task.comments?.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <MessageSquare size={16} />
                                                <span>{task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: getStatusColor(task.status) + '20',
                                        color: getStatusColor(task.status),
                                        borderRadius: '4px',
                                        fontWeight: 'bold'
                                    }}>
                                        {getStatusIcon(task.status)}
                                        {task.status}
                                    </div>
                                    {expandedTask === task._id ? <ChevronUp /> : <ChevronDown />}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedTask === task._id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}
                                >
                                    {/* Status Update (Employee Only) */}
                                    {user.role === 'Employee' && task.status !== 'Completed' && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                                Update Status:
                                            </label>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {['Pending', 'In Progress', 'Completed'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusUpdate(task._id, status)}
                                                        disabled={task.status === status}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            background: task.status === status ? '#111827' : 'white',
                                                            color: task.status === status ? 'white' : '#111827',
                                                            border: '1px solid #111827',
                                                            borderRadius: '4px',
                                                            cursor: task.status === status ? 'not-allowed' : 'pointer',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Comments Section */}
                                    <div>
                                        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Comments</h4>
                                        {task.comments?.length > 0 ? (
                                            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
                                                {task.comments.map((comment, idx) => (
                                                    <div 
                                                        key={idx}
                                                        style={{ 
                                                            padding: '0.75rem',
                                                            background: '#f9fafb',
                                                            borderRadius: '4px',
                                                            borderLeft: '3px solid #3b82f6'
                                                        }}
                                                    >
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between',
                                                            marginBottom: '0.25rem'
                                                        }}>
                                                            <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                                {comment.user?.name}
                                                            </span>
                                                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                                {formatDate(comment.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p style={{ margin: 0, color: '#374151' }}>{comment.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>No comments yet</p>
                                        )}

                                        {/* Add Comment */}
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment..."
                                                style={{
                                                    flex: 1,
                                                    padding: '0.75rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    fontSize: '0.875rem'
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') handleAddComment(task._id);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddComment(task._id)}
                                                style={{
                                                    padding: '0.75rem 1.5rem',
                                                    background: '#111827',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tasks;
