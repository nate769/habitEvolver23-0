const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

const serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/send-notification', async (req, res) => {
  const { token, title, body, timeDiff } = req.body;

  setTimeout(async () => {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    try {
      await admin.messaging().send(message);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, timeDiff);

  res.status(200).send('Notification scheduled');
});

app.listen(3000, () => console.log('Server running on port 3000'));