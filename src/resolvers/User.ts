import * as jwt from 'jsonwebtoken'

export const User = {
  User: {
    token: {
      fragment: `fragment UserFragment on User { id }`,
      resolve: (event) => {
        return jwt.sign({ userId: event.parent.id }, process.env.JWT_SECRET!)
      }
    }
  }
}
