const User = require("../models/User")

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ username, password });
        await user.save();

        res.json({
            message: "User created",
            userId: user._id
        });

    } catch (err) {
        res.status(500).json({ message: "Signup error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            userId: user._id
        });

    } catch (err) {
        res.status(500).json({ message: "Login error" });
    }
};

