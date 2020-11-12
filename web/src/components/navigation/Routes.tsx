
import React from 'react';
import {
    Router,
    Switch,
    Redirect,
    Route,
} from 'react-router-dom';
import Classroom from '../Classroom';
import Settings from '../Settings';
import './Routes.css';

//to-do write a fallback 404 error component
const Routes = () => {
    return (
    <div className="router-container">
            <Switch>
                <Redirect from="/" exact to="/classroom" />
                <Route path="/settings" component={Settings} />
                <Route path="/classroom" component={Classroom} />
            </Switch>
    </div>
    );
};

export default Routes;