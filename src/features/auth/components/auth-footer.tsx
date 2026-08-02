import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Props {
   text: string;
   linkText: string;
   linkUrl: string;
}

const AuthFooter = ({ text, linkText, linkUrl }: Props) => {
   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get('redirect_url');

   const href = redirectUrl
      ? `${linkUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`
      : linkUrl;

   return (
      <p className="text-center text-sm text-muted-foreground font-inter">
         {text}{" "}
         <Link href={href} className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
            {linkText}
         </Link>
      </p>
   );
};

export default AuthFooter;