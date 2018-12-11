import React, { PureComponent } from 'react';
import Service from 'api/service';
import { CourseChip } from 'containers/Learn/components';
import { PaperContainer, SecondaryTextBlock, Link } from 'components/atoms';

class CodePreview extends PureComponent {
	constructor() {
		super();
		this.state = {
			loading: true,
			lessonData: null,
		};
		this._isMounting = true;
	}

	async componentWillMount() {
		const { id, type, recompute } = this.props;
		const { lesson: lessonData } = type === 'course'
			? await Service.request('GetCourseLessonMinimal', { id })
			: await Service.request('GetLessonMinimal', { id });
		if (this._isMounting) {
			this.setState({ lessonData, loading: false }, recompute);
		}
	}

	componentWillUnmount() {
		this._isMounting = false;
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
			<PaperContainer className="preview-wrapper">
				<CourseChip
					disabled
					noName
					size={40}
					noBoxShadow
					color={color}
					iconUrl={iconUrl}
				/>
				<Link className="item">{name}</Link>
				<SecondaryTextBlock className="item">{userName}</SecondaryTextBlock>
			</PaperContainer>
		);
	}
}

export default CodePreview;
