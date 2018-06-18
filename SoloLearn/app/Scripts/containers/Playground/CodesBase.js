// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

// Material UI components
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

// Redux modules
import { isLoaded } from 'reducers';
import Layout from 'components/Layouts/GeneralLayout';
import AddCodeButton from 'components/Shared/AddCodeButton';

import 'styles/Playground/CodesBase.scss';

// Additional components
import Codes from './Codes';

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'playground'),
	codes: state.codes,
});

@connect(mapStateToProps)
@translate()
class CodesBase extends Component {
	constructor() {
		super();
		this.state = {
			ordering: 4,
			language: '',
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

	render() {
		const { t, codes, isLoaded } = this.props;
		const { language, ordering } = this.state;
		return (
			<Layout>
				<Paper className="playground-codes-container">
					<div className="playground-codes-toolbar">
						<DropDownMenu
							value={language}
							autoWidth={false}
							onChange={this.handleLanguageFilterChange}
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
							value={ordering}
							autoWidth={false}
							onChange={this.handleOrderingFilterChange}
						>
							<MenuItem value={4} primaryText={t('code.filter.trending')} />
							<MenuItem value={2} primaryText={t('code.filter.most-popular')} />
							<MenuItem value={1} primaryText={t('code.filter.most-recent')} />
							<MenuItem value={3} primaryText={t('code.filter.my-codes')} />
						</DropDownMenu>
					</div>
					<Codes
						t={t}
						codes={codes}
						isLoaded={isLoaded}
						ordering={ordering}
						language={language}
						isUserProfile={false}
						ref={(codesRef) => { this.codes = codesRef; }}
					/>
					<AddCodeButton />
				</Paper>
			</Layout>
		);
	}
}

export default CodesBase;
