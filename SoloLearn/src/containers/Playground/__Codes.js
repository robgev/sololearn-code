// React modules
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import ReactGA from 'react-ga';
import Radium from 'radium';
import { connect } from 'react-redux';

// Redux modules
import { getCodesInternal, emptyCodes } from 'actions/playground';

// Additional components
import LoadingOverlay from 'components/LoadingOverlay';
import InfiniteVirtualizedList from 'components/InfiniteVirtualizedList';
import CodeShimmer from 'components/Shimmers/CodeShimmer';
import 'styles/Playground/Codes.scss';

import CodeItem from './CodeItem';

class Codes extends Component {
	constructor(props) {
		super(props);
		document.title = 'Sololearn | Code';
		ReactGA.ga('send', 'screenView', { screenName: 'Codes Page' });
	}

	loadCodes = async () => {
		try {
			const {
				codes, ordering, language, userId,
			} = this.props;
			const index = codes ? codes.length : 0;
			await this.props.getCodesInternal(index, ordering, language, '', userId);
		} catch (e) {
			console.log(e);
		}
	}

	// Load codes when condition changes
	loadCodesByState = async () => {
		await this.props.emptyCodes();
		this.loadCodes();
	}

	renderCode = code => (
		<CodeItem code={code} />
	)

	render() {
		const { isLoading } = this.state;
		const {
			isLoaded, codes, t,
		} = this.props;
		return (
			<div className="codes-wrapper">
				{(isLoaded && codes.length > 0) &&
					<InfiniteVirtualizedList
						window
						list={codes}
						rowHeight={81}
						item={this.renderCode}
						loadMore={this.loadCodes}
					/>
				}
				{(isLoading && codes.length <= 0)
					&&
					<CodeShimmer />}
				{codes.length === 0 && isLoaded &&
					<p>{t('code.no-saved-code-title')}</p>
				}
				{
					codes.length > 0 &&
					<div
						className={`bottom-loading ${this.state.isLoading ? 'active' : ''}`}
					>
						<LoadingOverlay size={30} />
					</div>
				}
			</div>
		);
	}
}

const mapDispatchToProps = {
	getCodesInternal,
	emptyCodes,
};

export default connect(null, mapDispatchToProps, null, { withRef: true })(Radium(Codes));
