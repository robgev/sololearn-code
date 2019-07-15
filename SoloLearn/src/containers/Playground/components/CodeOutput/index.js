import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import LiveOutput from './LiveOutput';
import CompiledOutput from './CompiledOutput';
import './styles.scss';

const CodeOutput = ({ playground }) => (playground.hasLiveOutput
	? (
		<Fragment>
			{playground.isOutputOpen &&
			<LiveOutput
				key={`live-${playground.id}-${playground.lessonCodeId}-${playground.isRunning ? 'running' : 'live'}`}
				playground={playground}
			/>
			}
		</Fragment>
	)
	: (
		<CompiledOutput playground={playground} />
	));

export default translate()(observer(CodeOutput));
