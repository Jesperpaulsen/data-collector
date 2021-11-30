import { FunctionalComponent } from 'preact'
import { useMemo, useState } from 'preact/hooks'

import { Tip } from '../../types/tip'

import Box from './Box'
import SkipButtons from './SkipButtons'

interface Props {
  tips: Tip[]
}

const TipsCarousel: FunctionalComponent<Props> = ({ tips }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentTip = useMemo(() => {
    if (!tips?.length) return null
    const tip = tips[currentIndex]
    if (!tip) {
      setCurrentIndex(0)
      return tips[0]
    }
    return tip
  }, [tips, currentIndex])

  const nextTip = () => {
    setCurrentIndex((currentIndex + 1) % tips.length)
  }
  const prevTip = () => {
    setCurrentIndex((currentIndex - 1 + tips.length) % tips.length)
  }

  return (
    <Box>
      <div className="px-4">
        <div className="flex flex-col items-center">
          <div className="text-lg">{currentTip?.title}</div>
          <div>{currentTip?.message}</div>
        </div>
        <div className="flex justify-end items-center">
          <div className="font-bold pr-2">
            {currentIndex + 1} / {tips.length}
          </div>
          <SkipButtons
            nextBtnClicked={nextTip}
            prevBtnClicked={prevTip}
            infinty
            currentIndex={currentIndex}
            maxIndex={100}
          />
        </div>
      </div>
    </Box>
  )
}

export default TipsCarousel
