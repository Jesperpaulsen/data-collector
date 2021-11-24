const CO2Pr10SecondOfUsage = 0.206
const KWHPer10SecondOfUsage = 0.0000093

export const convertActiveSecondsToPollution = (activeSeconds: number) => {
  const secondsIn10s = activeSeconds / 10
  return {
    CO2: secondsIn10s * CO2Pr10SecondOfUsage,
    kWh: secondsIn10s * KWHPer10SecondOfUsage
  }
}
