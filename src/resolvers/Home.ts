export const Home = {
  Home: {
    numRatings: {
      fragment: `fragment HomeFragment on Home { id }`,
      resolve: async event => {
        const result = await event.delegateQuery(`
        query ($id: ID!) {
          Place(id: $id) {
            _reviewsMeta {
              count
            }
          }
        }`, { id: event.parent.id })

        return result.Place._reviewsMeta.count
      }
    }
  }
}
