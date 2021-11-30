export const calculateDiff = (newNumber: number, originalNumber: number) => {
  if (newNumber === 0 || originalNumber === 0) return { diff: 0, higher: true }
  if (newNumber > originalNumber) {
    const increase = newNumber - originalNumber
    return { diff: (increase / originalNumber) * 100, higher: true }
  } else {
    const decrease = originalNumber - newNumber
    return { diff: (decrease / originalNumber) * 100, higher: false }
  }
}
