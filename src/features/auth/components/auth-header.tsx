import Logo from '@/components/common/logo';
import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';

interface Props {
   title: string;
   desc: string;
}

const AuthHeader = ({ title, desc }: Props) => {
   return (
      <div className="space-y-2 flex flex-col items-center text-center pb-4">
         <Logo />
         <PrimaryTitle
            text={title}
            className="text-[30px]! 2xl:text-[32px]! mt-1 2xl:mt-2"
         />
         <PrimaryBody
            className="text-sm!"
            text={desc}
         />
      </div>
   );
};

export default AuthHeader;