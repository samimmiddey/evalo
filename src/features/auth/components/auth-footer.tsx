import Link from 'next/link'

interface Props {
   text: string;
   linkText: string;
   linkUrl: string;
}

const AuthFooter = ({ text, linkText, linkUrl }: Props) => {
   return (
      <p className="text-center text-sm text-muted-foreground font-inter">
         {text}{" "}
         <Link href={linkUrl} className="font-medium text-foreground hover:text-primary transition-colors">
            {linkText}
         </Link>
      </p>
   )
}

export default AuthFooter