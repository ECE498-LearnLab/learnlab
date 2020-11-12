import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const twilioConfig = {
  accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID,
  apiKey: process.env.REACT_APP_TWILIO_API_KEY,
  apiSecret: process.env.REACT_APP_TWILIO_API_SECRET,
}
interface RoomAuthentication {
  twilioRoomSid: string
  roomAccessToken: string
}
/**
 * Generating access token on the client
 */
export function generateAccessToken(userName, roomName): RoomAuthentication {
  const token: any = new AccessToken(twilioConfig.accountSid, twilioConfig.apiKey, twilioConfig.apiSecret);
  const videoGrant = new VideoGrant({ room: roomName });
  token.identity = userName
  token.addGrant(videoGrant);
  return token.toJwt();
}
