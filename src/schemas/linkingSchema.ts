export const linkingSchema = `
  extend type User {
    bookings: [Booking]
    paymentAccounts: [PaymentAccount]
  }

  extend type Place {
    bookings: [Booking]
  }

  extend type Booking {
    bookee: User,
    place: Place
  }

  extend type PaymentAccount {
    user: User
  }`
