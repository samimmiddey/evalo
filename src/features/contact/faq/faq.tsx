"use client";

import HeaderText from "@/components/common/header-text";
import PrimaryBody from "@/components/common/primary-body";
import PrimaryTitle from "@/components/common/primary-title";
import { contactData } from "@/data/contact/contact.data";
import FaqItem from "./components/faq-item";

const FAQ = () => {
   return (
      <div className="s-margin-t s-margin-b container">
         <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 2xl:gap-20 items-start">

            {/* Left: Sticky section header */}
            <div className="lg:sticky lg:top-28 flex flex-col items-start gap-4 lg:gap-5 2xl:gap-6">
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
                  className="text-left"
               />
            </div>

            {/* Right: FAQ accordion list */}
            <div className="flex flex-col border-t border-white/5">
               {contactData.faq.items.map((item, i) => (
                  <FaqItem key={i} item={item} index={i} />
               ))}
            </div>

         </div>
      </div>
   );
};

export default FAQ;
