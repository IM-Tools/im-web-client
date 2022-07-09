export function checkEmail(str: String): Boolean {
  const string = str.replace(/\s|&nbsp;/g, '') //先去除用户输入的无效字符
  const reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
  if (reg.test(string)) {
    return true;
  } else {
    return false;
  }
}