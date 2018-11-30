import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Container, FlexBox } from 'components/atoms';
import { FlatButton, LanguageLabel } from 'components/molecules';
import Playground from 'containers/Playground/AsyncPlayground';

@translate()
class CodeBlock extends Component {
	state = {
		playgroundOpened: false,
	}

	togglePlayground = () => {
		this.setState(({ playgroundOpened }) => ({ playgroundOpened: !playgroundOpened }));
	}

	render() {
		const {
			t,
			children,
			codeId,
			basePath,
			courseLanguage,
		} = this.props;

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
								language={courseLanguage}
								lessonCodeId={codeId || null}
							/>
							<FlatButton
								className="code-button"
								onClick={this.togglePlayground}
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
								onClick={this.togglePlayground}
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
