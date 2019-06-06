import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import {
	RadioButton,
	Popup,
	PopupTitle,
	PopupContent,
	PopupContentText,
	PopupActions,
	Input,
	SecondaryTextBlock,
	FlexBox,
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

	componentWillReceiveProps = () => {
		this.setState({ reportReason: 1, customReason: '' });
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
	onClose = () => {
		const { onClose } = this.props;
		onClose(false);
	}

	submitReport = async () => {
		const {
			itemId,
			itemType,
			onClose,
		} = this.props;
		const { reportReason, customReason } = this.state;
		try {
			this.setState({
				reportReason: 1,
				customReason: '',
			});
			onClose(true);
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
		const { onClose, open, t } = this.props;
		return (
			<Popup
				className="report-popup"
				open={open}
				onClose={this.onClose}
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
									inputProps={{ maxLength: this.customReasonMaxLength }}
									label={t('common.report-more-hint')}
								/>
								<SecondaryTextBlock className="count">{customReason.length} / {this.customReasonMaxLength}</SecondaryTextBlock>
							</FlexBox>
						}
					</PopupContentText>
				</PopupContent>
				<PopupActions>
					<FlatButton
						color="primary"
						onClick={this.onClose}
					>
						{t('common.cancel-title')}
					</FlatButton>
					<FlatButton
						color="primary"
						autoFocus
						onClick={this.submitReport}
					>
						{t('common.report-action-title')}
					</FlatButton>
				</PopupActions>
			</Popup>
		);
	}
}

export default ReportPopup;
