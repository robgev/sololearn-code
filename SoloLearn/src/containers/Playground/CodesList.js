import React from 'react';
import { observer } from 'mobx-react';
import InfiniteScroll from 'components/InfiniteScroll';
import CodeShimmer from 'components/Shimmers/CodeShimmer';
import 'styles/Playground/Codes.scss';
import CodeItem from './CodeItem';

const CodesList = observer(({
	codes, loadMore, hasMore, header = null,
}) => (
	<div className="codes-wrapper">
		{
			codes.length === 0 && !hasMore
				? <div>No codes found</div>
				: (
					<div>
						{
							codes.length === 0 &&
								<div style={{ height: '100vh', overflow: 'hidden' }}>
									{header}
									<CodeShimmer />
								</div>
						}
						<InfiniteScroll
							header={codes.length !== 0 ? header : null}
							loadMore={loadMore}
							hasMore={hasMore}
							element="div"
							style={{
								display: 'flex',
								width: '100%',
								flexDirection: 'column',
							}}
						>
							{codes.map(code => (
								<CodeItem key={code.id} code={code} />
							))}
						</InfiniteScroll>
					</div>
				)
		}
	</div>
));

export default CodesList;
