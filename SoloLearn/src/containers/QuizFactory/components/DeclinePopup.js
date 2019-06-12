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
import { RadioButtonGroup, FlatButton, PromiseButton } from 'components/molecules';
import Service from 'api/service';

import 'styles/components/ReportPopup.scss';

@translate()
class DeclinePopup extends PureComponent {
	constructor() {
		super();
		this.customReasonMaxLength = 256;
		this.state = {
			reportReason: 401,
			customReason: '',
		};
	}

	componentWillReceiveProps = () => {
		this.setState({ reportReason: 401, customReason: '' });
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

	submitDecline = async () => {
		const {itemId} = this.props;
		const {reportReason, customReason} = this.state;
		return  Service.request('ReportItem', {
				itemId,
				itemType: 11,
				reason: reportReason,
				message: customReason,
			}).then(this.onClose);

	}

	render() {
		const { reportReason, customReason } = this.state;
		const { open, t } = this.props;
		return (
			<Popup
				className="report-popup"
				open={open}
				onClose={this.onClose}
			>
				<PopupTitle>
					Select a resaon
				</PopupTitle>
				<PopupContent>
					<PopupContentText className="report-popup-content">
						<RadioButtonGroup
							name="reportReason"
							value={reportReason}
							onChange={this.handleReasonChange}
						>
							<RadioButton
								value={401}
								label="Too Many Similar Questions"
							/>
							<RadioButton
								value={402}
								label="Too General or Specific"
							/>
							<RadioButton
								value={403}
								label="Something is Missing"
							/>
							<RadioButton
								value={404}
								label="Wrong Format"
							/>
							<RadioButton
								value={405}
								label="Structural Problem"
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
						autoFocus
					>
						{t('common.cancel-title')}
					</FlatButton>
					<PromiseButton
						color="primary"

						fire={this.submitDecline}
					>
						Decline
					</PromiseButton>
				</PopupActions>
			</Popup>
		);
	}
}

export default DeclinePopup;
