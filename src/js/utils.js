// 判断值是否与数组内的重复
export function isRepeat(val, arr) {
  return arr.some(item => {
    return item === val
  })
}

// 格式化时间
export function dateFormat(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

// 深度克隆
export function deepClone(obj) {
  if (obj.constructor === Array || obj.constructor === Object) {
    var buff = obj.constructor === Array ? [] : {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        buff[key] = deepClone(obj[key])
      }
    }
    return buff
  } else {
    return obj
  }
}
