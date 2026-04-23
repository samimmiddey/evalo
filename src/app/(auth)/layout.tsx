import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="container">
         <div className='flex items-center justify-center pt-20'>
            {children}
         </div>
      </div>
   )
}

export default AuthLayout