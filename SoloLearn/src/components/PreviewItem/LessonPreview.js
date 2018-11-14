import React, { PureComponent } from 'react';
//import Paper from 'material-ui/Paper';
import Service from 'api/service';
import CourseChip from 'components/CourseChip';
import { Container, PaperContainer, TextBlock, SecondaryTextBlock } from 'components/atoms';

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
				<Container className="preview-info">
					<TextBlock className="primary">{name}</TextBlock>
					<SecondaryTextBlock className="secondary">{userName}</SecondaryTextBlock>
				</Container>
			</PaperContainer>
		);
	}
}

export default CodePreview;
