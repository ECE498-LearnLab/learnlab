import React from 'react';
import ReactDOM from 'react-dom';
import Login from './layout/Login';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
    <Auth0Provider
        domain="dev-xjvnzh39.us.auth0.com"
        clientId="81T6vNm0W1NpUDpweaDK63vfqabIEpeG"
        redirectUri={window.location.origin}
    >
    <Login />
    </Auth0Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
