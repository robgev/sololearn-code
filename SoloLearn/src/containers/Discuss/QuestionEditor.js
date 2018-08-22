// React modules
import React, { Component } from 'react';

// Material UI components
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import ChipInput from 'material-ui-chip-input';

// i18n
import { translate } from 'react-i18next';

// Service
import Service from 'api/service';

// Additional components
import MentionInput from 'components/MentionInput';

import 'styles/Discuss/NewQuestion.scss';
import { NewQuestionStyles as styles } from './styles';

@translate()
class QuestionEditor extends Component {
	constructor(props) {
		super(props);
		this.maxQuestionLength = 1024;
		this.maxTitleLength = 128;
		const { post } = props;
		this.state = {
			title: post !== null ? post.title : '',
			titleErrorText: '',
			tags: post !== null ? post.tags : [],
			tagsErrorText: '',
			suggestions: [],
			isReplyBoxOpen: false,
			replyLength: 0,
		};
	}

	static Chip = ({ value, handleRequestDelete, defaultStyle }, key) => (
		<Chip style={defaultStyle} key={key} onRequestDelete={handleRequestDelete}>{value}</Chip>
	)

	// Detect title change
	onTitleChange = (_, title) => {
		this.setState({ title });
		if (title.length > 0 && this.state.titleErrorText !== '') {
			this.setState({ titleErrorText: '' });
		}
	}

	// Collect tags into one array
	addTag = (newTag) => {
		const { tags } = this.state;
		this.setState({ tags: [ ...tags, newTag ] });
	}

	handleDeleteTag = (tag) => {
		this.setState(s => ({ tags: s.tags.filter(t => t !== tag) }));
	}

	// Get search suggestions
	handleUpdateInput = async (query) => {
		if (query.length > 0) {
			this.setState({ tagsErrorText: '' });
		}
		if (query.length < 2 && this.state.suggestions.length > 0) {
			this.setState({ suggestions: [] });
		} else {
			const { tags: suggestions } = await Service.request('Discussion/getTags', { query });
			this.setState({ suggestions });
		}
	}

	// Add question form submit
	handleSubmit = () => {
		const { t } = this.props;
		const allowSubmit = this.state.title.length !== 0 && this.state.tags.length !== 0;
		if (!allowSubmit) {
			this.setState({
				titleErrorText: this.state.title.length === 0 ? t('question.invalid-title') : '',
				tagsErrorText: this.state.tags.length === 0 ? t('question.empty-tags') : '',
			});
		} else {
			this.props.submit(
				this.state.title,
				this.mentionInput.getValue(),
				this.state.tags,
			);
		}
	}

	// Customly render tag
	handleChipBlur = (e) => {
		const { value } = e.currentTarget;
		if (value !== '') {
			this.setState(s => ({ tags: [ ...s.tags, value ] }));
		}
	}

	/* Mention input functions */
	openReplyBox = () => {
		this.setState({ isReplyBoxOpen: true });
	}
	closeReplyBox = () => {
		this.setState({ isReplyBoxOpen: false });
	}
	handleBlur = () => {
		if (this.state.replyLength <= 1) { this.closeReplyBox(); }
	}
	onLengthChange = (replyLength) => {
		if (this.mentionInput) {
			this.setState({ replyLength });
		}
	}
	/* End mention input functions */

	render() {
		const { t } = this.props;
		const { isReplyBoxOpen, replyLength } = this.state;
		return (
			<Paper className="new-question" id="new-question" style={styles.container}>
				<h2 style={styles.heading}>{t('question.title')}</h2>
				<div onSubmit={this.handleSubmit}>
					<div className="question-data" style={styles.questionData}>
						<TextField
							multiLine
							fullWidth
							value={this.state.title}
							style={styles.textField}
							onChange={this.onTitleChange}
							errorText={this.state.titleErrorText}
							floatingLabelText={t('question.title-placeholder')}
							maxLength={this.maxTitleLength}
						/>
						<span
							style={styles.textFieldCoutner}
						>
							{this.state.title.length} / {this.maxTitleLength}
						</span>
					</div>
					<div className="question-data" style={styles.questionData}>
						<MentionInput
							ref={(input) => { this.mentionInput = input; }}
							initText={this.props.post !== null ? this.props.post.message : null}
							onFocus={this.openReplyBox}
							onBlur={this.handleBlur}
							onLengthChange={this.onLengthChange}
							getUsers={{ type: 'discuss' }}
							placeholder={!isReplyBoxOpen && replyLength === 0 ? t('question.message-placeholder') : ''}
							maxLength={this.maxQuestionLength}
						/>
						<span
							style={styles.textFieldCoutner}
						>
							{replyLength} / {this.maxQuestionLength}
						</span>
					</div>
					<div className="question-data" style={styles.questionData}>
						<ChipInput
							fullWidth
							value={this.state.tags}
							style={styles.textField}
							onBlur={this.handleChipBlur}
							newChipKeyCodes={[ 13, 32 ]}
							chipRenderer={QuestionEditor.Chip}
							dataSource={this.state.suggestions}
							errorText={this.state.tagsErrorText}
							onRequestAdd={this.addTag}
							onUpdateInput={this.handleUpdateInput}
							onRequestDelete={this.handleDeleteTag}
							floatingLabelText={t('question.tags-placeholder')}
						/>
					</div>
					<div className="editor-actions" style={styles.editorActions}>
						<FlatButton type="submit" label={t('common.post-action-title')} primary onClick={this.handleSubmit} />
					</div>
				</div>
			</Paper>
		);
	}
}

QuestionEditor.defaultProps = {
	post: null,
};

export default QuestionEditor;
