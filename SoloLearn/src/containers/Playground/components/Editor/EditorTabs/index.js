import React from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import {
	FlexBox,
	IconButton,
	ButtonTooltip,
	TextContainer,
} from 'components/atoms';
import { FlatButton } from 'components/molecules';
import { 	Fullscreen, FullscreenExit } from 'components/icons';
import { languageNames } from 'containers/Playground/utils/Mappings';

import WebTabs from './WebTabs';

const PlaygroundTabs = ({ t, playground }) => (
	<FlexBox justifyBetween align noShrink>
		{ playground.isWeb || playground.language === 'php'
			?	<WebTabs playground={playground} languages={languageNames} />
			: <TextContainer>{languageNames[playground.language]}</TextContainer>
		}

		<div>
			{ (playground.isWeb || playground.language === 'php') &&
			<FlatButton
				onClick={() => alert('RUN')}
			>
				{t('code_playground.output')}
			</FlatButton>
			}
			<ButtonTooltip
				placement="bottom-end"
				title={playground.isInline ? 'Maximize in Playground' : 'Toggle Fullscreen'}
			>
				<IconButton onClick={playground.toggleFullScreen}>
					{ playground.isFullscreen
						?	<FullscreenExit />
						:	<Fullscreen />
					}
				</IconButton>
			</ButtonTooltip>
		</div>
	</FlexBox>
);

export default translate()(observer(PlaygroundTabs));
