import nodemailer from 'nodemailer';
import fs from 'fs';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "s*********.com",
    pass: "****************",
  },
});


const jsonContent = fs.readFileSync('data1.json', 'utf-8');
const jsonData = JSON.parse(jsonContent);

function updateYearInDate(dateString, newYear) {
  const dateArray = dateString.split(' ');
  dateArray[2] = newYear.toString();
  return dateArray.join(' ');
}

// Funkcia na aktualizáciu dátumu a odoslanie e-mailu
function getUserAndSendEmail(jsonObject) {
  // Aktualizácia dátumu
  const updatedDate = updateYearInDate(jsonObject['Dátum'], 2024);
  jsonObject['Dátum'] = updatedDate;

  const today = new Date();
  const keyDate = new Date(jsonObject['Dátum']);
  const daysRemaining = Math.ceil((keyDate - today) / (1000 * 60 * 60 * 24));

  if (daysRemaining === 10) {
    const user = {
      name: jsonObject["Zákazník"],
      email: jsonObject['Zákazník: Email'],
      spz: jsonObject["ŠPZ"],
    };
    sendEmail(user.name, user.email, user.spz);
  }
}

// Iterácia cez JSON dáta
jsonData.forEach((jsonObject) => {
  // Zavolanie funkcie pre aktualizáciu dátumu a odoslanie e-mailu
  getUserAndSendEmail(jsonObject);
});


// Function to send an email
async function sendEmail(customerName, customerEmail, customerSPZ) {
  try {
    const emailContent = `
      Vážený/á pán/i ${customerName},

      Týmto Vás chceme informovať, že platnosť technickej a emisnej kontroly Vášho vozidla ${customerSPZ} vyprší o 10 dní. Aby ste si zachovali bezproblémovú platnosť a dodržali predpisy, odporúčame Vám zabezpečiť novú technickú a emisnú kontrolu čo najskôr.

      Pre objednanie termínu kontroly a ďalšie informácie, navštívte prosím našu webovú stránku: https://www.stklevice.sk/index.html.

      Ďakujeme za Vašu spoluprácu a ochranu životného prostredia.

      S pozdravom,

      [Druhá Levická Kontrolná spol. s.r.o.]
      [EMAIL / ČISLO NA PRÍJEM]
    `;

    const info = await transporter.sendMail({
      from: '"STK Levice" <stkleviceg@gmail.com>',
      to: customerEmail,
      subject: 'Mail #4',
      text: emailContent,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}



