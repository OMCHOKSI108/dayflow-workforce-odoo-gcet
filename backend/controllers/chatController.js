const Groq = require('groq-sdk');

// Initialize Groq Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// RAG Context Helper
// It fetches relevant data from the DB to give the AI "context" about the user.
const getContext = async (userId) => {
    try {
        const User = require('../models/User');
        const Attendance = require('../models/Attendance');
        const Leave = require('../models/Leave');

        // 1. Get User Data
        const user = await User.findById(userId).select('-password');
        if (!user) return null;

        // 2. Get Employee Count (Company-specific)
        const totalEmployees = await User.countDocuments({ 
            role: 'Employee',
            companyName: user.companyName 
        });

        // 3. Get Attendance Status
        const today = new Date().toISOString().split('T')[0];
        const attendance = await Attendance.findOne({ user: userId, date: today });

        // 4. Get Recent Leave
        const lastLeave = await Leave.findOne({ user: userId }).sort({ createdAt: -1 });

        return {
            userProfile: user,
            companyStats: { totalEmployees },
            myAttendanceToday: attendance ? attendance.status : 'Not Checked In',
            myLastLeaveStr: lastLeave ? `${lastLeave.type} (${lastLeave.status})` : 'No recent leaves',
            currentTime: new Date().toLocaleString()
        };
    } catch (err) {
        console.error("Context Error", err);
        return null; // Fail gracefully
    }
};

const chatWithBot = async (req, res) => {
    const { message } = req.body;
    const userId = req.user._id;

    try {
        const context = await getContext(userId);
        if (!context) return res.json({ reply: "Error loading your profile data." });

        // If Groq API Key is present, try AI generation
        if (process.env.GROQ_API_KEY) {
            try {
                const systemPrompt = `
You are the "Dayflow Assistant", a helpful and friendly HR AI for the company "${context.userProfile.companyName || 'Dayflow'}".
Your goal is to assist the employee "${context.userProfile.name}" with their HR-related queries.

CURRENT USER CONTEXT:
- Name: ${context.userProfile.name}
- Role: ${context.userProfile.role}
- Department: ${context.userProfile.department || 'N/A'}
- Today's Attendance Status: ${context.myAttendanceToday}
- Last Leave Request: ${context.myLastLeaveStr}
- Current Time: ${context.currentTime}
- Total Employees in Company: ${context.companyStats.totalEmployees}

RULES:
1. Be concise, professional, but friendly.
2. If the user asks about their specific data (attendance, salary, leaves), use the CONTEXT provided above.
3. If the user asks about general HR topics, provide general advice suitable for a corporate environment.
4. If you don't know the answer, politely say you don't have that information.
5. Keep responses under 3-4 sentences unless a detailed explanation is needed.
6. THIS WEBSITE IS ABOUT HR MANAGEMENT SYSTEM SO ANSWERS MUST BE RELATED TO THAT.

USER QUERY: ${message}
`;

                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ],
                    model: 'llama-3.3-70b-versatile', // Updated to supported model
                    temperature: 0.7,
                    max_tokens: 250
                });

                const aiReply = completion.choices[0]?.message?.content;
                if (aiReply) {
                    return res.json({ reply: aiReply });
                }

            } catch (aiError) {
                console.error("Groq AI Error:", aiError);
                // Fallthrough to heuristics if AI fails
            }
        }

        // ---------------------------------------------------------
        // LOCAL HEURISTIC ENGINE (Fallback / No-Cost / No-Key)
        // ---------------------------------------------------------

        let reply = "";
        const lowerMsg = message.toLowerCase();

        // 1. Identity & Greeting
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
            reply = `Hello ${context.userProfile.name.split(' ')[0]}! 👋 How can I help you today? (Fallback Mode)`;
        }
        else if (lowerMsg.includes('who are you')) {
            reply = "I am Dayflow AI, your virtual HR assistant.";
        }
        else {
            reply = "I'm having trouble connecting to my brain (AI Service). Please check your connection or try again later.";
        }

        res.json({ reply });

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ message: 'AI Service Unavailable' });
    }
};

module.exports = { chatWithBot };
