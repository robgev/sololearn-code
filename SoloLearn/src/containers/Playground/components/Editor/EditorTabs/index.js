import React, { Fragment } from 'react';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import {
	FlexBox,
	Container,
	IconButton,
	ButtonTooltip,
	TextContainer,
} from 'components/atoms';
import { FlatButton } from 'components/molecules';
import { 	Fullscreen, FullscreenExit, Close } from 'components/icons';
import { languageNames } from 'containers/Playground/utils/Mappings';

import WebTabs from './WebTabs';
import './styles.scss';

const PlaygroundTabs = ({ t, playground, onClose }) => (
	<FlexBox
		justifyBetween
		align
		noShrink
		className={`playground_editor-tabs-root ${playground.isFullscreen ? 'fullscreen' : ''}`}
	>
		{ playground.hasLiveOutput
			?	<WebTabs playground={playground} languages={languageNames} />
			: <TextContainer>{languageNames[playground.language]}</TextContainer>
		}

		<Container>
			{ playground.hasLiveOutput && !playground.isInline &&
			<FlatButton
				onClick={playground.language === 'php' ? playground.runCompiledCode : playground.runWebCode}
			>
				{t('code_playground.output')}
			</FlatButton>
			}
			<Fragment>
				<ButtonTooltip
					placement="bottom-end"
					title={playground.isInline ? 'Maximize in Playground' : 'Toggle Fullscreen'}
				>
					<IconButton onClick={
						playground.isInline
							?	() => browserHistory.push({
								pathname: '/playground/new',
								query: { lessonCodeId: playground.lessonCodeId, language: playground.language },
							})
							:	playground.toggleFullScreen
					}
					>
						{ playground.isFullscreen
							?	<FullscreenExit />
							:	<Fullscreen />
						}
					</IconButton>
				</ButtonTooltip>
				{playground.isInline &&
					<ButtonTooltip
						placement="bottom-end"
						title={t('common.close-title')}
					>
						<IconButton onClick={onClose}>
							<Close />
						</IconButton>
					</ButtonTooltip>
				}
			</Fragment>
		</Container>
	</FlexBox>
);

export default translate()(observer(PlaygroundTabs));
