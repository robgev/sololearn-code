import React, { PureComponent } from 'react';
import Service from 'api/service';
import { LanguageLabel } from 'components/molecules';
import { PaperContainer, SecondaryTextBlock, Link } from 'components/atoms';

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
			<PaperContainer>
				<LanguageLabel language={language} />
				<Link to={this.props.to} className="item">{name}</Link>
				<SecondaryTextBlock className="item"> {userName}</SecondaryTextBlock>
			</PaperContainer>
		);
	}
}

export default CodePreview;
