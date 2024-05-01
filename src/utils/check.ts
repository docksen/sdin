export const EMAIL_REG = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/

export function isEmail(it: string) {
  return EMAIL_REG.test(it)
}
