const ContinueDivider = () => {
   return (
      <div className="relative">
         <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
         </div>
         <div className="relative flex justify-center text-xs uppercase font-medium">
            <span className="bg-card px-3 text-muted-foreground">
               Or continue with
            </span>
         </div>
      </div>
   )
}

export default ContinueDivider