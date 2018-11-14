import React, { PureComponent } from 'react';
//import Paper from 'material-ui/Paper';
import Service from 'api/service';
//import ProfileAvatar from 'components/ProfileAvatar';

import {
	Container,
	PaperContainer,
	TextBlock,
	SecondaryTextBlock,
} from 'components/atoms';
import { Avatar } from 'components/molecules';

class PostPreview extends PureComponent {
	constructor() {
		super();
		this.state = {
			loading: true,
			postData: null,
		};
		this._isMounting = true;
	}

	async componentWillMount() {
		const { id, recompute } = this.props;
		const { post: postData } = await Service.request('Discussion/GetPost', { id });
		if (this._isMounting) {
			this.setState({ postData, loading: false }, recompute);
		}
	}

	componentWillUnmount() {
		this._isMounting = false;
	}

	render() {
		const { loading, postData } = this.state;
		if (loading) {
			return null;
		}
		const {
			avatarUrl, title, userName, badge,
		} = postData;
		// Will need badge in future too. Destructure badge if needed.
		return (
			<PaperContainer className="preview-wrapper">
				<Avatar
					disabled
					badge={badge}
					avatarUrl={avatarUrl}
					userName={userName}
				/>
				<Container className="preview-info">
					<TextBlock className="primary">{title}</TextBlock>
					<SecondaryTextBlock className="secondary">{userName}</SecondaryTextBlock>
				</Container>
			</PaperContainer>
		);
	}
}

export default PostPreview;
