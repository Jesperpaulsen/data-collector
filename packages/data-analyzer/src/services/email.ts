import { EmailParams, MailerSend, Recipient } from 'mailersend'

class Email {
  client: MailerSend

  constructor() {
    this.client = new MailerSend({ api_key: process.env.MAILER_SEND_KEY })
  }

  sendSignUpEmail = async (receipentEmail: string) => {
    const text =
      'Thanks for signing up for the project. You will recieve information about the project when there are enough people that have signed up. \n Best regards, Jesper Paulsen'
    const email = new EmailParams({
      from: 'jespergp@stud.ntnu.no',
      fromName: 'Jesper Paulsen',
      receipents: [new Recipient(receipentEmail, '')],
      subject: 'DataCollector: Thanks for signing up to make the web cleaner',
      text
    })
    return this.client.send(email)
  }
}

export default new Email()
