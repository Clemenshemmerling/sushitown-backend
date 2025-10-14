'use strict'
import dotenv from 'dotenv'
dotenv.config()

const config = {
  port: Number(process.env.PORT || 4000),
  db: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET
}

export default config;
