import React from 'react';
import { styled, Theme } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreen';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

export default function App() {
  const roomState = useRoomState();

  return (
    <div>
      {roomState === 'disconnected' ? (
        <PreJoinScreens />
      ) : (
        <div>
          <ReconnectingNotification />
          <Room />
          <MenuBar />
        </div>
      )}
    </div>
  );
}
