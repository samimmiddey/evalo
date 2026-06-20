import Brands from './brands/brands'
import Features from './features/features'
import Hero from './hero/hero'
import Roles from './roles/roles'

const HomeComponent = () => {
	return (
		<>
			<Hero />
			<Brands />
			<Features />
			<Roles />
		</>
	)
}

export default HomeComponent