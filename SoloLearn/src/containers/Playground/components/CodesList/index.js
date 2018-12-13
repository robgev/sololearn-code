import React from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { List, Container } from 'components/atoms';
import CodeShimmer from 'components/Shimmers/CodeShimmer';
import './styles.scss';
import CodeItem from '../CodeItem';

const CodesList = ({
	t,
	codes,
	hasMore,
}) => (
	<Container className="codes-wrapper">
		{
			codes.length === 0 && !hasMore
				? (
					<Container className="no-codes-wrapper">{t('profile.no-codes')}</Container>
				)
				: (
					<Container>
						{
							codes.length === 0 &&
								<CodeShimmer />
						}
						<List>
							{codes.map(code => (
								<CodeItem key={code.id} code={code} />
							))}
						</List>
					</Container>
				)
		}
	</Container>
);

export default translate()(observer(CodesList));
