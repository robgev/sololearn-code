import React from 'react';

const TabLabel = ({ icon, data, label }) => (
	<div className="tab-label">
		{data &&
			<p>{data}</p>
		}
		{ icon || null}
		<p>{label}</p>
	</div>
);

export default TabLabel;
