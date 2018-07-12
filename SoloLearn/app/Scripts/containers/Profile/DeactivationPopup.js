import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Service from 'api/service';

@translate()
class ReportPopup extends PureComponent {
	constructor() {
		super();
		this.customReasonMaxLength = 256;
		this.state = {
			reportReason: 11,
			customReason: '',
		};
	}

	handleReasonChange = (_, reportReason) => {
		this.setState({ reportReason });
	}

	handleCustomReasonChange = (_, customReason) => {
		if (customReason.length <= this.customReasonMaxLength) {
			this.setState({ customReason });
		}
	}

	submitReport = async () => {
		const {
			itemType,
			accessLevel,
			onRequestClose,
			reportedUserId,
			onSubmitFinished,
		} = this.props;
		const { reportReason, customReason } = this.state;
		try {
			if (accessLevel > 1) {
				await Service.request('Profile/DeactivateUser', {
					reason: reportReason,
					userId: reportedUserId,
					message: customReason,
				});
			} else {
				await Service.request('ReportItem', {
					itemType,
					reason: reportReason,
					message: customReason,
					itemId: reportedUserId,
				});
			}
			this.setState({
				reportReason: 11,
				customReason: '',
			});
			if (typeof onSubmitFinished === 'function') {
				onSubmitFinished();
			}
			onRequestClose();
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		const { reportReason, customReason } = this.state;
		const { onRequestClose, open, t } = this.props;
		const actions = [
			<FlatButton
				primary
				onClick={onRequestClose}
				label={t('common.cancel-title')}
			/>,
			<FlatButton
				primary
				onClick={() => this.submitReport()}
				label={t('common.deactivate-action-title')}
			/>,
		];
		return (
			<Dialog
				open={open}
				actions={actions}
				onRequestClose={onRequestClose}
				title={t('deactivate.deactivate-popup-title')}
			>
				<RadioButtonGroup
					name="deactivateReason"
					defaultSelected={11}
					onChange={this.handleReasonChange}
				>
					<RadioButton
						value={11}
						label={t('deactivate.deactivate-option-1')}
					/>
					<RadioButton
						value={12}
						label={t('deactivate.deactivate-option-2')}
					/>
					<RadioButton
						value={13}
						label={t('deactivate.deactivate-option-3')}
					/>
					<RadioButton
						value={14}
						label={t('deactivate.deactivate-option-4')}
					/>
					<RadioButton
						value={0}
						label={t('deactivate.deactivate-option-5')}
					/>
				</RadioButtonGroup>
				{reportReason === 0 &&
					<div>
						<TextField
							value={customReason}
							onChange={this.handleCustomReasonChange}
							floatingLabelText={t('common.report-more-hint')}
						/>
						<span>{customReason.length} / {this.customReasonMaxLength}</span>
					</div>
				}
			</Dialog>
		);
	}
}

export default ReportPopup;
