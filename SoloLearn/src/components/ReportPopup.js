import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
//import Dialog from 'components/StyledDialog';
import TextField from 'material-ui/TextField';
//import FlatButton from 'material-ui/FlatButton';
//import { RadioButtonGroup } from 'material-ui/RadioButton';
import {
	RadioButton,
	Popup,
	PopupTitle,
	PopupContent,
	PopupContentText,
	PopupActions,
	Container,
	Input,
	SecondaryTextBlock,
	FlexBox
} from 'components/atoms';
import { RadioButtonGroup, FlatButton } from 'components/molecules';
import Service from 'api/service';

import 'styles/components/ReportPopup.scss';

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

	handleReasonChange = (event) => {
		this.setState({ reportReason: +event.target.value });
	}

	handleCustomReasonChange = (event) => {
		const customReason = event.target.value;
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
			>
				{t('common.cancel-title')}
			</FlatButton>,
			<FlatButton
				primary
				onClick={() => this.submitReport()}
				label={t('common.report-action-title')}
			>
				{t('common.report-action-title')}
			</FlatButton>,
		];
		return (
			<Popup
				className="report-popup"
				open={open}
				onClose={onRequestClose}
			>
				<PopupTitle>
					{t('report.report-popup-title')}
				</PopupTitle>
				<PopupContent>
					<PopupContentText className="report-popup-content">
						<RadioButtonGroup
							name="reportReason"
							value={reportReason}
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
							<FlexBox column>
								<Input
									value={customReason}
									onChange={this.handleCustomReasonChange}
									inputProps={{maxLength:this.customReasonMaxLength}}
									label={t('common.report-more-hint')}
								/>
								<SecondaryTextBlock className="count">{customReason.length} / {this.customReasonMaxLength}</SecondaryTextBlock>
							</FlexBox>
						}
					</PopupContentText>
				</PopupContent>
				<PopupActions>
					{actions}
				</PopupActions>
			</Popup>
		);
	}
}

export default ReportPopup;
