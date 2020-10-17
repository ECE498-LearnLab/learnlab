import "@elastic/eui/dist/eui_theme_light.css";
import React, {Fragment, MutableRefObject, useRef} from "react";

import {
  EuiAvatar,
  EuiHeader,
  EuiHeaderLogo,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiIcon,
  EuiShowFor,
  EuiNavDrawer,
} from "@elastic/eui";

interface Props {
    navRef?: MutableRefObject<EuiNavDrawer| null>;
};

const Navigation = (props: Props) => {
    const navRef = useRef(null);
    return (
    <Fragment>
    <EuiHeader>
    <EuiHeaderSection grow={false}>
        <EuiShowFor sizes={["xs", "s"]}>
        <EuiHeaderSectionItem border="right">
            <EuiHeaderSectionItemButton
                aria-label="Open nav"
                onClick={() => navRef.current?.toggleOpen()}
            >
            <EuiIcon type="apps" href="#" size="m" />
        </EuiHeaderSectionItemButton>
        </EuiHeaderSectionItem>
        </EuiShowFor>
        <EuiHeaderSectionItem border="right">
        <EuiHeaderLogo
            iconType="logoLogstash"
        />
        </EuiHeaderSectionItem>
        <EuiHeaderSectionItem border="right">
        </EuiHeaderSectionItem>
    </EuiHeaderSection>
    <EuiHeaderSection side="right">
        <EuiHeaderSectionItem>
        <EuiHeaderSectionItemButton aria-label="Account menu">
            <EuiAvatar name="Jane Doe" size="s" />
        </EuiHeaderSectionItemButton>
        </EuiHeaderSectionItem>
    </EuiHeaderSection>
    </EuiHeader>
    <EuiNavDrawer ref={navRef}>
    </EuiNavDrawer>
    </Fragment>
    );
};

export default Navigation;