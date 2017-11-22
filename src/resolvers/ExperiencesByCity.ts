export const ExperiencesByCity = {
  ExperiencesByCity: {
    city: {
      resolve: event => {
        return event.delegate('query', 'City', { id: event.parent.id })
      }
    },
    experiences: {
      resolve: event => {
        return event.delegate('query', 'allExperiences', {
          filter: { location: { neighbourHood: { city: { id: event.parent.id } } } }
        })
      }
    }
  }
}
