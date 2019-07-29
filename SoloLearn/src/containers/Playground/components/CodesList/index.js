import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { List, Container, HorizontalDivider } from 'components/atoms';
import { EmptyCard } from 'components/molecules';
import CodeShimmer from 'components/Shimmers/CodeShimmer';
import './styles.scss';
import CodeItem from '../CodeItem';

const CodesList = ({
	codes,
	hasMore,
}) => (
	<Container className="codes-wrapper">
		{
			codes.length === 0 && !hasMore
				? (
					<EmptyCard />
				)
				: (
					<Container>
						{
							codes.length === 0 &&
								<CodeShimmer />
						}
						<List>
							{codes.map((code, index) => (
								<Fragment>
									<CodeItem key={code.id} code={code} />
									{index < codes.length - 1 && <HorizontalDivider className="code-item-divider" />}
								</Fragment>
							))}
						</List>
					</Container>
				)
		}
	</Container>
);

export default observer(CodesList);
