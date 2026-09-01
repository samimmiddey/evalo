"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import {
   Coins,
   Calendar as CalendarIcon,
   Clock,
   CheckCircle2,
   ChevronRight
} from 'lucide-react';
import { interviewerDetailsData } from '@/data/interviews/interviews.data';
import HeaderTitle from './header-title';
import GradientWrapper from '@/components/wrappers/gradient-wrapper';
import { InterviewerDetails } from '../types/details.types';
import { format } from 'date-fns';
import { handleBookSession } from '../services/details.client.service';
import { useMutation } from '@/hooks/use-mutation';
import CustomSpinner from '@/components/common/custom-spinner';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
   interviewer: InterviewerDetails;
}

interface AvailableDates {
   startDate: string;
   label: string;
}

interface TimeSlot {
   startTime: string;
   endTime: string;
   displayStart: string;
   displayEnd: string;
}

const BookingForm = ({ interviewer }: BookingFormProps) => {
   const [availableDates, setAvailableDates] = useState<AvailableDates[]>([]);
   const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
   const [selectedDateSlot, setSelectedDateSlot] = useState<string>('');
   const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>({
      startTime: '',
      endTime: '',
      displayStart: '',
      displayEnd: ''
   });
   const [step, setStep] = useState<number>(1);
   const [isBooked, setIsBooked] = useState<boolean>(false);

   const { isPending, error, mutate: mutateBookSession } = useMutation(handleBookSession);

   const router = useRouter();

   // Extract unique dates from availabilities
   useEffect(() => {
      const uniqueDatesMap = new Map<string, AvailableDates>();

      interviewer.availabilities.forEach(date => {
         const startObj = new Date(date.startTime);
         const startDate = format(startObj, 'PP');
         const label = format(startObj, 'EEEE');

         if (!uniqueDatesMap.has(startDate)) {
            uniqueDatesMap.set(startDate, {
               startDate,
               label
            });
         }
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvailableDates(Array.from(uniqueDatesMap.values()));
   }, [interviewer]);

   // Extract time slots for selected date
   useEffect(() => {
      const availableTimeSlots = interviewer.availabilities.filter(date => {
         const startDate = format(new Date(date.startTime), 'PP');
         return selectedDateSlot === startDate;
      }).map(item => {
         return {
            startTime: item.startTime.toString(),
            endTime: item.endTime.toString(),
            displayStart: format(new Date(item.startTime), 'p'),
            displayEnd: format(new Date(item.endTime), 'p')
         };
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvailableTimes(availableTimeSlots);
      // Reset selected time slot when date changes

      setSelectedTimeSlot({ startTime: '', endTime: '', displayStart: '', displayEnd: '' });
   }, [interviewer, selectedDateSlot]);

   // Next step handler
   const handleNextStep = () => {
      setStep(prevState => prevState + 1);
   };

   // Previous state handler
   const handlePrevStep = () => {
      setStep(prev => prev - 1);
      if (step === 2) {
         setSelectedTimeSlot({ startTime: '', endTime: '', displayStart: '', displayEnd: '' });
      }
   };

   // Submit form handler
   const handleSubmit = async () => {
      const params = {
         interviewerId: interviewer.id,
         startTime: selectedTimeSlot.startTime,
         endTime: selectedTimeSlot.endTime
      };

      const result = await mutateBookSession(params);

      if (result) {
         toast.success("Your slot has been booked successfully!");
         setIsBooked(true);
         router.push('/dashboard/appointments');
      }
   };

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);

   const wrapperClasses = 'min-h-auto transition-all duration-300 border border-white/5 hover:border-violet-500/30 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]';
   return (
      <GradientWrapper
         className={`h-auto relative rounded-2xl shadow-2xl ${wrapperClasses}`}
         showGrid={false}
      >
         {/* Success State Overlay */}
         <AnimatePresence>
            {isBooked && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20"
               >
                  <GradientWrapper
                     className={`h-full w-full flex flex-col items-center justify-center p-6 2xl:p-8 text-center space-y-4 ${wrapperClasses}`}
                     showGrid={false}
                  >
                     <motion.div
                        initial={{ scale: 0.8, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                     >
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                     </motion.div>
                     <div className="space-y-2">
                        <h3 className="text-xl font-bold text-zinc-100">Booking Confirmed!</h3>
                        <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
                           Your mock session with {interviewer.firstName} has been scheduled.
                        </p>
                     </div>

                     <div className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-left text-xs space-y-2 text-zinc-300">
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Interviewer</span>
                           <span className="font-semibold text-zinc-200">{interviewer.firstName} {interviewer.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Date</span>
                           <span className="font-semibold text-zinc-200">{selectedDateSlot}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Time</span>
                           <span className="font-semibold text-zinc-200">
                              {`${selectedTimeSlot.displayStart} - ${selectedTimeSlot.displayEnd}`}
                           </span>
                        </div>
                     </div>

                     <Button
                        className="w-full bg-violet-600 hover:bg-violet-700 text-zinc-100 mt-2"
                        size='lg'
                        onClick={() => setStep(1)}
                     >
                        Book Another Session
                     </Button>
                  </GradientWrapper>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="p-6 2xl:p-8 space-y-6 relative z-1">
            <div className="flex items-center justify-between gap-2.5 flex-wrap">
               <HeaderTitle
                  title={interviewerDetailsData.booking.title}
                  icon={interviewerDetailsData.booking.icon}
               />
               <Badge
                  variant='outline'
                  className='text-xs text-zinc-400 whitespace-nowrap p-3'>
                  {interviewer.creditRate} Credit/session
               </Badge>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4">
               <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div
                     className="bg-violet-500 h-full transition-all duration-300"
                     style={{ width: `${(step / 3) * 100}%` }}
                  />
               </div>
               <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400">
                  <span className={step === 1 ? 'text-violet-400' : ''}>Date</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className={step === 2 ? 'text-violet-400' : ''}>Time</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className={step === 3 ? 'text-violet-400' : ''}>Confirm</span>
               </div>
            </div>

            {/* Step Content */}
            <div className="min-h-55 max-h-70 2xl:max-h-80 2xl:min-h-60 h-full overflow-auto">

               {/* Date Slot */}
               {step === 1 && (
                  <div className="space-y-4">
                     <p className="text-sm text-zinc-400 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-violet-400" />
                        Select available interview date:
                     </p>

                     <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                        {availableDates.map(date => {
                           const isSelected = selectedDateSlot === date.startDate;
                           return (
                              <Button
                                 key={date.startDate}
                                 type="button"
                                 onClick={() => setSelectedDateSlot(date.startDate)}
                                 className={`flex gap-1 flex-col px-4 h-auto py-3! rounded-xl border font-medium transition-all ${isSelected
                                    ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-zinc-300'
                                    }`}
                              >
                                 <span className='text-[15px] 2xl:text-base font-bold'>{date.label}</span>
                                 <span className='text-xs 2xl:text-sm text-zinc-400'>{date.startDate}</span>
                              </Button>
                           );
                        })}
                     </div>
                  </div>
               )}

               {/* Time Slot */}
               {step === 2 && (
                  <div className="space-y-4">
                     <p className="text-sm text-zinc-400 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-violet-400" />
                        Select a time slot for {selectedDateSlot}:
                     </p>

                     <div className="grid grid-cols-1 gap-2.5">
                        {availableTimes.map(slot => {
                           const isSelected = selectedTimeSlot.startTime === slot.startTime;
                           return (
                              <Button
                                 key={slot.startTime}
                                 type="button"
                                 onClick={() => setSelectedTimeSlot(slot)}
                                 className={`h-12 px-3.5 rounded-xl border text-sm font-medium transition-all ${isSelected
                                    ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-zinc-300'
                                    }`}
                              >
                                 {`${slot.displayStart} - ${slot.displayEnd}`}
                              </Button>
                           );
                        })}
                     </div>
                  </div>
               )}

               {/* Review final selection */}
               {step === 3 && (
                  <div className="space-y-4">
                     <p className="text-sm text-zinc-400">
                        Review your booking details:
                     </p>

                     <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Date</span>
                           <span className="text-zinc-200 font-medium">{selectedDateSlot}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Time Slot</span>
                           <span className="text-zinc-200 font-medium">
                              {`${selectedTimeSlot.displayStart} - ${selectedTimeSlot.displayEnd}`}
                           </span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Total Charged</span>
                           <span className="text-violet-400 font-semibold flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              {interviewer.creditRate} Credit
                           </span>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 pt-2">
               {step > 1 && (
                  <Button
                     type="button"
                     variant="outline"
                     size="lg"
                     className="w-1/3"
                     onClick={handlePrevStep}
                  >
                     Back
                  </Button>
               )}

               {step < 3 ? (
                  <Button
                     type="button"
                     size="lg"
                     className="bg-violet-600 hover:bg-violet-700 text-zinc-100 grow"
                     onClick={handleNextStep}
                     disabled={(step === 1 && !selectedDateSlot) || (step === 2 && !selectedTimeSlot.startTime)}
                  >
                     Next Step
                  </Button>
               ) : (
                  <Button
                     type="button"
                     size="lg"
                     className="bg-emerald-600 hover:bg-emerald-700 text-zinc-100 grow flex items-center justify-center gap-2"
                     onClick={() => {
                        void handleSubmit();
                     }}
                     disabled={isPending}
                  >
                     {isPending ? <CustomSpinner text='Booking slot...' /> : "Confirm Booking"}
                  </Button>
               )}
            </div>
         </div>
      </GradientWrapper>
   );
};

export default BookingForm;