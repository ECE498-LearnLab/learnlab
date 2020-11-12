import React from "react";
import Application from 'react-rainbow-components/components/Application';
import Navigation from "./components/navigation/Navigation";
import Routes from "./components/navigation/Routes";
import {withRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import './App.css';

function App() {
    return (
    <RecoilRoot>
    <Application>
        <Navigation/>
        <Routes />
    </Application>
    </RecoilRoot>
    );
}


export default withRouter(App);