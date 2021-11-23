import axios from 'axios'

import { EnvInjecter } from '../types/env-injecter'
const tokenName = 'MAILER_SEND_KEY'

class Email extends EnvInjecter {
  protected token?: string

  constructor() {
    super(tokenName)
  }

  private doRequest = async (email?: any) => {
    const url = 'https://api.mailersend.com/v1/email'
    if (!this.token) throw new Error('No MailerSend key provided')
    const res = await axios.post(url, JSON.stringify(email), {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    })
    return res.data
  }

  sendSignUpEmail = async (emailAdress: string) => {
    const text = `
      Hi,
      \nThanks for signing up for the project. You will recieve more information about the project soon. 
      \nBest regards,\nJesper Paulsen`

    const email = {
      from: {
        email: 'jesper@jesper.no',
        name: 'Jesper Paulsen'
      },
      to: [
        {
          email: emailAdress
        }
      ],
      subject: 'Thanks for signing up to DataCollector',
      text
    }

    return this.doRequest(email)
  }

  sendFirstSurveyEmail = async (emailAdress: string) => {
    const text = `
      Hi,
      \nThanks for contributing to this research project. 
      \nHere is the link to the survey: https://nettskjema.no/a/233362. The survey should take 5-10 minutes, and the goal of it is to understand your internet habits and interest in the environment.
      \nIf you have problems with the survery send me an email at jespergp@stud.ntnu.no.
      \nSome days after you have completed the survey, you will recieve information on how to install the chrome plugin that will collect the size and location of your data. You will use Chrome as you normally would, and the plugin will report the amount and location of the data you are using.
      
      \nBest regards,\nJesper Paulsen`

    const email = {
      from: {
        email: 'jesper@jesper.no',
        name: 'Jesper Paulsen'
      },
      to: [
        {
          email: emailAdress
        }
      ],
      subject: "Master's thesis - Your Internet Habits and Carbon Footprint",
      text
    }
    return this.doRequest(email)
  }
}

export default new Email()
