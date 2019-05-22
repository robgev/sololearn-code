import React, { PureComponent } from 'react';
import Service from 'api/service';
import {
	Link,
	FlexBox,
	PaperContainer,
	SecondaryTextBlock,
} from 'components/atoms';
import { LanguageLabel } from 'components/molecules';

class CodePreview extends PureComponent {
	constructor() {
		super();
		this.state = {
			loading: true,
			codeData: null,
		};
		this._isMounting = true;
	}

	async componentWillMount() {
		const { publicId, recompute } = this.props;
		const { code: codeData } = await Service.request('Playground/GetCodeMinimal', { publicId });
		if (this._isMounting) {
			this.setState({ codeData, loading: false }, recompute);
		}
	}

	componentWillUnmount() {
		this._isMounting = false;
	}

	render() {
		const { loading, codeData } = this.state;
		if (loading) {
			return null;
		}
		const {
			language, name, userName,
		} = codeData;
		return (
			<PaperContainer className="preview-wrapper">
				<LanguageLabel className="code-preview_language-label" language={language} />
				<FlexBox className="preview-info" column>
					<Link to={this.props.to} className="item">{name}</Link>
					<SecondaryTextBlock className="item"> {userName}</SecondaryTextBlock>
				</FlexBox>
			</PaperContainer>
		);
	}
}

export default CodePreview;
