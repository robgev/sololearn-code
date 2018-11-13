// React modules
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import HomeIcon from 'components/HomeIcon';
import 'styles/header.scss';
import Search from './SearchBar';

// Additional components
import TabList from './Tabs';
import Notifications from '../Notifications';
import SettingsMenu from './HeaderSettingsMenu';

const mapStateToProps = state => ({
	isSignedIn: state.userProfile !== null,
});

const Header = ({ pathname, isSignedIn }) => (
	<div className="header mui-fixed">
		<div className="header-wrapper">
			<div className="header-right">
				<Link to="/feed" className="home-icon">
					<HomeIcon />
				</Link>
				<Search />
				<TabList pathname={pathname} />
			</div>
			<div className="header-left">
				{isSignedIn && <Notifications />}
				<SettingsMenu />
			</div>
		</div>
	</div>
);

export default connect(mapStateToProps)(Header);
