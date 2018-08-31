import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import Playground from 'containers/Playground/AsyncPlayground';

// i18n
import { translate } from 'react-i18next';

const styles = {
	codeContainer: {
		overflow: 'hidden',
		margin: '10px 0',
		padding: '5px 0 5px',
	},

	codeBlock: {
		border: 'solid 1px #ddd',
		margin: '10px 20px',
		background: '#ecf0f1',
		display: 'block',
	},

	code: {
		borderLeft: '5px solid #589d32',
		padding: '10px',
		display: 'block',
		whiteSpace: 'pre-wrap',
	},

	codeButton: {
		float: 'right',
	},

	codeButtonLabel: {
		fontSize: '13px',
	},
};

class CodeBlock extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playgroundOpened: false,
		};
	}

	openPlayground = () => {
		const { basePath } = this.props;
		browserHistory.replace(basePath);
		this.setState({ playgroundOpened: true });
	}

	closePlayground = () => {
		const { basePath } = this.props;
		this.setState({ playgroundOpened: false });
		browserHistory.replace(basePath);
	}

	render() {
		const {
			t,
			children,
			codeId,
			basePath,
			courseLanguage,
		} = this.props;
		const playgroundParams = {
			primary: courseLanguage,
			secondary: codeId,
		};

		const { playgroundOpened } = this.state;
		if (codeId !== undefined) {
			return (
				<div className="code-container" style={styles.codeContainer}>
					{playgroundOpened ?
						<div>
							<Playground
								inline
								codeId={codeId}
								basePath={basePath}
								params={playgroundParams}
							/>
							<FlatButton
								label={t('common.close-title')}
								style={styles.codeButton}
								className="shortcut-button"
								onClick={this.closePlayground}
								labelStyle={styles.codeButtonLabel}
							/>
						</div> :
						<div>
							{children}
							<FlatButton
								label={t('learn.try-it-yourself')}
								style={styles.codeButton}
								className="shortcut-button"
								onClick={this.openPlayground}
								labelStyle={styles.codeButtonLabel}
							/>
						</div>
					}
				</div>
			);
		}

		return children;
	}
}

export default translate()(CodeBlock);
