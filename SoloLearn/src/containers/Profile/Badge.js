import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import {
	Container,
	Image,
	TextBlock,
	SecondaryTextBlock,
} from 'components/atoms';
import './badge.scss';

@observer
class Badge extends Component {
	@observable highlighted = this.props.isSelected
	componentDidMount() {
		setTimeout(() => {
			this.setHighlighted(false);
		}, 2000);
	}
	@action setHighlighted = (val) => {
		if (this.highlighted !== val) {
			this.highlighted = val;
		}
	}
	render() {
		const { achievement, isSelected, selectedRef } = this.props;
		return (
			<Container
				className={`badge-item achievement ${this.highlighted ? 'animate' : ''}`}
				ref={isSelected && selectedRef}
			>
				<Container
					className="badge base"
					style={{
						...(achievement.isUnlocked ? { backgroundColor: achievement.color } : {}),
					}}
				>
					<Image
						alt="Achievement badge"
						className="icon"
						src={achievement.icon}
					/>
				</Container>
				<Container className="details">
					<TextBlock>
						{achievement.title}
					</TextBlock>
					<br />
					<SecondaryTextBlock className="description">{achievement.description}</SecondaryTextBlock>
				</Container>
			</Container>
		);
	}
}

export default Badge;
