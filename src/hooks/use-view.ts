import { ViewType } from '@/types/ui.types';
import { useState } from 'react';

const useView = () => {
   const [view, setView] = useState<ViewType>('grid');

   return {
      view,
      setView
   };
};

export default useView;