import React from 'react';
import RSplitPane from 'react-split-pane';
import { observer } from 'mobx-react';
import { Container } from 'components/atoms';
import './styles.scss';

const SplitPane = ({ playground, ...props }) => {
	const inlineCN = playground.isInline ? 'split-pane_inline' : '';
	const darkCN = playground.isDark ? 'dark' : '';
	const fullCN = `playground_split-pane-container ${inlineCN} ${darkCN}`;
	return (
		<Container className={fullCN}>
			<RSplitPane
				minSize={0}
				maxSize={-45}
				primary="first"
				split="horizontal"
				allowResize
				defaultSize={playground.isOutputOpen ? '70%' : 'calc(100% - 45px)'}
				{...props}
			/>
		</Container>
	);
};

export default observer(SplitPane);
