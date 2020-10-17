import React, { useState, useCallback } from 'react';
import { uniqueNamesGenerator, Config, animals, colors, adjectives} from 'unique-names-generator';
import Lobby from './Lobby';
import {
  EuiButton, EuiPageContent, EuiPageContentBody,
} from "@elastic/eui";
import { generateAccessToken } from './utils/accessToken';

const config: Config = {
  dictionaries: [adjectives, colors, animals]
}
 
const VideoChat = () => {
  const [username] = useState(uniqueNamesGenerator(config));
  const [roomName] = useState('Test-Room');
  const [token, setToken] = useState(null);

  const handleSubmit = useCallback(
      async event => {
        event.preventDefault();
        setToken(generateAccessToken(username, roomName));
      },
      [roomName, username]
  );

  if (token) {
      return(
      <EuiPageContent verticalPosition="center" horizontalPosition="center">
        <EuiPageContentBody>
          <Lobby roomName={roomName} token={token} />
        </EuiPageContentBody>
      </EuiPageContent>
      );
  } else {
    return (
      <EuiPageContent verticalPosition="center" horizontalPosition="center">
        <EuiPageContentBody>
          <EuiButton
              onClick={handleSubmit}>
              Join Room
          </EuiButton>
          </EuiPageContentBody>
        </EuiPageContent>
    );
  }
};

export default VideoChat;
