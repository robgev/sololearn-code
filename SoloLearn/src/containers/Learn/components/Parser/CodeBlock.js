import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { browserHistory, withRouter } from 'react-router';
import { Container, FlexBox } from 'components/atoms';
import { FlatButton, LanguageLabel } from 'components/molecules';
import Playground from 'containers/Playground/AsyncPlayground';

@withRouter
@translate()
class CodeBlock extends Component {
	state = {
		playgroundOpened: false,
	}

	openPlayground = () => {
		const { location, courseLanguage } = this.props;
		browserHistory.replace({ ...location, query: { ...location.query, language: courseLanguage } });
		this.setState(({ playgroundOpened }) => ({ playgroundOpened: !playgroundOpened }));
	}

	closePlayground = () => {
		const { location } = this.props;
		const { language, ...queryRest } = location.query;
		browserHistory.replace({ ...location, query: queryRest });
		this.setState(({ playgroundOpened }) => ({ playgroundOpened: !playgroundOpened }));
	}

	render() {
		const {
			t,
			children,
			codeId,
			basePath,
			location,
			courseLanguage,
		} = this.props;
		const { language } = location.query;

		const { playgroundOpened } = this.state;
		return codeId !== undefined ?
			(
				<Container className="code-container">
					{playgroundOpened ?
						<FlexBox column>
							<Playground
								inline
								codeId={codeId}
								basePath={basePath}
								language={language}
								lessonCodeId={codeId || null}
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
			)
			: children;
	}
}

export default CodeBlock;
