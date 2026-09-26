import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import HomeComponent from '@/features/static/home/home';

export const metadata: Metadata = PAGE_METADATA.home;

const Home = () => {
  return (
    <HomeComponent />
  );
};

export default Home;