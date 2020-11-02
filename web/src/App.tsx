import React from "react";
import Application from 'react-rainbow-components/components/Application';
import Navigation from "./navigation/Navigation";
import Routes from "./navigation/Routes";
import {withRouter} from 'react-router-dom';

function App() {
    return (
    <Application>
        <Navigation/>
        <Routes />
    </Application>
    );
}


export default withRouter(App);