// React modules
import React, { PureComponent } from 'react';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

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
		this.setState({ searchOpened: false });
	}

	handleMenuChange = (e, idx, searchArea) => {
		this.setState({ searchArea });
	}

	handleSearchTextChange = (e) => {
		this.setState({ searchValue: e.target.value });
	}

	handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			// Do something.
		}
	}

	render() {
		const { searchValue, searchOpened, searchArea } = this.state;
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
				>
					<SearchIcon color="white" />
				</IconButton>
				<div className={`header-overlay ${searchOpened ? 'open' : ''}`}>
					<DropDownMenu
						value={searchArea}
						style={{ height: 56 }}
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
							hintText="Search"
							underlineShow={false}
							searchText={searchValue}
							onUpdateInput={this.onChange}
							onKeyPress={this.handleKeyPress}
							ref={(searchInput) => { this.searchInput = searchInput; }}
						/>
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
