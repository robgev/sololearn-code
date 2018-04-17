import React, { PureComponent } from 'react';
import Paper from 'material-ui/Paper';
import Service from 'api/service';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

class PostPreview extends PureComponent {
	state = {
		loading: true,
		postData: null,
	}

	async componentWillMount() {
		const { id, recompute } = this.props;
		const { post: postData } = await Service.request('Discussion/GetPost', { id });
		this.setState({ postData, loading: false }, recompute);
	}
	render() {
		const { loading, postData } = this.state;
		if (loading) {
			return null;
		}
		const {
			avatarUrl, title, userName,
		} = postData;
		// Will need badge in future too. Destructure badge if needed.
		return (
			<Paper className="preview-wrapper">
				<ProfileAvatar
					disabled
					size={40}
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
