import React from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { List, Container, PaperContainer } from 'components/atoms';
import { InfiniteScroll } from 'components/molecules';
import CodeShimmer from 'components/Shimmers/CodeShimmer';
import './styles.scss';
import CodeItem from '../CodeItem';

const CodesList = observer(({
	t,
	codes,
	hasMore,
	loadMore,
	header = null,
}) => (
	<Container className="codes-wrapper">
		{
			codes.length === 0 && !hasMore
				? (
					<PaperContainer>
						{header}
						<Container className="no-codes-wrapper">{t('profile.no-codes')}</Container>
					</PaperContainer>
				)
				: (
					<Container>
						{
							codes.length === 0 &&
								<PaperContainer style={{ height: '100vh', overflow: 'hidden' }}>
									{header}
									<CodeShimmer />
								</PaperContainer>
						}
						<InfiniteScroll
							loadMore={loadMore}
							hasMore={hasMore}
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<PaperContainer>
								{codes.length !== 0 ? header : null}
								<List>
									{codes.map(code => (
										<CodeItem key={code.id} code={code} />
									))}
								</List>
							</PaperContainer>
						</InfiniteScroll>
					</Container>
				)
		}
	</Container>
));

export default translate()(CodesList);
