// React modules
import React, { PureComponent } from 'react';
import { browserHistory, withRouter } from 'react-router';

// i18n
import { translate } from 'react-i18next';

import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

@withRouter
@translate()
class HeaderSearch extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: '',
			searchOpened: false,

			// /codes/something/something splitted by / returns ["", "codes", ....] so we take
			// the element with the index 1 => current section.
			searchArea: props.currentSection,
		};
	}

	componentWillReceiveProps(newProps) {
		const { currentSection } = newProps;
		if (currentSection !== this.props.currentSection) {
			this.setState({ searchArea: currentSection });
		}
	}

	openSearch = () => {
		this.setState({ searchOpened: true }, () => { this.searchInput.focus(); });
	}

	closeSearch = () => {
		this.setState({ searchOpened: false, searchValue: '' });
	}

	handleMenuChange = (e, idx, searchArea) => {
		this.setState({ searchArea, searchValue: '' });
	}

	handleSearchTextChange = (searchValue) => {
		this.setState({ searchValue });
	}

	handleSearch = () => {
		const { searchValue } = this.state;
		const { location } = this.props;
		if (searchValue.trim()) { // Enter pressed and query is not empty
			const { searchArea } = this.state;
			switch (searchArea) {
			case 'discuss':
				browserHistory.push({ pathname: '/discuss', query: { ...location.query, query: searchValue } });
				break;
			case 'learn':
				browserHistory.push(`/learn/search/${searchValue}`);
				break;
			case 'codes':
				browserHistory.push({ pathname: '/codes', query: { ...location.query, query: searchValue } });
				break;
			case 'users':
				browserHistory.push(`/discover/${searchValue}`);
				break;
			default:
				break;
			}
		}
	}

	handleKeyPress = async (e) => {
		if (e.key === 'Enter') { // Enter pressed and query is not empty
			this.handleSearch();
		}
	}

	render() {
		const { searchValue, searchOpened, searchArea } = this.state;
		const { t } = this.props;
		return (
			<div className="header-search-container">
				<IconButton
					onClick={this.openSearch}
					className="header-search-icon"
					iconStyle={{
						width: 27,
						height: 27,
						opacity: searchOpened ? 0 : 1,
						transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
					}}
					style={{ zIndex: 1 }}
				>
					<SearchIcon color="white" />
				</IconButton>
				<div className={`header-overlay ${searchOpened ? 'open' : ''}`}>
					<DropDownMenu
						autoWidth={false}
						value={searchArea}
						style={{ height: 56, width: 140 }}
						labelStyle={{ color: 'white' }}
						className="header-dropdown"
						underlineStyle={{ border: 'none' }}
						onChange={this.handleMenuChange}
					>
						<MenuItem value="learn" primaryText="Lessons" />
						<MenuItem value="codes" primaryText="Codes" />
						<MenuItem value="discuss" primaryText="Posts" />
						<MenuItem value="users" primaryText="Users" />
					</DropDownMenu>
					<div className="search-wrapper">
						<AutoComplete
							fullWidth
							dataSource={[]}
							hintText={t('search_bar.placeholder')}
							underlineShow={false}
							searchText={searchValue}
							onKeyPress={this.handleKeyPress}
							onUpdateInput={this.handleSearchTextChange}
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
					<IconButton onClick={this.closeSearch}>
						<CloseIcon color="white" />
					</IconButton>
				</div>
			</div>
		);
	}
}

export default HeaderSearch;
