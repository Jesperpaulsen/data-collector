export const calculateDiff = (x: number, y: number) => {
  if (x === 0 || y === 0) return { diff: 0, higher: true }
  if (x > y) {
    return { diff: ((x - y) / (y || 1)) * 100, higher: true }
  }
  if (y > x) {
    return { diff: ((x - y) / (x || 1)) * 100, higher: false }
  }
}
