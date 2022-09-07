// 获取文件类型
export function getFileType(url: string): Array<string> {
  const type = url.substring(url.lastIndexOf('.') + 1)
  const imgType = ['gif', 'jpg', 'jpeg', 'png', 'svg', 'apng', 'webp']
  if (imgType.indexOf(type) !== -1) {
    // 图片
    return ['image', type]
  } else {
    // 其他文件
    return ['other', type]
  }
}
// 获取会话列表提示消息
export function getPointMsg(msgType: number = 1, message: string): string {
  if (msgType === 1) {
    return message
  }
  if (msgType === 3) {
    return getFileType(message)[0] === 'image' ? '图片...' : '文件...'
  }
  if (msgType === 5) {
    return '语音...'
  }
  return ''
}