// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Radium from 'radium';

// Material UI components
import { Paper, TextField, FlatButton } from 'material-ui';
import ChipInput from 'material-ui-chip-input';

// Redux modules
import { connect } from 'react-redux';
import { addQuestion } from 'actions/discuss';

// i18n
import { translate } from 'react-i18next';

// Service
import Service from 'api/service';
import { getMentionsList } from 'utils';

// Additional components
import Layout from 'components/Layouts/GeneralLayout';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import MentionInput from 'components/Shared/MentionInput';

import 'styles/Discuss/NewQuestion.scss';
import { NewQuestionStyles as styles } from './styles';

const mapDispatchToProps = { addQuestion };

@connect(null, mapDispatchToProps)
@translate()
class NewQuestion extends Component {
	constructor() {
		super();
		document.title = 'Create a new question';
		this.maxQuestionLength = 1024;
		this.maxTitleLength = 128;
		this.state = {
			title: '',
			titleErrorText: '',
			tags: [],
			tagsErrorText: '',
			suggestions: [],
			isLoading: false,
			isReplyBoxOpen: false,
			replyLength: 0,
		};
	}

	// Detect title change
	onTitleChange = (_, title) => {
		this.setState({ title });
		if (title.length > 0 && this.state.titleErrorText !== '') {
			this.setState({ titleErrorText: '' });
		}
	}

	// Collect tags into one array
	handleTagsChange = (newTag) => {
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
		if (query.length < 2) {
			this.setState({ suggestions: [] });
		} else {
			const { tags: suggestions } = await Service.request('Discussion/getTags', { query });
			this.setState({ suggestions });
		}
	}

	handleBlur = ({ target: { value } }) => {
		if (value) {
			const { tags } = this.state;
			this.setState({ tags: tags.concat(value) });
		}
	}

	// Add question form submit
	handleSubmit = async (e) => {
		const { t } = this.props;
		e.preventDefault();
		const allowSubmit = this.state.title.length !== 0 && this.state.tags.length !== 0;
		if (!allowSubmit) {
			this.setState({
				titleErrorText: this.state.title.length === 0 ? t('question.invalid-title') : '',
				tagsErrorText: this.state.tags.length === 0 ? t('question.empty-tags') : '',
			});
		} else {
			this.setState({ isLoading: true });
			try {
				const { id, alias } = await this.props.addQuestion(
					this.state.title,
					this.mentionInput.popValue(),
					this.state.tags,
				);
				browserHistory.push(`/discuss/${id}/${alias}`);
			} catch (err) {
				console.log(err);
			}
		}
	}
	// Customly render tag
	renderChip = ({ value }, key) => (
		<div key={key} style={styles.tag}>{value}</div>
	)

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
	save = () => {
		this.props.save(this.mentionInput.popValue());
	}

	render() {
		const { t } = this.props;
		const { isReplyBoxOpen, replyLength } = this.state;
		return (
			<Layout>
				<Paper className="new-question" id="new-question" style={styles.container}>
					{this.state.isLoading && <LoadingOverlay />}
					<h2 style={styles.heading}>{t('question.title')}</h2>
					<form onSubmit={this.handleSubmit}>
						<div className="question-data" style={styles.questionData}>
							<TextField
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
								onFocus={this.openReplyBox}
								onBlur={this.handleBlur}
								onLengthChange={this.onLengthChange}
								getUsers={getMentionsList('discuss', {})}
								submit={this.props.save}
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
								// fullWidthInput
								value={this.state.tags}
								style={styles.textField}
								onBlur={this.handleBlur}
								newChipKeyCodes={[ 13, 32 ]}
								chipRenderer={this.renderChip}
								dataSource={this.state.suggestions}
								errorText={this.state.tagsErrorText}
								onRequestAdd={this.handleTagsChange}
								onUpdateInput={this.handleUpdateInput}
								onRequestDelete={this.handleDeleteTag}
								floatingLabelText={t('question.tags-placeholder')}
							/>
						</div>
						<div className="editor-actions" style={styles.editorActions}>
							<FlatButton type="submit" label={t('common.post-action-title')} primary />
						</div>
					</form>
				</Paper>
			</Layout>
		);
	}
}

export default NewQuestion;
