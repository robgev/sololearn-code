import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Container, CircularProgress } from 'components/atoms';
import { FlatButton, LanguageLabel } from 'components/molecules';
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
				<Container className="code-container" style={styles.codeContainer}>
					{playgroundOpened ?
						<Container>
							<Playground
								inline
								codeId={codeId}
								basePath={basePath}
								params={playgroundParams}
								loadingComponent={<CircularProgress style={{ display: 'block', margin: '0 auto' }} />}
							/>
							<FlatButton
								style={styles.codeButton}
								className="shortcut-button"
								onClick={this.closePlayground}
								labelStyle={styles.codeButtonLabel}
							>
								{t('common.close-title')}
							</FlatButton>
						</Container> :
						<Container style={{ position: 'relative' }}>
							<LanguageLabel language={courseLanguage}>
								{courseLanguage}
							</LanguageLabel>
							{children}
							<FlatButton
								style={styles.codeButton}
								className="shortcut-button"
								onClick={this.openPlayground}
								labelStyle={styles.codeButtonLabel}
							>
								{t('learn.try-it-yourself')}
							</FlatButton>
						</Container>
					}
				</Container>
			);
		}

		return children;
	}
}

export default translate()(CodeBlock);
