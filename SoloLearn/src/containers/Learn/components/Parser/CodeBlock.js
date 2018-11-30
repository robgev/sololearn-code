import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { Container, FlexBox } from 'components/atoms';
import { FlatButton, LanguageLabel } from 'components/molecules';
import Playground from 'containers/Playground/AsyncPlayground';

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
				<Container className="code-container">
					{playgroundOpened ?
						<FlexBox column>
							<Playground
								inline
								lessonCodeId={codeId}
								language={courseLanguage}
							// basePath={basePath}
							// params={playgroundParams}
							/>
							<FlatButton
								className="code-button"
								onClick={this.closePlayground}
							>
								{t('common.close-title')}
							</FlatButton>
						</FlexBox> :
						<FlexBox column style={{ position: 'relative' }}>
							<LanguageLabel language={courseLanguage} className="language-label">
								{courseLanguage}
							</LanguageLabel>
							{children}
							<FlatButton
								className="code-button"
								onClick={this.openPlayground}
							>
								{t('learn.try-it-yourself')}
							</FlatButton>
						</FlexBox>
					}
				</Container>
			);
		}

		return children;
	}
}

export default translate()(CodeBlock);
