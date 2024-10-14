import { env } from '$amplify/env/sayHello'

export const handler = async (event: any) => {
  const request = new Request(env.API_ENDPOINT, {
    headers: {
      // this is the value of secret named "MY_API_KEY"
      'X-Auth-Token': `${env.API_KEY}`
    }
  })
  // ...
  return `Hello, ${request}!`;
};