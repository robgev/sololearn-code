// React modules
import React, { Component } from 'react';
import Radium from 'radium';
import { map, uniqBy } from 'lodash';

// i18n
import { translate } from 'react-i18next';

// Material UI components
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { grey700 } from 'material-ui/styles/colors';

// Redux modules
import { connect } from 'react-redux';
import { isLoaded } from 'reducers';
import LanguageCard from 'components/Shared/languageCard';
import Layout from 'components/Layouts/GeneralLayout';
import editorSettings from 'defaults/playgroundEditorSettings';

// Additional components
import Codes from './Codes';

const styles = {
	container: {
		position: 'relative',
	},

	toolbar: {
		overflow: 'hidden',
		padding: '5px',
	},

	codesFilter: {
		float: 'right',
	},

	languageFilter: {
		float: 'right',
	},

	newCodeButton: {
		position: 'fixed',
		bottom: 20,
		right: 20,
	},
};

class CodesBase extends Component {
	constructor() {
		super();
		const languagesArray = map(editorSettings, item => item);
		const languages = uniqBy(languagesArray, 'language');
		this.state = {
			ordering: 4,
			language: '',
			languages,
			isLanguagePopupOpen: false,
		};
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

	toggleLanguagePopup = () => {
		const { isLanguagePopupOpen } = this.state;
		this.setState({ isLanguagePopupOpen: !isLanguagePopupOpen });
	}

	render() {
		const { isLanguagePopupOpen, languages } = this.state;
		const { t } = this.props;
		return (
			<Layout>
				<div className="toolbar" style={styles.toolbar}>
					<DropDownMenu
						style={styles.languageFilter}
						value={this.state.language}
						onChange={this.handleLanguageFilterChange}
						autoWidth={false}
					>
						<MenuItem value="" primaryText={t('code.language-filter.all')} />
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
						<MenuItem value={4} primaryText={t('code.filter.trending')} />
						<MenuItem value={2} primaryText={t('code.filter.most-popular')} />
						<MenuItem value={1} primaryText={t('code.filter.most-recent')} />
						<MenuItem value={3} primaryText={t('code.filter.my-codes')} />
					</DropDownMenu>
				</div>
				<Codes
					t={t}
					codes={this.props.codes}
					isLoaded={this.props.isLoaded}
					ordering={this.state.ordering}
					language={this.state.language}
					isUserProfile={false}
					ref={(codes) => { this.codes = codes; }}
				/>
				<FloatingActionButton
					secondary
					zDepth={3}
					style={styles.newCodeButton}
					onClick={this.toggleLanguagePopup}
				>
					<ContentAdd />
				</FloatingActionButton>
				<Dialog
					title={t('code.language-picker-title')}
					open={isLanguagePopupOpen}
					onRequestClose={this.toggleLanguagePopup}
				>
					{
						languages.map(currentElement => (
							<LanguageCard
								{...currentElement}
								linkPrefix="/playground"
							/>
						))
					}
				</Dialog>
			</Layout>
		);
	}
}

function mapStateToProps(state) {
	return {
		isLoaded: isLoaded(state, 'playground'),
		codes: state.codes,
	};
}

const translatedCodesBase = translate()(CodesBase);

export default connect(mapStateToProps)(Radium(translatedCodesBase));
