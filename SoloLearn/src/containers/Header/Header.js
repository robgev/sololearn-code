// React modules
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import HomeIcon from 'components/HomeIcon';
import 'styles/header.scss';
import Search from './SearchBar';

// Additional components
import TabList from './Tabs';
import NotificationManager from '../Notifications/NotificationManager';
import SettingsMenu from './HeaderSettingsMenu';

const mapStateToProps = state => ({
	isSignedIn: state.userProfile !== null,
});

// /codes/something/something splitted by / returns ["", "codes", ....] so we take
// the element with the index 1 => current section.
const getCurrentSection = (pathName) => {
	// We have the case of play which has no menu item so we need to check the case
	// Of the result being 'contests'. In that case we will pick a default value.
	// Change if you can think of any other solution
	const defaultValue = 'learn';
	const sectionName = pathName.split('/')[1];
	const validSectionNames = [ 'codes', 'discuss', 'users', 'learn' ];
	return validSectionNames.includes(sectionName) ? sectionName : defaultValue;
};

const Header = ({ pathname, isSignedIn }) => (
	<div className="header">
		<div className="header-wrapper">
			<div className="header-right">
				<Link to="/feed" className="home-icon">
					<HomeIcon />
				</Link>
				<Search />
				<TabList pathname={pathname} />
			</div>
			<div className="header-left">
				{isSignedIn && <NotificationManager />}
				<SettingsMenu />
			</div>
		</div>
	</div>
);

export default connect(mapStateToProps)(Header);
