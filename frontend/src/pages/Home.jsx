import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Shield, Users, BarChart, Server, Zap, TrendingUp, Award, MessageSquare, CheckSquare, Sparkles, Globe, Lock, Briefcase, Calendar } from 'lucide-react';

const Home = () => {
    const stats = [
        { value: '10K+', label: 'Active Users' },
        { value: '500+', label: 'Companies' },
        { value: '99.9%', label: 'Uptime' },
        { value: '24/7', label: 'Support' }
    ];

    const features = [
        { icon: Clock, title: 'Smart Attendance', desc: 'Real-time check-in/out with GPS tracking & automated reports', color: '#8b5cf6' },
        { icon: Users, title: 'Employee Management', desc: 'Centralized profiles with complete lifecycle tracking', color: '#3b82f6' },
        { icon: Shield, title: 'Leave Management', desc: 'Automated workflows with smart balance calculations', color: '#10b981' },
        { icon: BarChart, title: 'Advanced Analytics', desc: 'Real-time insights & predictive workforce analytics', color: '#f59e0b' },
        { icon: CheckSquare, title: 'Task Management', desc: 'Assign, track, and collaborate on team tasks', color: '#ec4899' },
        { icon: MessageSquare, title: 'AI Assistant', desc: 'Smart chatbot powered by LLaMA 3.3 for instant HR support', color: '#06b6d4' },
        { icon: Briefcase, title: 'Payroll System', desc: 'Automated salary calculations with detailed breakdowns', color: '#f97316' },
        { icon: Globe, title: 'Multi-tenant', desc: 'Complete data isolation for unlimited organizations', color: '#6366f1' }
    ];

    const benefits = [
        { icon: Zap, title: 'Lightning Fast', desc: 'Built with React & MongoDB for blazing performance' },
        { icon: Lock, title: 'Enterprise Security', desc: 'JWT authentication with role-based access control' },
        { icon: TrendingUp, title: 'Scalable', desc: 'Grows with your business from 10 to 10,000+ employees' },
        { icon: Award, title: 'Open Source', desc: 'Fully transparent codebase on GitHub' }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'white' }}>
            {/* Navbar */}
            <nav style={{ 
                padding: '1.25rem 3rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.95)', 
                backdropFilter: 'blur(10px)',
                position: 'sticky', 
                top: 0, 
                zIndex: 100,
                borderBottom: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.png" alt="Dayflow Logo" style={{ height: '40px' }} />
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>Dayflow</h1>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/login" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none' }}>Sign In</Link>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '0.65rem 1.75rem', borderRadius: '8px', fontWeight: '600' }}>
                        Get Started Free <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{ 
                padding: '8rem 2rem 6rem', 
                textAlign: 'center', 
                background: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background decoration */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
                
                <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            padding: '0.6rem 1.2rem', 
                            background: '#f3e5f5',
                            borderRadius: '24px', 
                            fontWeight: '600', 
                            marginBottom: '2.5rem', 
                            fontSize: '0.9rem',
                            color: 'var(--primary-color)'
                        }}
                    >
                        <Sparkles size={16} /> Powered by AI • Open Source • Enterprise Ready
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            fontSize: '5rem', 
                            fontWeight: '900', 
                            lineHeight: '1.1', 
                            marginBottom: '2rem', 
                            color: '#111827', 
                            letterSpacing: '-0.03em' 
                        }}
                    >
                        Workforce Management <br />
                        <span style={{ color: 'var(--primary-color)' }}>
                            Reimagined.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ 
                            fontSize: '1.35rem', 
                            color: '#6b7280', 
                            marginBottom: '3rem', 
                            lineHeight: '1.7', 
                            maxWidth: '750px', 
                            margin: '0 auto 3.5rem auto',
                            fontWeight: '400'
                        }}
                    >
                        The modern, AI-powered HRMS platform that scales with your business. 
                        Manage teams, automate workflows, and unlock insights—all in one beautiful interface.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}
                    >
                        <Link to="/register" className="btn btn-primary" style={{ 
                            padding: '1rem 2.5rem', 
                            fontSize: '1.15rem',
                            borderRadius: '10px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            Start Free Trial <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn btn-secondary" style={{ 
                            padding: '1rem 2.5rem', 
                            fontSize: '1.15rem', 
                            background: 'white',
                            border: '2px solid #e5e7eb',
                            borderRadius: '10px',
                            color: '#374151',
                            fontWeight: '600'
                        }}>
                            Watch Demo
                        </Link>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ 
                            marginTop: '5rem', 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(4, 1fr)', 
                            gap: '3rem',
                            padding: '2.5rem 3rem',
                            background: 'white',
                            borderRadius: '16px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                        }}
                    >
                        {stats.map((stat, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                                    {stat.value}
                                </h3>
                                <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: '500' }}>{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </header>

            {/* Features Grid */}
            <section style={{ padding: '8rem 2rem', background: 'white' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                            Everything You Need, <span style={{ color: 'var(--primary-color)' }}>Built-In</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
                            Comprehensive HR tools designed for modern teams
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        {features.map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} delay={idx * 0.1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: '8rem 2rem', background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                            Why Teams Love Dayflow
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                            Built for performance, security, and scale
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem' }}>
                        {benefits.map((benefit, idx) => (
                            <BenefitCard key={idx} {...benefit} delay={idx * 0.15} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ 
                padding: '6rem 2rem', 
                background: 'var(--primary-color)',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        Ready to Transform Your HR?
                    </h2>
                    <p style={{ fontSize: '1.3rem', marginBottom: '3rem', opacity: 0.9 }}>
                        Join thousands of companies already using Dayflow to streamline their workforce management.
                    </p>
                    <Link to="/register" className="btn" style={{ 
                        background: 'white',
                        color: 'var(--primary-color)',
                        padding: '1.2rem 3rem',
                        fontSize: '1.2rem',
                        borderRadius: '12px',
                        fontWeight: '700',
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        Start Free Today <ArrowRight size={24} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ 
                padding: '4rem 2rem 2rem', 
                background: '#111827', 
                color: '#9ca3af' 
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem', marginBottom: '3rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <img src="/logo.png" alt="Dayflow" style={{ height: '36px' }} />
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>Dayflow</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                Modern HRMS platform for the next generation of businesses.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem' }}>Product</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Features</a>
                                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Pricing</a>
                                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Documentation</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem' }}>Company</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>About Us</a>
                                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Blog</a>
                                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem' }}>Legal</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>
                                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a>
                                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>License</a>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        <p>&copy; {new Date().getFullYear()} Dayflow HRMS. Open Source & Enterprise Ready.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};


const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        style={{ 
            background: 'white', 
            padding: '2.5rem', 
            borderRadius: '12px', 
            border: '1px solid #e5e7eb',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }}
    >
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '14px', 
                background: `${color}15`,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: `2px solid ${color}30`
            }}>
                <Icon size={32} color={color} />
            </div>
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111827' }}>{title}</h3>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6' }}>{desc}</p>
    </motion.div>
);

const BenefitCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        style={{ 
            display: 'flex', 
            gap: '1.5rem',
            padding: '2rem',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}
    >
        <div style={{ 
            minWidth: '60px', 
            height: '60px', 
            borderRadius: '12px', 
            background: 'var(--primary-color)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
        }}>
            <Icon size={28} color="white" />
        </div>
        <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>{title}</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{desc}</p>
        </div>
    </motion.div>
);

export default Home;
