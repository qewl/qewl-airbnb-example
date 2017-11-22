export const book = async event => {
  const { userId } = event.context.user
  const { placeId, checkIn, checkOut } = event.args

  const paymentAccount = await getPaymentAccount(userId, event)
  if (!paymentAccount) {
    throw new Error(`You don't have a payment method yet`)
  }

  if (await alreadyBooked(placeId, checkIn, checkOut, event)) {
    throw new Error(`The requested time is not free.`)
  }

  const days = daysBetween(new Date(checkIn), new Date(checkOut))
  const { Place } = await getPlace(placeId, event)

  const placePrice = days * Place.pricing.perNight
  const totalPrice = placePrice * 1.2
  const serviceFee = placePrice * 0.2

  const payment = {
    placePrice, totalPrice, serviceFee, paymentMethodId: paymentAccount.id,
  }

  // TODO implement real stripe
  await payWithStripe(payment)

  await createBooking(checkIn, checkOut, userId, placeId, payment, event)

  return {success: true}
}

function payWithStripe(payment: any) {
  return Promise.resolve()
}

async function createBooking(startDate: string, endDate: string, bookeeId: string, placeId: string, payment: any, event: any) {
  const result = await event.delegateQuery(`mutation createBooking(
    $startDate: DateTime!
    $endDate: DateTime!
    $bookeeId: String!
    $placeId: String!
    $payment: BookingpaymentPayment
  ) {
    createBooking(
      startDate: $startDate
      endDate: $endDate
      bookeeId: $bookeeId
      placeId: $placeId
      payment: $payment
    ) {
      id
    }
  }`, {startDate, endDate, bookeeId, placeId, payment})

  return result
}

async function getPlace(id: string, event: any) {
  const result = await event.delegateQuery(`{
    Place(id: "${id}") {
      id
      pricing {
        perNight
      }
    }
  }`)

  return result
}

async function getPaymentAccount(userId: string, event: any) {
  const result = await event.delegateQuery(`query ($id: ID!){
    User(id: $id) {
      id
      paymentAccounts {
        id
        creditcard {
          id
          cardNumber
          country
          expiresOnMonth
          expiresOnYear
          firstName
          lastName
          securityCode
          postalCode
        }
      }
    }
  }`, { id: userId})

  return result.User.paymentAccounts[0]
}

async function alreadyBooked(placeId: string, start: string, end: string, event: any) {
  const { allBookings } = await event.delegateQuery(`{
    allBookings(filter: {
      placeId: "${placeId}"
      startDate_gte: "${start}"
      startDate_lte: "${end}"
      }) {
      id
    }
  }`)
  return allBookings.length > 0
}

function daysBetween(date1, date2) {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24

  // Convert both dates to milliseconds
  const date1Ms = date1.getTime()
  const date2Ms = date2.getTime()

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1Ms - date2Ms)

  return Math.round(differenceMs / ONE_DAY)
}
