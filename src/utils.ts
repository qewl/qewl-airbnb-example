export const checkAuthentication = (event, next) => {
  if (!event.context.user) {
    throw new Error('Not authorized')
  }
  return next()
}
