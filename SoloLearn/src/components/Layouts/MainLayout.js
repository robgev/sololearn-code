// React modules
import React, { PureComponent } from 'react';

// Additional components
import Header from 'containers/Header/Header';

const styles = {
	wrapper: {
		paddingTop: 50,
	},
};

class MainLayout extends PureComponent {
	render() {
		const { location: { pathname } } = this.props;
		return (
			<div>
				<Header pathname={pathname} />
				<div style={styles.wrapper}>
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default MainLayout;
