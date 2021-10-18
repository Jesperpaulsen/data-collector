import { FunctionalComponent } from 'preact'
import { useMemo, useState } from 'preact/hooks'

interface Props {
  name?: string
}

enum GREETINGS {
  GOOD_MORNING = 'Good morning',
  GOOD_DAY = 'Good day',
  GOOD_AFTERNOON = 'Good afternoon',
  GOOD_EVENING = 'Good evening',
  GOOD_NIGHT = 'Good night'
}

const getGreeting = (hours: number) => {
  if (hours > 18) return GREETINGS.GOOD_EVENING
  else if (hours > 14) return GREETINGS.GOOD_AFTERNOON
  else if (hours > 10) return GREETINGS.GOOD_DAY
  else if (hours > 5) return GREETINGS.GOOD_MORNING
  return GREETINGS.GOOD_NIGHT
}

const Greeting: FunctionalComponent<Props> = ({ name }) => {
  const greeting = useMemo(() => {
    const hours = new Date().getHours()
    return getGreeting(hours)
  }, [])

  return (
    <div className="text-2xl pt-2 pl-2 pb-2">
      <div>
        {greeting}, {name}!
      </div>
      <div>We're currently collecting your data.</div>
    </div>
  )
}

export default Greeting
