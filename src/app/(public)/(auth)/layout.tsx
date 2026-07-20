import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="container">
         <div className='flex items-center justify-center s-padding-t'>
            {children}
         </div>
      </div>
   )
}

export default AuthLayout