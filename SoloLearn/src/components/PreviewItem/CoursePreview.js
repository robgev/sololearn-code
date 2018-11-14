import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import CourseChip from 'components/CourseChip';
import { Container, PaperContainer, TextBlock, } from 'components/atoms';

const mapStateToProps = ({ courses }) => ({ courses });

@connect(mapStateToProps)
class CodePreview extends Component {
	async componentWillMount() {
		const { courses, courseAlias } = this.props;
		const course = courses.find(item =>
			item.alias.toLowerCase() === courseAlias.toLowerCase());
		this.courseData = course;
	}
	render() {
		const {
			iconUrl, name,
		} = this.courseData;
		return (
			<PaperContainer className="preview-wrapper">
				<CourseChip
					disabled
					noName
					size={40}
					noBoxShadow
					itemType={1}
					iconUrl={iconUrl}
				/>
				<Container className="preview-info">
					<TextBlock className="primary">{name}</TextBlock>
				</Container>
			</PaperContainer>
		);
	}
}

export default CodePreview;
