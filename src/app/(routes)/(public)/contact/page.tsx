import type { Metadata } from 'next';
import { PAGE_METADATA } from '@/constants/metadata';
import Contact from '@/features/static/contact/contact';

export const metadata: Metadata = PAGE_METADATA.contact;

const ContactPage = () => {
   return (
      <Contact />
   );
};

export default ContactPage;
