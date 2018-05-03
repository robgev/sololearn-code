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

import { NewQuestionStyles as styles } from './styles';

const mapDispatchToProps = { addQuestion };

@connect(null, mapDispatchToProps)
@translate()
@Radium
class NewQuestion extends Component {
	constructor() {
		super();
		document.title = 'Create a new question';
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
		this.setState({ title: e.target.value });
	}

	// Detect title change
	onMessageChange = (e) => {
		this.setState({ message: e.target.value });
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
			<Paper id="new-question" style={styles.container}>
				{this.state.isLoading && <LoadingOverlay />}
				<h2 style={styles.heading}>{t('question.title')}</h2>
				<form onSubmit={this.handleSubmit}>
					<div className="question-data" style={styles.questionData}>
						<TextField
							floatingLabelText={t('question.title-placeholder')}
							fullWidth
							defaultValue={this.state.title}
							errorText={this.state.titleErrorText}
							onChange={e => this.onTitleChange(e)}
							style={styles.textField}
						/>
						<span
							style={styles.textFieldCoutner}
						>
							{this.state.title.length} / 128
						</span>
					</div>
					<div className="question-data" style={styles.questionData}>
						<TextField
							floatingLabelText={t('question.message-placeholder')}
							multiLine
							rowsMax={4}
							fullWidth
							defaultValue={this.state.message}
							onChange={e => this.onMessageChange(e)}
							style={styles.textField}
						/>
						<span
							style={styles.textFieldCoutner}
						>
							{this.state.message.length} / 512
						</span>
					</div>
					<div className="question-data" style={styles.questionData}>
						<ChipInput
							fullWidth
							fullWidthInput
							value={this.state.tags}
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
