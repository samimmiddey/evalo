import Brands from './brands/brands'
import Features from './features/features'
import Hero from './hero/hero'
import Roles from './roles/roles'
import Pricing from './pricing/pricing'
import Testimonials from './testimonials/testimonials'
import CTA from './cta/cta'

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
	)
}

export default HomeComponent