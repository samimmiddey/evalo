"use client";

import HeaderText from "@/components/common/header-text";
import PrimaryBody from "@/components/common/primary-body";
import PrimaryTitle from "@/components/common/primary-title";
import HeaderLayout from "@/components/layouts/header-layout";
import { homeData } from "@/data/home/home.data";
import RoleCard from "../components/role-card";

const Roles = () => {
   return (
      <section className="s-margin-t container">
         <HeaderLayout>
            <HeaderText
               icon={homeData.roles.icon}
               text={homeData.roles.header}
            />
            <PrimaryTitle text={homeData.roles.title} />
            <PrimaryBody
               text={homeData.roles.description}
            />
         </HeaderLayout>

         <RoleCard data={homeData.roles} />
      </section>
   );
};

export default Roles;