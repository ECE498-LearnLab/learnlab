import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './videochat/App';
import AppStateProvider, { useAppState } from './videochat/state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './videochat/components/ErrorDialog/ErrorDialog';
import LoginPage from './videochat/components/LoginPage/LoginPage';
import PrivateRoute from './videochat/components/PrivateRoute/PrivateRoute';
import theme from './videochat/theme';
import './videochat/types';
import { VideoProvider } from './videochat/components/VideoProvider';
import useConnectionOptions from './videochat/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './videochat/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

const VideoApp = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <AppStateProvider>
        <Switch>
          <PrivateRoute exact path="/">
            <VideoApp />
          </PrivateRoute>
          <PrivateRoute path="/room/:URLRoomName">
            <VideoApp />
          </PrivateRoute>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
