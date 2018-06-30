import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import Playground from 'containers/Playground/Playground';

// i18n
import { translate } from 'react-i18next';

const styles = {
	codeContainer: {
		overflow: 'hidden',
		margin: '10px 0',
		padding: '5px 0 15px',
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
		margin: '0 20px 0 0',
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
			text,
			codeId,
			format,
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
					{ playgroundOpened ?
						<div>
							<Playground
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
							<span className="code-block" data-codeid={codeId} style={styles.codeBlock}>
								<span className={`code ${format}`} style={styles.code} dangerouslySetInnerHTML={{ __html: text }} />
							</span>
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

		return (
			<div className="code-block" style={styles.codeBlock}>
				<span className={`code${format}`} style={styles.code} dangerouslySetInnerHTML={{ __html: text }} />
			</div>
		);
	}
}

export default translate()(CodeBlock);
