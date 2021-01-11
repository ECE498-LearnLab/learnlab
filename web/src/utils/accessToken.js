import twilio from 'twilio'

const { AccessToken } = twilio.jwt
const { VideoGrant } = AccessToken

const twilioConfig = {
  accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID,
  apiKey: process.env.REACT_APP_TWILIO_API_KEY,
  apiSecret: process.env.REACT_APP_TWILIO_API_SECRET,
}

/**
 * Generating access token on the client
 */
export function generateAccessToken(userName, roomName) {
  const token = new AccessToken(
    twilioConfig.accountSid,
    twilioConfig.apiKey,
    twilioConfig.apiSecret,
  )
  const videoGrant = new VideoGrant({ room: roomName })
  token.identity = userName
  token.addGrant(videoGrant)
  console.log(token)
  return token.toJwt()
}
