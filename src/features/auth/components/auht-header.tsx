import PrimaryBody from '@/components/common/primary-body'
import PrimaryTitle from '@/components/common/primary-title'

interface Props {
   title: string
   desc: string
}

const AuthHeader = ({ title, desc }: Props) => {
   return (
      <div className="space-y-2 text-center md:text-left">
         <PrimaryTitle
            text={title}
            className="text-[30px]! 2xl:text-[32px]!"
         />
         <PrimaryBody
            className="text-sm!"
            text={desc}
         />
      </div>
   )
}

export default AuthHeader