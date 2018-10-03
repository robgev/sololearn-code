import React, { Component } from 'react';
import { withRouter, browserHistory } from 'react-router';

import { connect } from 'react-redux';
import {
	setSearchValue, toggleSearch, onSearchSectionChange,
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
	onChange: setSearchValue,
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
		const {
			isOpen, location, toggle, section,
		} = this.props;
		if (isOpen && prevProps.isOpen === false) {
			this.searchInput.focus();
		}
		if (location.pathname !== prevProps.location.pathname
			&& section !== SearchBar.routeSectionMap[location.pathname]) {
			toggle({ open: false });
		}
	}

	handleKeyDown = async (e) => {
		if (e.keyCode === 13) {
			this.handleSearch();
		}
	}

	handleSearch = () => {
		const { value, section, location } = this.props;
		this.handleSearchRaw(value, section, location);
	}

	handleSearchRaw = (value, section, location) => {
		const { query: _, ...restQuery } = location.query;
		const query = { ...restQuery, ...(value.length === 0 ? {} : { query: value }) };
		const linkVal = value.length === 0 ? '' : `/${value}`;
		switch (section) {
		case SECTIONS.posts:
			browserHistory.push({ pathname: '/discuss', query });
			break;
		case SECTIONS.lessons:
			if (linkVal) {
				browserHistory.push(`/learn/search${linkVal}`);
			}
			break;
		case SECTIONS.codes:
			browserHistory.push({ pathname: '/codes', query });
			break;
		case SECTIONS.users:
			browserHistory.push(`/discover${linkVal}`);
			break;
		default:
			break;
		}
	}

	onSectionChange = (_, __, section) => {
		this.props.onSectionChange(section);
	}

	open = () => {
		const {
			onSectionChange, toggle, location, isOpen,
		} = this.props;
		if (isOpen) {
			toggle({ open: false });
			this.handleSearchRaw('', this.props.section, location);
			return;
		}
		const sectionPathname = location.pathname.split('/')[1];
		const section = SearchBar.routeSectionMap[sectionPathname];
		if (section !== undefined) {
			onSectionChange(section);
		}
		toggle({ open: true });
	}

	render() {
		const {
			value, section, isOpen,
			onChange,
		} = this.props;
		return (
			<Localize>
				{({ t }) => (
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
								style={{ height: 56, width: 250 }}
								labelStyle={{ color: 'white' }}
								className="header-dropdown"
								underlineStyle={{ border: 'none' }}
								onChange={this.onSectionChange}
							>
								<MenuItem value={SECTIONS.lessons} primaryText={t('search_bar.lessons-title')} />
								<MenuItem value={SECTIONS.codes} primaryText={t('search_bar.codes-title')} />
								<MenuItem value={SECTIONS.posts} primaryText={t('search_bar.posts-title')} />
								<MenuItem value={SECTIONS.users} primaryText={t('search_bar.users-title')} />
							</DropDownMenu>
							<div className="search-wrapper">
								<AutoComplete
									fullWidth
									dataSource={[]}
									hintText={t('search_bar.placeholder')}
									underlineShow={false}
									searchText={value}
									onKeyDown={this.handleKeyDown}
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
