import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { Hook, Console, Decode } from 'console-feed';

import {
	Heading,
	Container,
} from 'components/atoms';
import { EmptyCard } from 'components/molecules';

@translate()
@observer
class LiveOutput extends React.Component {
	state = {
		logs: [],
	}

	outputWindowRef = React.createRef();

	componentDidMount() {
		const { playground } = this.props;
		// Do nothing if the code is still compiling
		// And we only show loading and no iframe is available in ref.
		if (!playground.isRunning) {
			const { contentDocument, contentWindow } = this.outputWindowRef.current;
			Hook(contentWindow.console, (log) => {
				this.setState(state => ({ logs: [ ...state.logs, Decode(log) ] }));
			});
			contentDocument.write(playground.output);
			contentDocument.close();
		}
	}

	render() {
		const { t, playground } = this.props;
		const logColor = playground.isDark ? '#F5F5F5' : '#3A464B';
		return (
			<Container className={`playground_live-output-container ${playground.isFullscreen ? 'playground_output-frame-fullscreen' : ''}`}>
				{ playground.isRunning
					? <EmptyCard className="playground_live-output-loading" loading={playground.isRunning} />
					: (
						<Fragment>
							<iframe className="playground_output-frame" title="code-output" ref={this.outputWindowRef} />
							{playground.isWeb &&
							<Container className="playground_console-root">
								<Heading>{t('code_playground.console.title')}</Heading>
								<Container className={`playground_console ${playground.isDark ? 'dark' : 'light'}`}>
									<Console
										logs={this.state.logs}
										styles={{ LOG_COLOR: logColor }}
										variant={playground.isDark ? 'dark' : 'light'}
										key={`console-${playground.id || ''}-${logColor}`}
									/>
								</Container>
							</Container>
							}
						</Fragment>
					)
				}
			</Container>
		);
	}
}
export default LiveOutput;
