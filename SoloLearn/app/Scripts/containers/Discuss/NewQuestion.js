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

// Additional components
import LoadingOverlay from 'components/Shared/LoadingOverlay';

import 'styles/Discuss/NewQuestion.scss';
import { NewQuestionStyles as styles } from './styles';

const mapDispatchToProps = { addQuestion };

@connect(null, mapDispatchToProps)
@translate()
@Radium
class NewQuestion extends Component {
	constructor() {
		super();
		document.title = 'Create a new question';
		this.maxQuestionLength = 1024;
		this.maxTitleLength = 128;
		this.state = {
			title: '',
			titleErrorText: '',
			message: '',
			tags: [],
			tagsErrorText: '',
			suggestions: [],
			isLoading: false,
		};
	}

	// Detect title change
	onTitleChange = (e) => {
		if (e.target.value.length <= this.maxTitleLength) {
			this.setState({ title: e.target.value });
		}
	}

	// Detect title change
	onMessageChange = (e) => {
		if (e.target.value.length <= this.maxQuestionLength) {
			this.setState({ message: e.target.value });
		}
	}

	// Collect tags into one array
	handleTagsChange = (newTag) => {
		const { tags } = this.state;
		this.setState({ tags: [ ...tags, newTag ] });
	}

	// Get search suggestions
	handleUpdateInput = async (query) => {
		if (query.length < 2) return;
		try {
			const { tags: suggestions } = await Service.request('Discussion/getTags', { query });
			this.setState({ suggestions });
		} catch (e) {
			console.log(e);
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
					this.state.message,
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

	render() {
		const { t } = this.props;
		return (
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
						/>
						<span
							style={styles.textFieldCoutner}
						>
							{this.state.title.length} / { this.maxTitleLength }
						</span>
					</div>
					<div className="question-data" style={styles.questionData}>
						<TextField
							multiLine
							fullWidth
							rowsMax={4}
							style={styles.textField}
							value={this.state.message}
							onChange={e => this.onMessageChange(e)}
							floatingLabelText={t('question.message-placeholder')}
						/>
						<span
							style={styles.textFieldCoutner}
						>
							{this.state.message.length} / {this.maxQuestionLength}
						</span>
					</div>
					<div className="question-data" style={styles.questionData}>
						<ChipInput
							fullWidth
							fullWidthInput
							value={this.state.tags}
							style={styles.textField}
							onBlur={this.handleBlur}
							newChipKeyCodes={[ 13, 32 ]}
							chipRenderer={this.renderChip}
							dataSource={this.state.suggestions}
							errorText={this.state.tagsErrorText}
							onRequestAdd={this.handleTagsChange}
							onUpdateInput={this.handleUpdateInput}
							floatingLabelText={t('question.tags-placeholder')}
						/>
					</div>
					<div className="editor-actions" style={styles.editorActions}>
						<FlatButton type="submit" label={t('common.post-action-title')} primary />
					</div>
				</form>
			</Paper>
		);
	}
}

export default NewQuestion;
