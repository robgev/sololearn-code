import React from 'react';
import { translate } from 'react-i18next';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import 'styles/Challenges/Challenge/Game/Scoreboard.scss';

const Scoreboard = ({
	t,
	player,
	opponent,
	playerScore,
	opponentScore,
}) => (
	<div className="scoreboard-container">
		<div className="player-container">
			<ProfileAvatar
				disabled
				size={40}
				userName={player.name}
				avatarUrl={player.avatarUrl}
				avatarStyle={{ margin: '0 10px 0 0' }}
			/>
			<div className="user-info-container">
				<p className="user-name">{player.name}</p>
				<p className="user-level">{t('common.user-level')} {player.level}</p>
			</div>
		</div>
		<div className="score-container">
			<span className="score-number">{ playerScore }</span>
			<span className="score-colon"> : </span>
			<span className="score-number">{ opponentScore }</span>
		</div>
		<div className="opponent-container">
			<div className="user-info-container">
				<p className="user-name">{opponent.name}</p>
				<p className="user-level">{t('common.user-level')} {opponent.level}</p>
			</div>
			<ProfileAvatar
				disabled
				size={40}
				userName={opponent.name}
				avatarUrl={opponent.avatarUrl}
				avatarStyle={{ margin: '0 10px 0 0' }}
			/>
		</div>
	</div>
);

export default translate()(Scoreboard);
