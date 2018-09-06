import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { connect } from 'react-redux';
import {
	onSearchChange, toggleSearch, onSearchSectionChange,
} from 'actions/searchBar';
import {
	SECTIONS,
	searchValueSelector, searchSectionSelector, isSearchOpenSelector,
} from 'reducers/searchBar.reducer';

import Localize from 'components/Localize';

import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

const mapStateToProps = state => ({
	value: searchValueSelector(state),
	section: searchSectionSelector(state),
	isOpen: isSearchOpenSelector(state),
});

const mapDispatchToProps = {
	onChange: onSearchChange,
	toggle: toggleSearch,
	onSectionChange: onSearchSectionChange,
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class SearchBar extends Component {
	static routeSectionMap = {
		codes: SECTIONS.codes,
		discuss: SECTIONS.posts,
		profile: SECTIONS.users,
		discover: SECTIONS.users,
		learn: SECTIONS.lessons,
	};

	componentDidUpdate(prevProps) {
		if (this.props.isOpen && prevProps.isOpen === false) {
			this.searchInput.focus();
		}
	}
	onSectionChange = (_, __, section) => {
		this.props.onSectionChange(section);
	}
	open = () => {
		const { onSectionChange, toggle, location } = this.props;
		const sectionPathname = location.pathname.split('/')[1];
		const section = SearchBar.routeSectionMap[sectionPathname];
		if (section !== undefined) {
			onSectionChange(section);
		}
		toggle();
	}
	render() {
		const {
			value, section, isOpen,
			onChange,
		} = this.props;
		return (
			<Localize>
				{t => (
					<div className="header-search-container">
						<IconButton
							onClick={this.open}
							className="header-search-icon"
							iconStyle={{
								width: 27,
								height: 27,
								opacity: isOpen ? 0 : 1,
								transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
							}}
							style={{ zIndex: 1 }}
						>
							<SearchIcon color="white" />
						</IconButton>
						<div className={`header-overlay ${isOpen ? 'open' : ''}`}>
							<DropDownMenu
								autoWidth={false}
								value={section}
								style={{ height: 56, width: 140 }}
								labelStyle={{ color: 'white' }}
								className="header-dropdown"
								underlineStyle={{ border: 'none' }}
								onChange={this.onSectionChange}
							>
								<MenuItem value={SECTIONS.lessons} primaryText="Lessons" />
								<MenuItem value={SECTIONS.codes} primaryText="Codes" />
								<MenuItem value={SECTIONS.posts} primaryText="Posts" />
								<MenuItem value={SECTIONS.users} primaryText="Users" />
							</DropDownMenu>
							<div className="search-wrapper">
								<AutoComplete
									fullWidth
									dataSource={[]}
									hintText={t('search_bar.placeholder')}
									underlineShow={false}
									searchText={value}
									onKeyPress={this.handleKeyPress}
									onUpdateInput={onChange}
									ref={(searchInput) => { this.searchInput = searchInput; }}
								/>
								<IconButton
									onClick={this.handleSearch}
									className="header-search-open-icon"
									iconStyle={{
										width: 23,
										height: 23,
										fill: '#525A6A',
										transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
									}}
									style={{ zIndex: 1, backgroundColor: '#F6F7F9' }}
								>
									<SearchIcon color="white" />
								</IconButton>
							</div>
							<IconButton onClick={this.open}>
								<CloseIcon color="white" />
							</IconButton>
						</div>
					</div>
				)}
			</Localize>
		);
	}
}

export default SearchBar;
