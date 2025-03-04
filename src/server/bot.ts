import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.VITE_BOT_TOKEN || 'new token';
const webAppUrl = process.env.VITE_WEBAPP_URL || 'address';

// Rest of the bot.ts file remains the same...
