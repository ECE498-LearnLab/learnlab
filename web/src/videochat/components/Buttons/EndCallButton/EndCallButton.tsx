import React from 'react';
<<<<<<< HEAD

import { IconButton } from '@material-ui/core';
import CallEndIcon from '@material-ui/icons/CallEnd';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const buttonStyle = {
  backgroundColor: '#BD271E',
  color: 'white',
};

export default function EndCallButton(props: { className?: string }) {
  const { room } = useVideoContext();

  return (
    <IconButton aria-label="end call" onClick={() => room.disconnect()} style={buttonStyle}>
      <CallEndIcon />
    </IconButton>
=======
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Button onClick={() => room.disconnect()} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Disconnect
    </Button>
>>>>>>> b997de5cbfbdd7a6a7f9ddca1c9a04d1c72541e9
  );
}
