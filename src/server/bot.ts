import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.VITE_BOT_TOKEN || '7534362836:AAHYMsQuiVUhMMfxm2luE7yPpvzXR8nLl1w';
const webAppUrl = process.env.VITE_WEBAPP_URL || 'https://classy-sable-b73afb.netlify.app';

// Rest of the bot.ts file remains the same...