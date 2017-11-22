require('dotenv').config()

import * as express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import { remoteSchema, schema, resolver, resolvers, serve, use, transform } from 'qewl'
import * as jwt from 'express-jwt'

import { linkingSchema } from './schemas/linkingSchema'
import { linkingResolvers } from './resolvers/linkingResolvers'
import { homepage } from './resolvers/Query/homepage'
import { Viewer } from './resolvers/Viewer'
import { account } from './resolvers/Mutation/account'
import { User } from './resolvers/User'
import { ExperiencesByCity } from './resolvers/ExperiencesByCity'
import { addPaymentMethod } from './resolvers/Mutation/addPaymentMethod'
import { book } from './resolvers/Mutation/book'
import { checkAuthentication } from './utils'
import { Home } from './resolvers/Home'
import { finalSchema } from './schemas/finalSchema'

async function run() {
  const app = express()
  const graphql = express.Router()

  // Add user from Authorization token to context
  graphql.use(jwt({ secret: process.env.JWT_SECRET, credentialsRequired: false }))

  // Add and link schemas
  graphql.use(
    // Add accomodation and booking endpoint
    remoteSchema({
      uri: process.env.GRAPHCOOL_ACCOMODATION_ENDPOINT,
      authenticationToken: () => process.env.GRAPHCOOL_ACCOMODATION_TOKEN
    }),
    remoteSchema({
      uri: process.env.GRAPHCOOL_BOOKING_ENDPOINT,
      authenticationToken: () => process.env.GRAPHCOOL_BOOKING_TOKEN
    }),

    // Add linking schema between endpoints
    schema(linkingSchema),
    // Add linking resolvers
    resolvers(linkingResolvers)
  )

  // Add top level fields
  graphql.use(
    schema(`
      extend type Query {
        topExperiences: [Experience!]!
        topHomes: [Home!]!
        topReservations: [Restaurant!]!
        featuredDestinations: [Neighbourhood!]!
        experiencesByCity(cities: [String!]!): [ExperiencesByCity!]!
        viewer: Viewer
      }

      extend type Mutation {
        signup(email: String!, password: String!, firstName: String!, lastName: String!, phone: String!): User!
        login(email: String! password: String!): User!
        addPaymentMethod(
          cardNumber: String!
          expiresOnMonth: Int!
          expiresOnYear: Int!
          securityCode: String!
          firstName: String!
          lastName: String!
          postalCode: String!
          country: String!
        ): User!
        book(
          placeId: ID!
          checkIn: String!
          checkOut: String!
          numGuests: Int!
        ): BookingResult!
      }

      type Home {
        id: ID!
        name: String
        description: String!
        numRatings: Int!
        avgRating: Float!
        pictures(first: Int): [Picture!]!
      }

      type ExperiencesByCity {
        experiences: [Experience!]!
        city: City!
      }

      type Viewer {
        me: User!
        bookings: [Booking!]!
      }

      type BookingResult {
        success: Boolean!
      }

      extend type User {
        token: String!
      }`),

    resolvers({
      Query: {
        ...homepage.Query,
        ...Viewer.Query
      },
      Mutation: {
        ...account.Mutation,
        addPaymentMethod,
        book
      },
      ...ExperiencesByCity,
      ...Home,
      Viewer: Viewer.Viewer,
      ...User
    }),
  )

  // Set up routes that require authentication (could also be done in the resolvers)
  graphql.use(
    use('Query.viewer', checkAuthentication),
    use('Mutation.addPaymentMethod', checkAuthentication),
    use('Mutation.book', checkAuthentication)
  )

  graphql.use(transform(finalSchema))

  app.use('/graphql', express.json(), graphql, await serve())
  app.use('/playground', expressPlayground({ endpoint: '/graphql' }))

  app.listen(3000, () =>
    console.log('Server running. Open http://localhost:3000/playground to run queries.')
  )
}

run().catch(console.error.bind(console))
