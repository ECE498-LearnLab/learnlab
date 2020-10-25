import React, { useState, useCallback, useRef} from 'react';
import { uniqueNamesGenerator, Config, animals, colors, adjectives} from 'unique-names-generator';
import Lobby from './Lobby';
import {
  EuiButton, EuiPageContent, EuiPageContentBody, EuiFlexGroup, EuiFlexItem, EuiPanel,
} from "@elastic/eui";
import { generateAccessToken } from './utils/accessToken';
import {publishToQueue} from '../engagement/publishFramesToQueue';

const config: Config = {
  dictionaries: [adjectives, colors, animals]
}
 
const VideoChat = () => {
  const [username] = useState(uniqueNamesGenerator(config));
  const [roomName] = useState('Test-Room');
  const [token, setToken] = useState(null);

  const [imageCapture, setImageCapture] = useState(null);
  const canvasRef = useRef(null);

  const onGrabFrame = useCallback(() => {
    if (imageCapture != null){
    imageCapture.grabFrame()
    .then(imageBitmap => {
      const base64String = drawCanvas(canvasRef.current, imageBitmap);
      publishToQueue(base64String);
    },[])
    .catch(error => console.log(error));
  }
  }, [imageCapture])

  const handleSubmit = useCallback(
      async event => {
        event.preventDefault();
        setToken(generateAccessToken(username, roomName));
      },
      [roomName, username]
  );

  if (token) {
      return(
      <>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel paddingSize="l" hasShadow>
            <Lobby roomName={roomName} token={token} setImageCapture={setImageCapture}/>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiPanel paddingSize="l" hasShadow>
            <EuiFlexGroup direction="column">
              <canvas ref={canvasRef} width={200} height={300}/>
              <EuiButton onClick={onGrabFrame}>Grab Frame</EuiButton>
           </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
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

function drawCanvas(canvas, img) {
  canvas.width = getComputedStyle(canvas).width.split('px')[0];
  canvas.height = getComputedStyle(canvas).height.split('px')[0];
  const ratio  = Math.min(canvas.width / img.width, canvas.height / img.height);
  const x = (canvas.width - img.width * ratio) / 2;
  const y = (canvas.height - img.height * ratio) / 2;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
      x, y, img.width * ratio, img.height * ratio);
  return canvas.toDataURL();
}

export default VideoChat;
