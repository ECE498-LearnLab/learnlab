
import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from 'react-rainbow-components/components/ButtonGroup';
import ButtonIcon from 'react-rainbow-components/components/ButtonIcon';
import AvatarMenu from 'react-rainbow-components/components/AvatarMenu';
import Avatar from 'react-rainbow-components/components/Avatar';
import Input from 'react-rainbow-components/components/Input';
import MenuItem from 'react-rainbow-components/components/MenuItem';
import MenuDivider from 'react-rainbow-components/components/MenuDivider';
import ButtonMenu from 'react-rainbow-components/components/ButtonMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.css';
import EditIcon from '@material-ui/icons/Edit';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

interface Props {
    onToggleSidebar: () => void,
}

const Header= (props: Props) => {
    const { onToggleSidebar } = props;

    return (
        <header className="header rainbow-position_fixed rainbow-flex rainbow-align_center rainbow-p-horizontal_large rainbow-background-color_white">
        <img src="assets/images/learn-lab-logo.svg" alt="learnlab logo" className="header-logo" />
        <section className="rainbow-flex rainbow-align_center header-actions">
            <AvatarMenu
                assistiveText="Jane Doe"
                initials="JD"
                title="Jane Doe"
                menuAlignment="right"
                menuSize="small">
                <li className="rainbow-p-horizontal_small rainbow-align_center rainbow-flex">
                    <Avatar
                        assistiveText="Jane Doe"
                        initials="JD"
                        title="Jane Doe"
                        size="medium" />
                    <div className="rainbow-m-left_x-small">
                        <p className="rainbow-font-size-text_medium rainbow-color_dark-1">Jane Doe</p>
                        <p className="rainbow-font-size-text_small rainbow-color_gray-3">janedoe@gmail.com</p>
                    </div>
                </li>
                <MenuDivider variant="space" />
                <MenuItem
                    label="Edit Profile"
                    icon={<EditIcon />}
                    iconPosition="left" />
                <MenuItem
                    label="Logout"
                    icon={<ExitToAppIcon />}
                    iconPosition="left" />
            </AvatarMenu>
        </section>
        <ButtonIcon
            onClick={onToggleSidebar}
            className="header-hamburger-button"
            size="large"
            icon={<MoreHorizIcon />} />
    </header>
    );
};

export default Header;

