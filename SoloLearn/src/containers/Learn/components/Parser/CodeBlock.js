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
		const { location, format, courseLanguage } = this.props;
		const codeLanguage = format || courseLanguage;
		browserHistory.replace({ ...location, query: { ...location.query, language: codeLanguage } });
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
			format,
			location,
			courseLanguage,
		} = this.props;
		const { language } = location.query;
		const codeLanguage = format || courseLanguage;

		const { playgroundOpened } = this.state;
		return codeId !== undefined ?
			(
				<Container className="code-container">
					{playgroundOpened ?
						<Playground
							inline
							codeId={codeId}
							basePath={basePath}
							language={language}
							lessonCodeId={codeId || null}
							onClose={this.closePlayground}
						/> :
						<FlexBox column style={{ position: 'relative' }}>
							<LanguageLabel language={codeLanguage} className="language-label">
								{codeLanguage}
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
