import NextLink from 'next/link';

type Variant = 'primary' | 'secondary';

type BaseButtonProperties = {
	label: string;
	variant?: Variant;
};

const variantClasses: Record<Variant, string> = {
	primary: 'bg-brand-primary hover:bg-brand-secondary hover:text-white',
	secondary: 'bg-brand-secondary hover:bg-brand-primary text-white hover:text-black',
};

const baseClasses = 'p-4 inline-block rounded-2xl text-center disabled:opacity-50 disabled:pointer-events-none';

type SemanticButtonProperties = BaseButtonProperties & React.ComponentPropsWithoutRef<'button'>;
type LinkButtonProperties = BaseButtonProperties & React.ComponentPropsWithoutRef<'a'> & {href: string};

const Semantic = ({label, variant = 'primary', ...rest}: SemanticButtonProperties): JSX.Element => (
	<button type="button" {...rest} className={`${baseClasses} ${variantClasses[variant]} ${rest.className ?? ''}`}>
		{label}
	</button>
);

const Link = ({label, variant = 'primary', href, ...rest}: LinkButtonProperties): JSX.Element => (
	<NextLink {...rest} href={href} className={`${baseClasses} ${variantClasses[variant]} ${rest.className ?? ''}`}>
		<span>{label}</span>
	</NextLink>
);

const Button = {
	Semantic,
	Link,
};

export default Button;

export type {
	Variant,
};