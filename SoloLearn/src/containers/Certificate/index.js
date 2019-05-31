import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Progress from 'api/progress';
import Service from 'api/service';
import { toSeoFriendly } from 'utils';
import { loadCourseInternal } from 'actions/learn';
import { Container, Image, FlexBox } from 'components/atoms';
import { Layout, EmptyCard } from 'components/molecules';
import './styles.scss';

const mapStateToProps = state => ({
	courses: state.courses,
	course: state.course,
});

const mapDispatchToProps = {
	loadCourseInternal,
};

@connect(mapStateToProps, mapDispatchToProps)
class Certificate extends PureComponent {
	state = {
		imageData: '',
		loading: true,
	}

	async componentWillMount() {
		const { params: { id }, loadCourseInternal } = this.props;
		const courseId = parseInt(id, 10);
		if (!this.props.course) {
			await loadCourseInternal(courseId);
		}
		const { modules } = this.props.course;
		const lastModule = modules[modules.length - 1];
		const { progress } = Progress.getModuleState(lastModule);
		const isCourseFinished = progress === 100;
		if (isCourseFinished) {
			const imageStream = await Service.imageRequest('/DownloadCertificate', { courseId });
			const blob = new Blob([ imageStream ], { type: 'image/jpeg' });
			const imageData = URL.createObjectURL(blob);
			this.setState({
				imageData,
				loading: false,
			});
		} else {
			this.redirect();
		}
		document.title = 'Certificate';
		ReactGA.ga('send', 'screenView', { screenName: 'Certificate Page' });
	}

	redirect = () => {
		const { params: { id }, courses } = this.props;
		const courseId = parseInt(id, 10);
		const { name } = courses.find(singleCourse => singleCourse.id === courseId);
		browserHistory.replace(`/learn/${toSeoFriendly(name)}`);
	}

	render() {
		const { loading, imageData } = this.state;
		return (
			<Layout className="certificate_full-height">
				{
					loading
						? (
							<FlexBox align justify className="certificate_container">
								<EmptyCard loading />
							</FlexBox>
						)
						: (
							<FlexBox align justify className="certificate_container">
								<Image
									className="certificate_image"
									src={imageData}
									alt="Certificate"
								/>
							</FlexBox>
						)
				}
			</Layout>
		);
	}
}

export default Certificate;
