type RegionProperties = {
	children: Array<JSX.Element | boolean> | JSX.Element | boolean;
	className?: string;
};

const Region = ({children, className = ''}: RegionProperties): JSX.Element => {
	return (
		<section className={`mt-16 md:mt-24 ${className}`}>
			{children}
		</section>
	);
};

export default Region;

export type {
	RegionProperties as RegionProps,
};
