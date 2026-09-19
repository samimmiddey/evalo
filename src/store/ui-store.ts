import { create } from "zustand";

interface UIInterface {
   upgradeModal: boolean;
   setUpgradeModal: (value: boolean) => void;
}

const useUIStore = create<UIInterface>()(
   (set) => ({
      upgradeModal: false,
      setUpgradeModal: (value) => set({ upgradeModal: value })
   })
);

export default useUIStore;