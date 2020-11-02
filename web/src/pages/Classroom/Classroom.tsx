import React from "react";
import Card from 'react-rainbow-components/components/Card';
import VideoApp from "../../videochat/VideoApp";
import './Classroom.css'
import AppStateProvider, { useAppState } from '../../videochat/state';

// to-do add loading state
function Classroom() {
    return (
        <AppStateProvider>
        <VideoApp />
        </AppStateProvider>
    )
}
export default Classroom;
