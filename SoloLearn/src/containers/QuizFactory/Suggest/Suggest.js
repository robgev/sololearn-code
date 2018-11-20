import React from 'react';
import { translate } from 'react-i18next';
import {
	List, ListItem, HorizontalDivider,
	Image, Title, FlexBox,
} from 'components/atoms';
import { ContainerLink } from 'components/molecules';

const Suggest = ({ t }) => (
	<List className="quiz_factory-suggest-list">
		<ContainerLink to="/quiz-factory/suggest/multiple-choice">
			<ListItem>
				<FlexBox className="item">
					<FlexBox align>
						<Image className="image" src="/assets/create_multiple_choice.png" />
						<Title>
							{t('factory.quiz-type-multiple-choice')}
						</Title>
					</FlexBox>
					<Image className="image" src="/assets/keyboard_arrow_right.svg" />
				</FlexBox>
			</ListItem>
		</ContainerLink>
		<HorizontalDivider />
		<ContainerLink to="/quiz-factory/suggest/type-in">
			<ListItem>
				<FlexBox className="item">
					<FlexBox align>
						<Image className="image" src="/assets/create_type_in.png" />
						<Title>
							{t('factory.quiz-type-guess-the-output')}
						</Title>
					</FlexBox>
					<Image className="image" src="/assets/keyboard_arrow_right.svg" />
				</FlexBox>
			</ListItem>
		</ContainerLink>
		<HorizontalDivider />
		<ContainerLink to="/quiz-factory/suggest/fill-in">
			<ListItem>
				<FlexBox className="item">
					<FlexBox align>
						<Image className="image" src="/assets/create_multiple_type_in.png" />
						<Title>
							{t('factory.quiz-type-fill-in-the-blanks')}
						</Title>
					</FlexBox>
					<Image className="image" src="/assets/keyboard_arrow_right.svg" />
				</FlexBox>
			</ListItem>
		</ContainerLink>
		<HorizontalDivider />
	</List>
);

export default translate()(Suggest);
