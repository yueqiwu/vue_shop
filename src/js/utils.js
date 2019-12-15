// 判断值是否与数组内的重复
export function isRepeat(val, arr) {
  return arr.some(item => {
    return item === val
  })
}
