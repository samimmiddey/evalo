import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import HeaderLayout from '@/components/layouts/header-layout';

const Header = () => {
   return (
      <div className="max-w-2xl">
         <HeaderLayout className='gap-4! items-start text-start mb-0!'>
            <PrimaryTitle text='Find your perfect interviewer' />
            <PrimaryBody text='Connect with industry experts from top companies for mock interviews, career guidance, and technical mentorship.' />
         </HeaderLayout>
      </div>
   );
};

export default Header;