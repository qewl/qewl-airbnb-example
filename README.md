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
# Open http://localhost:3000/
```

### Seeding some data
Look in `seed.graphql` to seed some data.

### Booking flow
Look in `queries/booking.graphql` to see the booking flow.

## License
MIT
