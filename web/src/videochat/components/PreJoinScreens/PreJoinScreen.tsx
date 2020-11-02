import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionForm from './DeviceSelectionForm';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar';
import PreflightTest from './PreflightTest/PreflightTest';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Video from 'twilio-video';
import RoomList from './RoomList';
import { uniqueNamesGenerator, Config, animals, colors, adjectives} from 'unique-names-generator';

const config: Config = {
  dictionaries: [adjectives, colors, animals]
}

export enum Steps {
  joinRoomStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const { URLRoomName } = useParams();
  const [step, setStep] = useState(Steps.joinRoomStep);

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
      if (user?.displayName) {
        setStep(Steps.deviceSelectionStep);
      }
    }
  }, [user, URLRoomName]);

  useEffect(() => {
    if (step === Steps.deviceSelectionStep) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step]);

  const handleJoinRoom = (event: FormEvent<HTMLFormElement>, roomID: string) => {
    event.preventDefault();
    setName(uniqueNamesGenerator(config));
    setRoomName(roomID);
    setStep(Steps.deviceSelectionStep);
  };

  const SubContent = (
    <>
      {Video.testPreflight && <PreflightTest />}
      <MediaErrorSnackbar error={mediaError} />
    </>
  );

  return (
    <div>
      {step === Steps.joinRoomStep && (
        <RoomList
          onJoinRoom={handleJoinRoom}
        />
      )}

      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionForm name={name} roomName={roomName} setStep={setStep} />
      )}
    </div>
  );
}
