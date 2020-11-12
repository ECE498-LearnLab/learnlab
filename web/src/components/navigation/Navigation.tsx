
import React, { Component, useCallback, useState } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Application from 'react-rainbow-components/components/Application';
import Sidebar from 'react-rainbow-components/components/Sidebar';
import SidebarItem from 'react-rainbow-components/components/SidebarItem';
import ButtonIcon from 'react-rainbow-components/components/ButtonIcon';
import RenderIf from 'react-rainbow-components/components/RenderIf';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SidebarNav from './SidebarNav';
import Header from './Header';
import './Navigation.css';

// To-do move this into normal hooks folder
function useToggle(initialState){
    const [value, setValue] = useState(initialState);
    const toggle = () => { setValue(!value) };
    return [value, toggle];
};

const Navigation = () => {
    const [isSidebarHidden, toggleIsSidebarHidden] = useToggle('false');

    const getSidebarClassnames = () => {
        return classnames('sidebar-container', {
            'sidebar-container--sidebar-hidden': isSidebarHidden,
        });
    };

    return (
        <Application>
        <RenderIf isTrue={!isSidebarHidden}>
            <div
                className="backdrop"
                role="presentation"
                onClick={toggleIsSidebarHidden} />
        </RenderIf>
        <Header onToggleSidebar={toggleIsSidebarHidden} />
        <div className={getSidebarClassnames()}>
        <SidebarNav />
        <RenderIf isTrue={!isSidebarHidden}>
                        <div className="sidebar-back-button-container">
                            <ButtonIcon
                                onClick={toggleIsSidebarHidden}
                                size="large"
                                icon={
                                    <ArrowBackIcon />
                                } />
                        </div>
        </RenderIf>
        </div>
        </Application>
    );
}

export default Navigation

