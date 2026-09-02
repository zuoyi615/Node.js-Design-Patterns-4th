export const logger = {
  info(message: string) {
    console.log(`[INFO ]\t${message}`)
  },

  warn(message: string) {
    console.log(`[WARN ]\t${message}`)
  },

  error(message: string) {
    console.log(`[ERROR]\t${message}`)
  },

  debug(message: string) {
    console.log(`[DEBUG]\t${message}`)
  }
}
