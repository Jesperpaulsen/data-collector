export const calculateDiff = (x: number, y: number) => {
  if (x === 0 || y === 0) return 0
  if (x > y) {
    return ((x - y) / (y || 1)) * 100
  } else if (y > x) {
    return ((x - y) / (x || 1)) * 100
  }
  return 0
}
