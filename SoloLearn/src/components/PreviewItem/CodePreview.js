import React, { PureComponent } from 'react';
import Service from 'api/service';
import { LanguageLabel } from 'components/molecules';
import { Container, PaperContainer, TextBlock, SecondaryTextBlock } from 'components/atoms';

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
				<LanguageLabel language={language} />
				<Container className="preview-info">
					<TextBlock className="primary">{name}</TextBlock>
					<SecondaryTextBlock className="secondary">{userName}</SecondaryTextBlock>
				</Container>
			</PaperContainer>
		);
	}
}

export default CodePreview;
