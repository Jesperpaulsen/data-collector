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

  sendFirstRoundEmail = async (emailAdress: string) => {
    const text = `
    Hi,
    \nThanks again for contributing to this research project. 
    \nWe are now ready to start the first round. To install the plugin, use your computer and go to: https://chrome.google.com/webstore/detail/data-collector/iaaegfjhmidolfpcmheigebmpkmlpoki
    \nIn this round, you can't see where you pollute. In a week, the plugin will automatically update to give you feedback on your usage. You will be able to interactively explore a map of the world to see your pollution in detail. 
    The plugin will also provide you with tips on how to reduce your pollution. You can't see your pollution in this round because we want to see if your habits change when you get feedback on your usage.
    \nA video of how to install the plugin can be found here: https://storage.googleapis.com/data-collector-ff33b.appspot.com/informationVideos/InformationVideo.mp4?GoogleAccessId=firebase-adminsdk-himec%40data-collector-ff33b.iam.gserviceaccount.com&Expires=16447014000&Signature=O5aiWOo7ga%2FyLSCVqXadqb%2BmkQxxCW1SinY7dfHoLOl3t85oWFHxvqQNcb8U76q2NC9IDN8%2BNKWR4gDmqg335OZx4%2Bhz0ijO2nK7LaJ%2BWDVzJDLyy6z8lDQqV0goKo0lr0u6613yAdbgVLt9Sii0mBdulw5gEWYjH4ejS1Ch1Tj5bjKUIAl%2F73gKMobgaqQBF%2FRzQ0EhyLNl268uM1LaDW%2Bb72I3BrzxebE1VNWHjq8l3GJixt9q7oeKFyQhuTIbesopGymIRK7%2FPWAdpxwZDr%2F54B4tR25DQLcbF6N9dVA%2BMXi6URQ7aqPbbiqdj0iio89RbXRssyZ6xwq1XlOqgA%3D%3D
    \nAs always, if you have any problems with the plugin, send me an email at jespergp@stud.ntnu.no.

    \nSome of you haven't taken the first survey yet, so if you want to contribute, please go to: https://nettskjema.no/a/233362. The survey should take 5-10 minutes. Its goal is to understand your internet habits and interest in the environment.
    
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
      subject:
        "Master's thesis - Your Internet Habits and Carbon Footprint: Install the plugin",
      text
    }
    return this.doRequest(email)
  }

  sendNotificationEmail = async (emailAdress: string) => {
    const text = `
    Hi,
    \nWe are now ready to start the next round. Today, the plugin is ready to update. It will give you feedback on your usage, as well as display tips. You will also be able to explore your usage and pollution.
    \nTo update the plugin, you have two choices. You only need to do either a) or b): 
    \na) Visit this link: https://chrome.google.com/webstore/detail/data-collector/iaaegfjhmidolfpcmheigebmpkmlpoki. NB: If you have added any Blacklisted domains, make sure to add them back after installing the plugin. Select "Remove from Chrome", and then click "Add to Chrome". The installation guide is found here: https://storage.googleapis.com/data-collector-ff33b.appspot.com/informationVideos/InformationVideo.mp4?GoogleAccessId=firebase-adminsdk-himec%40data-collector-ff33b.iam.gserviceaccount.com&Expires=16447014000&Signature=O5aiWOo7ga%2FyLSCVqXadqb%2BmkQxxCW1SinY7dfHoLOl3t85oWFHxvqQNcb8U76q2NC9IDN8%2BNKWR4gDmqg335OZx4%2Bhz0ijO2nK7LaJ%2BWDVzJDLyy6z8lDQqV0goKo0lr0u6613yAdbgVLt9Sii0mBdulw5gEWYjH4ejS1Ch1Tj5bjKUIAl%2F73gKMobgaqQBF%2FRzQ0EhyLNl268uM1LaDW%2Bb72I3BrzxebE1VNWHjq8l3GJixt9q7oeKFyQhuTIbesopGymIRK7%2FPWAdpxwZDr%2F54B4tR25DQLcbF6N9dVA%2BMXi6URQ7aqPbbiqdj0iio89RbXRssyZ6xwq1XlOqgA%3D%3D
    \nb) Completely close Chrome. When you restart Chrome, the plugin will be updated. Because the plugin requires access to send you notifications, you will have to manually allow this. This is shown in the video: https://storage.googleapis.com/data-collector-ff33b.appspot.com/informationVideos/InformationVideo2.mp4?GoogleAccessId=firebase-adminsdk-himec%40data-collector-ff33b.iam.gserviceaccount.com&Expires=16447014000&Signature=lLeq73gGLY5BdRwhhQdsTeiMGmOzRc7IF%2BqzPa0%2F0N2BkIcIa0tnkMJw7bWvUbLY95zpk32g%2Btfo5eLcXYfrWSyIq4pD%2FaPR0gVd3kt%2F%2FIpMAad3SE3uy1WF7wSZ1%2BzYLtUo3KWDDL6SPW38E%2FGXyC%2Bvw016zkPulkLNsFrSo4DY6DDIsZWVmFQkZ6yIRuXT%2Fid%2FlZJLNfKNWsgLBsnRwZYN3%2F%2FI5d%2FEFOWNUxSiyR6e3sLq2ycFmKaOAgRKJVd2jNHQDnSMKqqJZL5zsD%2F5LJNM7dAVeO0uYIGhpxPOJ8gvY1Pgsy84k4GaGv4NQxCPHDb3I1c3XcVRxB7LxL5Oxg%3D%3D 
    \nAs always, if you have any problems with the plugin, send me an email at jespergp@stud.ntnu.no.

    \nThank you for contributing.
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
      subject:
        "Master's thesis - Your Internet Habits and Carbon Footprint: The plugin update",
      text
    }
    return this.doRequest(email)
  }

  sendLateSignUpEmail = async (emailAdress: string) => {
    const text = `
      Hi,
      \nThanks for contributing to this research project. 
      \nThe project started some weeks ago, but I'm still glad you want to participate. To participate, first take this short survey: https://nettskjema.no/a/233362. The survey should take 5-10 minutes, and the goal of it is to understand your internet habits and interest in the environment.
      \nAfter you have submitted the survey, you are ready to install the plugin. To install the plugin, use your computer and go to: https://chrome.google.com/webstore/detail/data-collector/iaaegfjhmidolfpcmheigebmpkmlpoki
      \nA video of how to install the plugin can be found here: https://storage.googleapis.com/data-collector-ff33b.appspot.com/informationVideos/InformationVideo.mp4?GoogleAccessId=firebase-adminsdk-himec%40data-collector-ff33b.iam.gserviceaccount.com&Expires=16447014000&Signature=O5aiWOo7ga%2FyLSCVqXadqb%2BmkQxxCW1SinY7dfHoLOl3t85oWFHxvqQNcb8U76q2NC9IDN8%2BNKWR4gDmqg335OZx4%2Bhz0ijO2nK7LaJ%2BWDVzJDLyy6z8lDQqV0goKo0lr0u6613yAdbgVLt9Sii0mBdulw5gEWYjH4ejS1Ch1Tj5bjKUIAl%2F73gKMobgaqQBF%2FRzQ0EhyLNl268uM1LaDW%2Bb72I3BrzxebE1VNWHjq8l3GJixt9q7oeKFyQhuTIbesopGymIRK7%2FPWAdpxwZDr%2F54B4tR25DQLcbF6N9dVA%2BMXi6URQ7aqPbbiqdj0iio89RbXRssyZ6xwq1XlOqgA%3D%3D
      \nAs always, if you have any problems with the plugin, send me an email at jespergp@stud.ntnu.no.
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

  sendFinalSurveyEmail = async (emailAdress: string) => {
    const text = `
      Hi,
      \nThanks a lot for contributing to this project. 
      \nWe are now ready for the last part of the project, a short survey. Please visit https://nettskjema.no/a/237515.
      \nThe survey should take 5-10 minutes, and the goal of it is to understand if you have become more aware of how the Internet pollutes.
      \n\nTomorrow, the plugin will be disabled. You will still be able to explore your data usage at https://dashboard.jesper.no/. 
      \nFor the next two months, I will be analyzing all the results, as well as writing my master's thesis.
      \nHopefully, this plugin has helped you better understand your digital carbon footprint.
      \nThank you so much for participating. I hope to be able to develop an even better solution for this in the future.
      \nAs always, if you have any problems with the survey, send me an email at jespergp@stud.ntnu.no.
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
      subject: `Master's thesis - Your Internet Habits and Carbon Footprint: The final survey`,
      text
    }

    return this.doRequest(email)
  }
}

export default new Email()
