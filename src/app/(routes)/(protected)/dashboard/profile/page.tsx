import type { Metadata } from "next";
import { PAGE_METADATA } from "@/constants/metadata";
import Profile from "@/features/interviews/profile/profile";

export const metadata: Metadata = PAGE_METADATA.profile;

const ProfilePage = () => {
   return <Profile />;
};

export default ProfilePage;
