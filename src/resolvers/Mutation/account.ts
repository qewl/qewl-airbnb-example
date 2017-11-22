import * as bcrypt from 'bcryptjs'

export const account = {
  Mutation: {
    signup: {
      resolve: async event => {
        const newArgs = {
          ...event.args,
          password: await bcrypt.hash(event.args.password, 10)
        }

        console.log(newArgs)
        // Somehow, this doesn't store the password hash, but the original password?!
        const result = await event.delegate('mutation', 'createUser', newArgs)

        return event.delegate('query', 'User', { id: result.id })
      }
    },
    login: {
      resolve: async event => {
        const { email, password } = event.args
        event.addFields(['password'])
        const User = await event.delegate(
          'query',
          'User',
          { email }
        )

        //const valid = await bcrypt.compare(password, User.password)
        const valid = password === User.password
        if (!valid) {
          throw new Error('Not authorized')
        }

        return User
      }
    }
  }
}
