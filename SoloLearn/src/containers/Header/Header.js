// React modules
import React from 'react';
import { connect } from 'react-redux';
import { Image, Container, FlexBox } from 'components/atoms';
import { ContainerLink } from 'components/molecules';
import HomeIcon from 'components/HomeIcon';

import TabList from './Tabs';
import Notifications from '../Notifications';
import SettingsMenu from './HeaderSettingsMenu';

import './styles.scss';

const mapStateToProps = state => ({
	isSignedIn: state.userProfile !== null,
});

const Header = ({ pathname, isSignedIn }) => (
	<Container className="header mui-fixed">
		<Container className="header-wrapper">
			<FlexBox align className="header-logo">
				<ContainerLink to="/feed" className="home-icon">
					<Container className="header_home-icon_small">
						<HomeIcon />
					</Container>
					<Container className="header_home-icon_big">
						<Image className="header_home-icon_image" src="/assets/logo_full.png" />
					</Container>
				</ContainerLink>
			</FlexBox>
			<FlexBox align className="header-left">
				<TabList pathname={pathname} />
			</FlexBox>
			<FlexBox align justifyEnd className="header-right">
				{isSignedIn && <Notifications />}
				<SettingsMenu />
			</FlexBox>
		</Container>
	</Container>
);

export default connect(mapStateToProps)(Header);
