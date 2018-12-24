import React, { Component } from 'react';
import { translate } from 'react-i18next';
import {
	Popup,
	Input,
	Select,
	MenuItem,
	PopupTitle,
	PopupActions,
	PopupContent,
	PopupContentText,
} from 'components/atoms';
import { FlatButton } from 'components/molecules';
import { externalResources } from 'containers/Playground/utils/Texts';

@translate()
class ExternalResourcePopup extends Component {
	state = {
		sourceUrl: '',
		selectedSource: '',
	}

	onConfirm = () => {
		const { sourceUrl } = this.state;
		this.props.playground.addExternalResource({ sourceUrl });
		this.props.onClose();
	}

	onSelect = (e) => {
		const selectedSource = e.target.value;
		// Keep input field value independent of select
		this.setState({ selectedSource, sourceUrl: selectedSource });
	}

	onChange = (e) => {
		const sourceUrl = e.target.value;
		const { selectedSource } = this.state;
		// Reset select value when input is empty
		this.setState({ sourceUrl, selectedSource: !sourceUrl ? '' : selectedSource });
	}

	render() {
		const {
			t,
			open,
			onClose,
		} = this.props;
		const { sourceUrl, selectedSource } = this.state;
		return (
			<Popup
				open={open}
				onClose={onClose}
			>
				<PopupTitle>External Resources</PopupTitle>
				<PopupContent>
					<PopupContentText>Choose the resource to add</PopupContentText>
					<Select
						displayEmpty
						value={selectedSource}
						onChange={this.onSelect}
					>
						<MenuItem value="">None</MenuItem>
						<MenuItem value={externalResources.jquery}>jQuery</MenuItem>
						<MenuItem value={externalResources.jqueryui}>jQuery UI</MenuItem>
					</Select>
					<Input
						fullWidth
						value={sourceUrl}
						onChange={this.onChange}
						label="External resource url"
					/>
				</PopupContent>
				<PopupActions>
					<FlatButton
						onClick={onClose}
						color="secondary"
					>
						{t('common.cancel-title')}
					</FlatButton>
					<FlatButton
						color="primary"
						onClick={this.onConfirm}
						disabled={!sourceUrl.trim()}
					>
						{t('common.add-action-title')}
					</FlatButton>
				</PopupActions>
			</Popup>
		);
	}
}

export default ExternalResourcePopup;
