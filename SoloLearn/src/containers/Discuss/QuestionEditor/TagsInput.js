import React, { Component } from 'react';
import { translate } from 'react-i18next';
import Autosuggest from 'react-autosuggest';
import MUIChipInput from 'material-ui-chip-input';

import { MenuItem, PaperContainer, Chip } from 'components/atoms';
import { Close } from 'components/icons';

import Service from 'api/service';

@translate()
class TagsInput extends Component {
	state = {
		suggestions: [],
		value: '',
	};

	static maxTagLength = 24;

	static SuggestionsContainer = ({ containerProps, children }) => (
		<PaperContainer {...containerProps}>
			{children}
		</PaperContainer>
	);

	static Input = ({
		classes, autoFocus, value, onChange, onAdd, onDelete, tags, ref, ...other
	}) => (
		<MUIChipInput
			allowDuplicates
			fullWidth
			blurBehavior="add"
			delayBeforeAdd
			newChipKeyCodes={[ 13, 32 ]}
			onUpdateInput={onChange}
			onAdd={onAdd}
			onDelete={onDelete}
			errorText="armen"
			value={tags}
			inputRef={ref}
			InputProps={{
				value,
			}}
			classes={classes}
			{...other}
		/>
	);

	static Suggestion = suggestion => (
		<MenuItem>
			{suggestion}
		</MenuItem>
	);

	static Chip = ({ value, handleDelete, className }, key) => (
		<Chip
			className={className}
			label={`#${value}`}
			key={key}
			onDelete={handleDelete}
			classes={{ label: 'tags-label' }}
			deleteIcon={<Close className="tags-delete-icon" />}
		/>
	);

	static getSuggestionValue = suggestion => suggestion

	getSuggestions = ({ value }) => {
		if (value.length > 1) {
			Service.request('Discussion/GetTags', { query: value })
				.then(({ tags }) => {
					this.setState({ suggestions: tags.slice(0, 5) });
				});
		}
	};

	clearSuggestions = () => {
		this.setState({ suggestions: [] });
	};

	addTag = (tag) => {
		if (this.props.addTag(tag)) {
			this.setState({ value: '' });
		}
	};

	selectSuggestion = (e, { suggestionValue }) => {
		this.addTag(suggestionValue);
		e.preventDefault();
	};

	deleteTag = (tag) => {
		this.props.deleteTag(tag);
	};

	onChange = (e, { newValue }) => {
		if (this.props.canAddTag) {
			if (newValue.length <= TagsInput.maxTagLength) {
				this.setState({ value: newValue.replace(/\s/g, '') });
			} else {
				this.addTag(newValue);
			}
		}
	};

	render() {
		const {
			suggestions, value,
		} = this.state;
		const { error, tags, helperText } = this.props;
		return (
			<Autosuggest
				suggestions={suggestions}
				onSuggestionsFetchRequested={this.getSuggestions}
				onSuggestionsClearRequested={this.clearSuggestions}
				onSuggestionSelected={this.selectSuggestion}
				getSuggestionValue={TagsInput.getSuggestionValue}
				renderSuggestion={TagsInput.Suggestion}
				renderSuggestionsContainer={TagsInput.SuggestionsContainer}
				renderInputComponent={TagsInput.Input}
				inputProps={{
					variant: 'outlined',
					tags,
					value,
					onAdd: this.addTag,
					onDelete: this.deleteTag,
					onChange: this.onChange,
					newChipKeyCodes: [ 13, 32 ],
					error,
					chipRenderer: TagsInput.Chip,
					helperText,
					className: 'autosuggest-input',
					classes: {
						inputRoot: 'tags-input-root',
						input: 'tags-input',
						helperText: 'tags-helper-text',
						chipContainer: 'tags-chip-container',
						chip: 'tags-chip',
					},
				}}
			/>
		);
	}
}

export default TagsInput;
