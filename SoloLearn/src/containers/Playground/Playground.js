import React, { Component, Fragment } from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { Container, PaperContainer, TextBlock, FlexBox } from 'components/atoms';
import { Layout, EmptyCard, FloatingActionButton } from 'components/molecules';
import { Run, Code } from 'components/icons';
import Comments from 'containers/Comments/CommentsBase';
import SignInPopup from 'components/SignInPopup';
import IPlayground from './IPlayground';
import {
	Editor,
	SplitPane,
	CodeOutput,
	InputPopup,
	CodeInfoToolbar,
} from './components';
import Storage from 'api/storage';
import './styles.scss';

@translate()
@observer
class Playground extends Component {
state={
	openSigninPopup: false,
}

constructor(props) {
	super(props);
	const unsaveCode = Storage.load('code');

	this.playground = new IPlayground({
		inline: this.props.inline,
		userId: this.props.userId,
		publicId: this.props.publicId === 'new' ? null : this.props.publicId,
		language: this.props.language,
		lessonCodeId: this.props.lessonCodeId,
	});

	this.playground.getCode(unsaveCode && unsaveCode.id === this.props.publicId ? unsaveCode.data : null);
	ReactGA.ga('send', 'screenView', { screenName: 'Code Editor Page' });
}

componentWillReceiveProps(nextProps) {
	if (nextProps.language !== this.playground.language) {
		this.playground.changeLanguage(nextProps.language);
	}
}

	toggleSigninPopup=() => {
		this.setState(({ openSigninPopup }) => ({ openSigninPopup: !openSigninPopup }));
	}

	render() {
		const {
			data,
			isInline,
			publicId,
			isFetching,
			isFullscreen,
			isOutputOpen,
			hasLiveOutput,
		} = this.playground;
		const { t } = this.props;
		// If it's not a public code or we are not in fullscreen mode
		// We don't need some of the elements on the page.
		const isMinimal = !data.id || isInline || !publicId;
		const LayoutContainer = isInline ? Container : Layout;
		const MainContainer = isInline ? Container : PaperContainer;
		const EditorContainer = !hasLiveOutput ? SplitPane : Fragment;
		const fullScreenCN = isInline ? '' : 'fullscreen';
		const sidebarCN = (isFullscreen || isMinimal) ? 'no-sidebar' : '';
		const { openSigninPopup } = this.state;

		return (
			<LayoutContainer className={`${fullScreenCN} ${sidebarCN}`}>
				{isFetching
					? <EmptyCard className="playground_full-loading" loading />
					: (
						<Fragment>
							<MainContainer className={`playground_main-container ${isInline ? 'bordered' : ''}`}>
								<EditorContainer
									playground={this.playground}
								>
									<Editor onClose={this.props.onClose} playground={this.playground} toggleSigninPopup={this.toggleSigninPopup} />
									<CodeOutput playground={this.playground} />
								</EditorContainer>
								{ !(hasLiveOutput && isOutputOpen)
									? (
										<FloatingActionButton
											color="primary"
											alignment="right"
											className="playground_run-button"
											onClick={this.playground.isWeb
												? this.playground.runWebCode
												: this.playground.runCompiledCode
											}
										>
											<Run />
											<TextBlock className="playground_run-text">Run</TextBlock>
										</FloatingActionButton>
									)
									: (
										<FloatingActionButton
											color="primary"
											alignment="right"
											className="playground_run-button"
											onClick={this.playground.hideOutput}
										>
											<Code />
											<TextBlock className="playground_run-text">{t('code.title')}</TextBlock>
										</FloatingActionButton>
									)
								}

								<InputPopup playground={this.playground} />
							</MainContainer>
							{!(isMinimal || isFullscreen) &&
								<FlexBox column className="playground_sidebar scrollbar">
									<CodeInfoToolbar
										playground={this.playground}
										toggleSigninPopup={this.toggleSigninPopup}
									/>
									<Comments
										type={1}
										id={data.id}
										toggleSigninPopup={this.toggleSigninPopup}
										useWindow={false}
										commentsType="code"
										commentsCount={data.comments}
									/>
								</FlexBox>
							}
						</Fragment>
					)
				}
				<SignInPopup
					url={`/playground/${publicId}`}
					open={openSigninPopup}
					onClose={this.toggleSigninPopup}
				/>
			</LayoutContainer>
		);
	}
}

Playground.propTypes = {
	inline: PropTypes.bool,
	userId: PropTypes.number.isRequired,
	publicId: PropTypes.string,
	language: PropTypes.string,
	lessonCodeId: PropTypes.string,
};

Playground.defaultProps = {
	inline: false,
	publicId: null,
	language: null,
	lessonCodeId: null,
};

export default Playground;
