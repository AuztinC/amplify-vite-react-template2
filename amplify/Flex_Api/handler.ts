import type { Handler } from 'aws-lambda';
import { env } from '$amplify/env/Flex_Api'

export const handler: Handler = async (event, context) => {
  // your function code goes here
  const request = new Request(env.API_ENDPOINT, {
    headers: {
      // this is the value of secret named "MY_API_KEY"
      'X-Auth-Token': env.API_KEY
    }
  })
  const resp = await fetch(request)
  .then((res)=>res.json()
  .then(res => res))
  // ...
  return resp
}