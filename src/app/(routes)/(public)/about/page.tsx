import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import About from '@/features/static/about/about';

export const metadata: Metadata = PAGE_METADATA.about;

const AboutPage = () => {
   return (
      <About />
   );
};

export default AboutPage;