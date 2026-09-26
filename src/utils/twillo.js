const twilio = require('twilio');

const client = twilio(process.env.ACCOUNT_SID, process.env.TWILLO_AUTH_TOKEN);

async function sendWhatsAppMessage(to, message) {
  try {
    const response = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: `whatsapp:${to}`,   
      body: message,
    });
    console.log('Message sent:', response.sid);
    return response;
  } catch (err) {
    console.error('WhatsApp send failed:', err.message);
    throw err;
  }
}

// usage
module.exports={sendWhatsAppMessage}