import axios from 'axios'

import { EnvInjecter } from '../types/env-injecter'
const tokenName = 'MAILER_SEND_KEY'

class Email extends EnvInjecter {
  protected token?: string

  constructor() {
    super(tokenName)
  }

  private doRequest = async (method: 'POST', url: string, body?: any) => {
    if (!this.token) throw new Error('No MailerSend key provided')
    const res = await axios.post(url, JSON.stringify(body), {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    })
    return res.data
  }

  sendSignUpEmail = async (recipientEmail: string) => {
    const text = `
      Hi,\n
Thanks for signing up for the project. You will recieve more information about the project soon. 
      \n Best regards,\n Jesper Paulsen`

    const email = {
      from: {
        email: 'jesper@jesper.no',
        name: 'Jesper Paulsen'
      },
      to: [
        {
          email: recipientEmail
        }
      ],
      subject: 'Tanks for signing up to DataCollector',
      text
    }

    return this.doRequest('POST', 'https://api.mailersend.com/v1/email', email)
  }
}

export default new Email()
