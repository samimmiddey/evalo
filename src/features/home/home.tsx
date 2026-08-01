import Brands from './sections/brands';
import Features from './sections/features';
import Hero from './sections/hero';
import Roles from './sections/roles';
import Pricing from './sections/pricing';
import Testimonials from './sections/testimonials';
import CTA from './sections/cta';

const HomeComponent = () => {
	return (
		<>
			<Hero />
			<Brands />
			<Features />
			<Roles />
			<Pricing />
			<Testimonials />
			<CTA />
		</>
	);
};

export default HomeComponent;