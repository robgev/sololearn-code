import React, { PureComponent } from 'react';
import Paper from 'material-ui/Paper';
import Service from 'api/service';
import LanguageIcon from 'components/Shared/LanguageIcon';

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
			<Paper className="preview-wrapper">
				<LanguageIcon language={language} />
				<div className="preview-info">
					<p className="primary">{name}</p>
					<p className="secondary">{userName}</p>
				</div>
			</Paper>
		);
	}
}

export default CodePreview;
