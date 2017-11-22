export const Viewer = {
  Query: {
    viewer: () => ({})
  },
  Viewer: {
    bookings: {
      resolve: event => {
        const { userId: id } = event.context.user
        return event.delegate('query', 'allBookings', { filter: { bookeeId: id } })
      }
    },
    me: {
      resolve: event => {
        const { userId: id } = event.context.user
        return event.delegate('query', 'User', { id })
      }
    }
  }
}
