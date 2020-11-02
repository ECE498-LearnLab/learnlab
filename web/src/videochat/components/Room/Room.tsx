import React from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import { EuiPanel } from '@elastic/eui';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
  gridTemplateRows: '100%',
}));

export default function Room() {
  return (
    <EuiPanel>
      <MainParticipant />
      <ParticipantList />
    </EuiPanel>
  );
}
