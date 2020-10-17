import React, { Fragment } from "react";
import Navigation from "./Navigation";
import {
  EuiFocusTrap,
  EuiPage,
  EuiPageBody,
} from "@elastic/eui";
import VideoChat from '../videochat/VideoChat';

import "@elastic/eui/dist/eui_theme_light.css";

const MainLayout = () => {
  return (
    <Fragment>
        <EuiFocusTrap>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%"
          }}
        >
          <Navigation />
          <EuiPage restrictWidth={true} className="MainLayoutPage">
            <EuiPageBody className="MainLayoutPageBody">
              <VideoChat/>
            </EuiPageBody>
          </EuiPage>
        </div>
      </EuiFocusTrap>
    </Fragment>
  );
};
export default MainLayout;