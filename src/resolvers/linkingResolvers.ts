export const linkingResolvers = {
  User: {
    bookings: {
      fragment: `fragment UserFragment on User { id }`,
      resolve: event => {
        const { id } = event.parent
        return event.delegate('query', 'allBookings', { bookeeId: id })
      }
    },
    paymentAccounts: {
      fragment: `fragment UserFragment on User { id }`,
      resolve: event => {
        const { id } = event.parent
        return event.delegate('query', 'allPaymentAccounts', { userId: id })
      }
    }
  },
  Place: {
    bookings: {
      fragment: `fragment PlaceFragment on Place { id }`,
      resolve: event => {
        const { id } = event.parent
        return event.delegate('query', 'allBookings', { placeId: id })
      }
    }
  },
  Booking: {
    bookee: {
      fragment: `fragment BookingFragment on Booking { bookeeId }`,
      resolve: event => {
        const { bookeeId } = event.parent
        return event.delegate('query', 'allUsers', { id: bookeeId })
      }
    },
    place: {
      fragment: `fragment BookingFragment on Booking { placeId }`,
      resolve: event => {
        const { placeId } = event.parent
        return event.delegate('query', 'allPlaces', { id: placeId })
      }
    }
  },
  PaymentAccount: {
    user: {
      fragment: `fragment PaymentAccountFragment on PaymentAccount { userId }`,
      resolve: event => {
        const { userId } = event.parent
        return event.delegate('query', 'allUsers', { id: userId })
      }
    }
  }
}
