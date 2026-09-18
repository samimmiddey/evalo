"use client";

import HeaderText from "@/components/common/header-text";
import PrimaryBody from "@/components/common/primary-body";
import PrimaryTitle from "@/components/common/primary-title";
import { contactData } from "@/data/contact/contact.data";
import FaqItem from "../components/faq-item";
import HeaderLayout from "@/components/layouts/header-layout";

const FAQ = () => {
   return (
      <section className="s-margin-t s-margin-b container relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Header */}
            <div className="lg:col-span-5">
               <HeaderLayout className="items-start text-start mb-0!">
                  <HeaderText
                     icon={contactData.faq.icon}
                     text={contactData.faq.header}
                  />
                  <PrimaryTitle
                     text={contactData.faq.title}
                     className="text-left mt-0"
                  />
                  <PrimaryBody
                     text={contactData.faq.description}
                     className="text-left max-w-md"
                  />
               </HeaderLayout>
            </div>

            {/* Right Column: Clean Accordion List */}
            <div className="lg:col-span-7 flex flex-col border-t border-white/10">
               {contactData.faq.items.map((item, i) => (
                  <FaqItem key={i} item={item} index={i} />
               ))}
            </div>
         </div>
      </section>
   );
};

export default FAQ;
