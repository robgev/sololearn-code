import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import Dialog from 'components/StyledDialog';
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
			reportReason: 1,
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
			itemId,
			itemType,
			onRequestClose,
		} = this.props;
		const { reportReason, customReason } = this.state;
		try {
			this.setState({
				reportReason: 1,
				customReason: '',
			});
			onRequestClose();
			await Service.request('ReportItem', {
				itemId,
				itemType,
				reason: reportReason,
				message: customReason,
			});
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
				label={t('common.report-action-title')}
			/>,
		];
		return (
			<Dialog
				open={open}
				actions={actions}
				onRequestClose={onRequestClose}
				title={t('report.report-popup-title')}
			>
				<RadioButtonGroup
					name="reportReason"
					defaultSelected={1}
					onChange={this.handleReasonChange}
				>
					<RadioButton
						value={1}
						label={t('report.report-option-1')}
					/>
					<RadioButton
						value={2}
						label={t('report.report-option-2')}
					/>
					<RadioButton
						value={3}
						label={t('report.report-option-3')}
					/>
					<RadioButton
						value={0}
						label={t('report.report-option-4')}
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
