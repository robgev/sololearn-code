import React, { PureComponent } from 'react';
import Paper from 'material-ui/Paper';
import Service from 'api/service';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

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
			<Paper className="preview-wrapper">
				<ProfileAvatar
					disabled
					size={40}
					badge={badge}
					avatarUrl={avatarUrl}
					userName={userName}
					avatarStyle={{ margin: '0 10px 0 0' }}
				/>
				<div className="preview-info">
					<p className="primary">{title}</p>
					<p className="secondary">{userName}</p>
				</div>
			</Paper>
		);
	}
}

export default PostPreview;
