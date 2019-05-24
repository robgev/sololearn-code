import React, { PureComponent } from 'react';
import Service from 'api/service';

import {
	Link,
	FlexBox,
	PaperContainer,
	SecondaryTextBlock,
} from 'components/atoms';
import { ProfileAvatar } from 'components/molecules';

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
			title, userName,
		} = postData;
		// Will need badge in future too. Destructure badge if needed.
		return (
			<PaperContainer className="preview-wrapper">
				<ProfileAvatar
					disabled
					user={postData}
				/>
				<FlexBox className="preview-info" column>
					<Link to={this.props.to} className="item">{title}</Link>
					<SecondaryTextBlock className="item">{userName}</SecondaryTextBlock>
				</FlexBox>
			</PaperContainer>
		);
	}
}

export default PostPreview;
