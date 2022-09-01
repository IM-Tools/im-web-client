export function getStorage(key: string, type: string = 'string') {
  const str = sessionStorage.getItem(key)
  if (type === 'string') {
    return str
  } else {
    return str ? JSON.parse(str) : str
  }
}

export function setStorage(key: string, value: string | Object) {
  if (typeof value === 'string') {
    sessionStorage.setItem(key, value)
  } else {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
}

export function removeStorage(key: string) {
  sessionStorage.removeItem(key)
}
