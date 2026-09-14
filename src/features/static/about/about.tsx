import Hero from './sections/hero';
import Features from '../home/sections/features';
import CTA from '../home/sections/cta';
import Roles from '../home/sections/roles';

const About = () => {
   return (
      <>
         <Hero />
         <div className="s-margin-t s-padding-b bg-surface-dark">
            <Features />
         </div>
         <Roles />
         <CTA />
      </>
   );
};

export default About;