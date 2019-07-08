// React modules
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Image, Container, FlexBox, Link } from 'components/atoms';
import { ContainerLink } from 'components/molecules';
import HomeIcon from 'components/HomeIcon';

import TabList from './Tabs';
import Notifications from '../Notifications';
import SettingsMenu from './HeaderSettingsMenu';

import './styles.scss';

const mapStateToProps = state => ({
	isSignedIn: state.userProfile !== null,
});

const Header = ({ pathname, isSignedIn }) => {
	const scrollTop = () => {
		window.scrollTo(0, 0);
	};

	return (
		<Container className="header mui-fixed">
			<Container className="header-wrapper">
				<FlexBox align className="header-logo">
					<ContainerLink to="/feed" className="home-icon" onClick={scrollTop}>
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
					{
						isSignedIn
							? (
								<Fragment>
									<Notifications />
									<SettingsMenu />
								</Fragment>
							)
							: (
								 <Link to="/signin">
									Sign In
								</Link>
							)
					}
				</FlexBox>
			</Container>
		</Container>
	);
};
export default connect(mapStateToProps)(Header);
