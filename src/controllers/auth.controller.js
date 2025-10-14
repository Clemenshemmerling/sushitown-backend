import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/index.js';
import config from '../config/config.js';

export async function register(req, res) {
  try {
    const {name, email, password} = req.body;
    if (!name || !email || !password) return res.status(400).json({error: 'invalid'});
    const exists = await User.findOne({where: {email}});
    if (exists) return res.status(409).json({error: 'email_taken'});
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await User.create({name, email, passwordHash});
    const token = jwt.sign({id: u.id, role: u.role, name: u.name, email: u.email}, config.jwtSecret, {expiresIn: '7d'});
    res.json({token, user: {id: u.id, name: u.name, email: u.email, role: u.role}});
  } catch {
    res.status(500).json({error: 'server'});
  }
}

export async function login(req, res) {
  try {
    const {email, password} = req.body;
    const u = await User.findOne({where: {email}});
    if (!u) return res.status(401).json({error: 'invalid_credentials'});
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({error: 'invalid_credentials'});
    const token = jwt.sign({id: u.id, role: u.role, name: u.name, email: u.email}, config.jwtSecret, {expiresIn: '7d'});
    res.json({token, user: {id: u.id, name: u.name, email: u.email, role: u.role}});
  } catch {
    res.status(500).json({error: 'server'});
  }
}
