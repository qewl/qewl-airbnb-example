# GraphQL Airbnb Example

This example illustrates the usage of the GraphQL Gateway pattern with Qewl and Graphcool.

## Getting Started
### Initializing the Graphcool Services
```
cd accomodation-service
gc deploy
gc info # put the simple endpoint into the `GRAPHCOOL_ACCOMODATION_ENDPOINT` env var in .env
gc root-token main # put the root token into the `GRAPHCOOL_ACCOMODATION_TOKEN` env var in .env

cd ..\booking-service
gc deploy
gc info # put the simple endpoint into the `GRAPHCOOL_BOOKING_ENDPOINT` env var in .env
gc root-token main # put the root token into the `GRAPHCOOL_BOOKING_TOKEN` env var in .env
```

### Starting the Gateway
```
yarn install
yarn start
# Open http://localhost:3000/playground
```

### Seeding some data
Look in `seed.graphql` to seed some data.

### Booking flow
Look in `queries/booking.graphql` to see the booking flow.

### Technical Variations

`./src/server.ts` shows a variation where all the functionality is added in separate steps (for composition).  
`./src/server-alternative.ts` shows a variation where all the added functionality is added add once (more concise).
Both variation result in exactly the same Gateway endpoint.

## License
MIT
