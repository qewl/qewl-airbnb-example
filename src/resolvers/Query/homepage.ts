export const homepage = {
  Query: {
    topExperiences: {
      resolve: async event => {
        return event.delegate('query', 'allExperiences', { orderBy: 'popularity_DESC' })
      }
    },
    topHomes: {
      resolve: async event => {
        event.addFields('id')
        return event.delegate('query', 'allPlaces', { orderBy: 'popularity_DESC' })
      }
    },
    topReservations: {
      resolve: async event => {
        return event.delegate('query', 'allRestaurants', { orderBy: 'popularity_DESC' })
      }
    },
    featuredDestinations: {
      resolve: async event => {
        return event.delegate('query', 'allNeighbourhoods', {
          orderBy: 'popularity_DESC',
          filter: { featured: true }
        })
      }
    },
    experiencesByCity: {
      resolve: async event => {
        const { cities } = event.args
        const query = `
        query ($cities: [String!]!) {
          allCities(filter: {
            name_in: $cities
            neighbourhoods_every: {
              locations_every: {
                experience: {
                  id_gt: "0"
                }
              }
            }
          }) {
            id
          }
        }`
        const result = await event.delegateQuery(query, { cities: event.args.cities })
        return result.allCities
      }
    }
  }
}
