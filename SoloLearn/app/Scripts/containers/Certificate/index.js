import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Progress from 'api/progress';
import Service from 'api/service';
import BusyWrapper from 'components/Shared/BusyWrapper';

const mapStateToProps = state => ({
	courses: state.courses,
	course: state.course,
});

@connect(mapStateToProps)
class Certificate extends PureComponent {
	state = {
		imageData: '',
		loading: true,
	}

	async componentWillMount() {
		const { params: { id }, course, getCertificate } = this.props;
		const courseId = parseInt(id, 10);
		if (!course) {
			this.redirect();
		} else {
			const { modules } = course;
			const lastModule = modules[modules.length - 1];
			const { progress } = Progress.getModuleState(lastModule);
			const isCourseFinished = progress === 100;
			if (isCourseFinished) {
				const imageStream = await Service.fetchRequest('/DownloadCertificate', { courseId });
				const blob = new Blob([ imageStream ], { type: 'image/jpeg' });
				const imageData = URL.createObjectURL(blob);
				this.setState({
					imageData,
					loading: false,
				});
			} else {
				this.redirect();
			}
		}
	}

	redirect = () => {
		const { params: { id }, courses } = this.props;
		const courseId = parseInt(id, 10);
		const { alias } = courses.find(singleCourse => singleCourse.id === courseId);
		browserHistory.replace(`/learn/${alias}`);
	}

	render() {
		const { loading, imageData } = this.state;
		return (
			<BusyWrapper
				isBusy={loading}
				style={{ minHeight: '60vh' }}
			>
				<div>
					<img src={imageData} alt="Certificate" />
				</div>
			</BusyWrapper>
		);
	}
}

export default Certificate;
