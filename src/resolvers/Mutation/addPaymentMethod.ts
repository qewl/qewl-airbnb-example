export const addPaymentMethod = {
  resolve: async event => {
    const { userId: id} = event.context.user

    await event.delegate('mutation', 'createPaymentAccount', { userId: id, creditcard: event.args })
    // TODO: send email to user
    return event.delegate('query', 'User', { id })
  }
}
