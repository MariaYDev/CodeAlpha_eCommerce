const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required.' });
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'A valid email is required.' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const db = readDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'An account with that email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    db.carts[user.id] = [];
    writeDB(db);

    const token = signToken(user);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while registering.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = signToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while logging in.' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: sanitizeUser(user) });
});

module.exports = router;
