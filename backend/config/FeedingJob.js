import cron from 'node-cron';
import Feeding from '../models/Feeding.js';
import Notification from '../models/Notification.js';
import sgMail from '@sendgrid/mail';


// Function to normalize the date to midnight
const normalizeDate = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0); // Set the hours to midnight in UTC 
  return normalizedDate;
};

cron.schedule('0 0 * * *', async () => {
  console.log('JOB - Feeding Job');

  try {

    // Get the start and end of today in UTC
    const todayStart = normalizeDate(new Date());
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCHours(23, 59, 59, 999);   // Set the hours to midnight in UTC 

    // Find all the feedings that need to be fed today
    const feedings = await Feeding.find({
      nextFeedingDate: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    }).populate({
      path: 'reptile',
      populate: {
        path: 'user',
        select: 'email name'
      }
    });

    // Group feedings by user
    const notificationsByUser = {};

    for (const feeding of feedings) {
      const reptile = feeding.reptile;
      const user = reptile ? reptile.user : null;

      if (!reptile || !user) {
        console.warn(`Missing reptile or user for feeding with ID ${feeding._id}`);
        continue;
      }

      const userId = user._id;

      if (!notificationsByUser[userId]) {
        notificationsByUser[userId] = {
          user,
          reptiles: [],
        };
      }
      notificationsByUser[userId].reptiles.push({
        name: reptile.name,
        reptileId: reptile._id,
      });
    }

    // Create a notification for each user and send summary emails
    for (const userId in notificationsByUser) {
      const { user, reptiles } = notificationsByUser[userId];

      const reptileList = reptiles.map((r) => r.name).join(', ');

      if (!user.email) {
        console.error(`Error: The user with ID ${user._id} does not have an email address.`);
        continue;
      }

      // Create the notification
      const notification = new Notification({
        user: user._id,
        reptile: reptiles.map((r) => r.reptileId),
        type: 'feeding',
        message: `I tuoi rettili ${reptileList} devono essere alimentati oggi.`,
        date: todayStart,
        status: 'pending',
      });

      await notification.save();

      // Send summary email to user

      try {
        // SENDGRID
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: user.email,
          from: "simonevairavs@gmail.com",
          subject: 'Notifica di alimentazione rettili',
          text: `Ciao,\n\nI tuoi rettili devono essere alimentati oggi.\n\nCordiali saluti,\nIl Team`,
          html: `<strong>Ciao ${user.name},\n\nI tuoi rettili ${reptileList} devono essere alimentati oggi.\n\nCordiali saluti,\nIl Team</strong>`,
        }

        sgMail
          .send(msg)
          .then(() => {
            console.log('Email sent')
          })
          .catch((error) => {
            console.error(error)
          })

      } catch (err) {
        console.error(`Error sending email to ${user.email}:`, err);
      }
    }

  } catch (err) {
    console.error('Error creating power notifications:', err);
  }
});
