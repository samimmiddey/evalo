import Brands from './brands/brands'
import Features from './features/features'
import Hero from './hero/hero'
import Roles from './roles/roles'
import Pricing from './pricing/pricing'
import Testimonials from './testimonials/testimonials'

const HomeComponent = () => {
	return (
		<>
			<Hero />
			<Brands />
			<Features />
			<Roles />
			<Pricing />
			<Testimonials />
		</>
	)
}

export default HomeComponent