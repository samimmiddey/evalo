"use client";

import HeaderText from "@/components/common/header-text";
import PrimaryBody from "@/components/common/primary-body";
import PrimaryTitle from "@/components/common/primary-title";
import HeaderLayout from "@/components/layouts/header-layout";
import { contactData } from "@/data/contact/contact.data";
import ContactForm from "./components/contact-form";

const Form = () => {
   return (
      <div className="s-margin-t container">
         <HeaderLayout>
            <HeaderText
               icon={contactData.form.icon}
               text={contactData.form.header}
            />
            <PrimaryTitle text={contactData.form.title} className="mt-1 2xl:mt-2" />
            <PrimaryBody text={contactData.form.description} />
         </HeaderLayout>

         <ContactForm />
      </div>
   );
};

export default Form;
