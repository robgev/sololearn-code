import React, { Component } from 'react';
import { Editor, EditorState, Modifier, CompositeDecorator } from 'draft-js';
import { Paper, RaisedButton, FlatButton } from 'material-ui';
import Layout from 'components/Layouts/GeneralLayout';
import QuizSelector from 'containers/Challenges/Challenge/Game/TypeSelector';
import ChooseLanugage from '../components/ChooseLanguage';

import './style.scss';

const markedStrategy = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges((character) => {
		const entityKey = character.getEntity();
		return (
			entityKey !== null &&
			contentState.getEntity(entityKey).getType() === 'MARKED'
		);
	}, callback);
};

const Marked = ({ children }) => <span className="marked">{children}</span>;

class SuggestFillIn extends Component {
	state = {
		language: null,
		isLanguageSelectorOpen: false,
		question: 'Fill in the blanks to ',
		editorState: EditorState.createEmpty(new CompositeDecorator([
			{ strategy: markedStrategy, component: Marked },
		])),
		isPreviewOpen: false,
	}
	toggleLanguageSelector = () => {
		this.setState(state => ({ isLanguageSelectorOpen: !state.isLanguageSelectorOpen }));
	}
	selectLanguage = (language) => {
		this.setState({ language });
		this.toggleLanguageSelector();
	}
	onQuestionChange = (e) => {
		this.setState({ question: e.target.value });
	}
	onEditorChange = (editorState) => {
		this.setState({ editorState });
	}
	focusEditor = () => {
		this.editor.focus();
	}
	hasSelection = (editorState) => {
		const selection = editorState.getSelection();
		const start = selection.getStartOffset();
		const end = selection.getEndOffset();
		return start !== end;
	}
	markHighlighted = () => {
		const { editorState } = this.state;
		if (this.hasSelection(editorState)) {
			const contentState = editorState.getCurrentContent();
			const contentStateWithEntity = contentState.createEntity(
				'MARKED',
				'MUTABLE',
			);
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
			const contentStateWithMarked = Modifier.applyEntity(
				contentStateWithEntity,
				editorState.getSelection(),
				entityKey,
			);
			this.setState({
				editorState: EditorState.set(editorState, { currentContent: contentStateWithMarked }),
			});
		}
	}
	render() {
		const {
			isLanguageSelectorOpen, language, question, editorState, isPreviewOpen,
		} = this.state;
		return (
			<Layout>
				<div className="quiz-factory">
					<Paper onClick={this.toggleLanguageSelector} className="selected-language container">
						<span className="title">Language</span>
						<div className="with-image">
							<span className="language-name">{language === null ? 'Select' : language.languageName}</span>
							<img src="/assets/keyboard_arrow_right.svg" alt="" />
						</div>
					</Paper>
					<Paper className="question container">
						<span className="title">Question</span>
						<textarea value={question} onChange={this.onQuestionChange} placeholder="Type in Your Question" />
					</Paper>
					<Paper className="container editor-box">
						<div className="title-with-button">
							<span className="title">Code</span>
							<FlatButton label="Mark" secondary onClick={this.markHighlighted} />
						</div>
						<div className="editor" onClick={this.focusEditor} role="button" tabIndex={0}>
							<Editor
								ref={(editor) => { this.editor = editor; }}
								editorState={editorState}
								onChange={this.onEditorChange}
								customStyleMap={
									{
										MARKED: {
											backgroundColor: 'blue',
										},
									}
								}
							/>
						</div>
					</Paper>
					<RaisedButton label="Preview" fullWidth primary />
					<RaisedButton
						className="preview-button"
						label="Submit"
						fullWidth
						primary
					/>
					{
						isPreviewOpen
							? <QuizSelector quiz={this.makeQuiz()} />
							: null
					}
				</div>
				<ChooseLanugage
					open={isLanguageSelectorOpen}
					onClose={this.toggleLanguageSelector}
					onChoose={this.selectLanguage}
				/>
			</Layout>
		);
	}
}

export default SuggestFillIn;
