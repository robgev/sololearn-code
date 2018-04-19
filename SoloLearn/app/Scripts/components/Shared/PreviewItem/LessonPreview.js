import React, { PureComponent } from 'react';
import Paper from 'material-ui/Paper';
import Service from 'api/service';
import CourseChip from 'components/Shared/CourseChip';

class CodePreview extends PureComponent {
	state = {
		loading: true,
		lessonData: null,
	}

	async componentWillMount() {
		const { id, type, recompute } = this.props;
		const { lesson: lessonData } = type === 'course'
			? await Service.request('GetCourseLessonMinimal', { id })
			: await Service.request('GetLessonMinimal', { id });
		this.setState({ lessonData, loading: false }, recompute);
	}
	render() {
		const { loading, lessonData } = this.state;
		if (loading) {
			return null;
		}
		const {
			color, iconUrl, name, userName,
		} = lessonData;
		return (
			<Paper className="preview-wrapper">
				<CourseChip
					disabled
					noName
					noBoxShadow
					size={40}
					color={color}
					iconUrl={iconUrl}
				/>
				<div className="preview-info">
					<p className="primary">{name}</p>
					<p className="secondary">{userName}</p>
				</div>
			</Paper>
		);
	}
}

export default CodePreview;