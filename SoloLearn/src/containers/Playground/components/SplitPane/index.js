import React from 'react';
import RSplitPane from 'react-split-pane';
import { observer } from 'mobx-react';
import { Container } from 'components/atoms';
import './styles.scss';

const SplitPane = ({ playground, ...props }) => {
	const inlineCN = playground.isInline ? 'split-pane_inline' : '';
	const fullScreenCN = playground.isFullscreen ? 'split-pane_fullscreen' : '';
	const fullCN = `playground_split-pane-container ${inlineCN} ${fullScreenCN}`;
	return (
		<Container className={fullCN}>
			<RSplitPane
				minSize={0}
				maxSize={-100}
				primary="first"
				split="horizontal"
				allowResize={playground.isOutputOpen}
				defaultSize={playground.isOutputOpen ? 'calc(100% - 200px)' : '100%'}
				{...props}
			/>
		</Container>
	);
};

export default observer(SplitPane);
