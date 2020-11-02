import React, { useCallback } from 'react';
import { useState } from 'react';
import { Sidebar, SidebarItem } from 'react-rainbow-components';
import TvIcon from '@material-ui/icons/Tv';
import SettingsIcon from '@material-ui/icons/Settings';
import {useHistory} from 'react-router-dom';
import './SidebarNav.css';

const SidebarNav = () => {
    const [selectedPage, setSelectedPage] = useState("classroom");
    const history = useHistory();

    const navigate = (name: string) => {
        history.push(name);
    };

    return (
        <Sidebar
        className="sidebar"
        selectedItem={selectedPage}
        onSelect={(_event, name) => setSelectedPage(name)}>
        <SidebarItem
            className="sidebar-item"
            icon={<TvIcon />}
            name="classroom"
            label="Classroom"
            onClick={() => navigate("classroom")} />
        <SidebarItem
        className="sidebar-item"
        icon={<SettingsIcon />}
        name="settings"
        label="Settings"
        onClick={() => navigate("settings")} />
    </Sidebar>
    );
}

export default SidebarNav;