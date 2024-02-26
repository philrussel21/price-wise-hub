'use client';

import {Fragment} from 'react';
import {AppProgressBar} from 'next-nprogress-bar';

const ProgressBar = ({children}: {children: React.ReactNode}): JSX.Element => {
	return (
		<Fragment>
			{children}
			<AppProgressBar
				shallowRouting
				height="4px"
				color="#e63946"
				options={{showSpinner: false}}
			/>
		</Fragment>
	);
};

export default ProgressBar;
