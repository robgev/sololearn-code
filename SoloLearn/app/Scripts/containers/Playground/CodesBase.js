// React modules
import React, { Component } from 'react';
import Radium from 'radium';

// Material UI components
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import Clear from 'material-ui/svg-icons/content/clear';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { grey700 } from 'material-ui/styles/colors';

// Redux modules
import { connect } from 'react-redux';
import { isLoaded } from 'reducers';

// Additional components
import Codes from './Codes';

const styles = {
	container: {
		position: 'relative',
	},

	toolbar: {
		overflow: 'hidden',
		padding: '5px',
		boxShadow: '0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
	},

	search: {
		float: 'left',
		margin: '0 0 0 15px',
	},

	searchIcon: {
		display: 'inline-block',
		verticalAlign: 'middle',
	},

	searchInput: {
		display: 'inline-block',
		verticalAlign: 'middle',
		margin: '0 5px',
	},

	clearIcon: {
		display: 'inline-block',
		verticalAlign: 'middle',
		cursor: 'pointer',
	},

	codesFilter: {
		float: 'right',
	},

	languageFilter: {
		float: 'right',
	},
};

class CodesBase extends Component {
	state = {
		query: '',
		ordering: 4,
		language: '',
	};

	// Handle search
	handleInputChange = (e) => {
		const { value } = e.target;
		if (value !== this.state.query) {
			this.setState({ query: value });
		}
	}

	// Detect enter on input
	handleKeyPress = (e) => {
		if (e.key === 'Enter' && this.state.query.length > 0) {
			this.codes.getWrappedInstance().loadCodesByState();
		}
	}

	// Clear search input
	clearSearchInput = () => {
		this.setState({ query: '' });
		this.codes.getWrappedInstance().loadCodesByState();
	}

	// Change discuss oredering
	handleOrderingFilterChange = (e, index, value) => {
		this.setState({ ordering: value });
		this.codes.getWrappedInstance().loadCodesByState();
	}

	// Change codes language
	handleLanguageFilterChange = (e, index, value) => {
		this.setState({ language: value });
		this.codes.getWrappedInstance().loadCodesByState();
	}

	render() {
		return (
			<div className="codes" style={styles.container}>
				<div className="toolbar" style={styles.toolbar}>
					<div className="search" style={styles.search}>
						<SearchIcon color={grey700} style={styles.searchIcon} />
						<TextField
							hintText="Search..."
							style={styles.searchInput}
							underlineStyle={{ display: 'none' }}
							value={this.state.query}
							onChange={this.handleInputChange}
							onKeyPress={this.handleKeyPress}
						/>
						{this.state.query.length > 0 &&
							<Clear color={grey700} style={styles.clearIcon} onClick={this.clearSearchInput} />}
					</div>
					<DropDownMenu
						style={styles.languageFilter}
						value={this.state.language}
						onChange={this.handleLanguageFilterChange}
						autoWidth={false}
					>
						<MenuItem value="" primaryText="All" />
						<MenuItem value="cpp" primaryText="C++" />
						<MenuItem value="cs" primaryText="C#" />
						<MenuItem value="java" primaryText="Java" />
						<MenuItem value="py" primaryText="Python" />
						<MenuItem value="rb" primaryText="Ruby" />
						<MenuItem value="php" primaryText="PHP" />
						<MenuItem value="web" primaryText="Web" />
					</DropDownMenu>
					<DropDownMenu
						style={styles.codesFilter}
						value={this.state.ordering}
						onChange={this.handleOrderingFilterChange}
						autoWidth={false}
					>
						<MenuItem value={4} primaryText="Trending" />
						<MenuItem value={2} primaryText="Most Popular" />
						<MenuItem value={1} primaryText="Most Recent" />
						<MenuItem value={3} primaryText="My Codes" />
					</DropDownMenu>
				</div>
				<Codes
					codes={this.props.codes}
					isLoaded={this.props.isLoaded}
					ordering={this.state.ordering}
					language={this.state.language}
					query={this.state.query}
					isUserProfile={false}
					ref={(codes) => { this.codes = codes; }}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		isLoaded: isLoaded(state, 'playground'),
		codes: state.codes,
	};
}

export default connect(mapStateToProps)(Radium(CodesBase));
