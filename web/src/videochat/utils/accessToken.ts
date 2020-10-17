import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const twilioConfig = {
  accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID,
  apiKey: process.env.REACT_APP_TWILIO_API_KEY,
  apiSecret: process.env.REACT_APP_TWILIO_API_SECRET,
}

/**
 * Generating access token on the client
 */
export function generateAccessToken(username: string, room: string){
  const token: any = new AccessToken(twilioConfig.accountSid, twilioConfig.apiKey, twilioConfig.apiSecret);

  token.identity = username;
  const videoGrant = new VideoGrant({ room });

  token.addGrant(videoGrant);
  return token.toJwt();
}