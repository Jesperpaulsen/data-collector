import { CorsOptions } from 'cors'
import { NextFunction, Request, Response } from 'express'

const whiteList = [
  'https://climate.jesper.no',
  'https://klima.jesper.no',
  'http://localhost:3000',
  'chrome-extension://jkoeemadehedckholhdkcjnadckenjgd',
  'chrome-extension://iaaegfjhmidolfpcmheigebmpkmlpoki',
  'https://dashboard.jesper.no'
]

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
