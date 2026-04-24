import Navbar from './navbar'
// import Sidebar from './sidebar'

const Navigation = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className='pt-15 2xl:pt-16'>
         <Navbar />
         {/* <Sidebar /> */}
         {children}
      </div>
   )
}

export default Navigation