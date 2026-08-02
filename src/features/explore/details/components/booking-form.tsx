import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import {
   Coins,
   Calendar as CalendarIcon,
   Clock,
   CheckCircle2,
   ChevronRight
} from 'lucide-react';
import { DetailedInterviewer } from '@/data/explore/explore.types';

interface BookingFormProps {
   interviewer: DetailedInterviewer;
}

const BookingForm = ({ interviewer }: BookingFormProps) => {
   const [focusArea, setFocusArea] = useState<string>('');
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
   const [isBooked, setIsBooked] = useState<boolean>(false);

   // Booking flow state
   const [step, setStep] = useState<number>(1);
   const [selectedDate, setSelectedDate] = useState<string>('');
   const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

   // Extract unique dates from availabilities
   const getAvailableDates = () => {
      const dates = interviewer.availabilities.map(av => {
         const d = new Date(av.startTime);
         return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      });
      return Array.from(new Set(dates));
   };

   const availableDates = getAvailableDates();

   // Get time slots for selected date
   const getTimeSlotsForDate = (dateStr: string) => {
      return interviewer.availabilities.filter(av => {
         const d = new Date(av.startTime);
         const formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
         return formatted === dateStr;
      }).map(av => {
         const start = new Date(av.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
         const end = new Date(av.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
         return `${start} - ${end}`;
      });
   };

   const handleDateSelect = (date: string) => {
      setSelectedDate(date);
      setSelectedTimeSlot(''); // Reset time slot when date changes
   };

   const handleNextStep = () => {
      if (step === 1 && !selectedDate) {
         toast.error('Please select a date to proceed.');
         return;
      }
      if (step === 2 && !selectedTimeSlot) {
         toast.error('Please select a time slot to proceed.');
         return;
      }
      setStep(prev => prev + 1);
   };

   const handlePrevStep = () => {
      setStep(prev => prev - 1);
   };

   const handleConfirmBooking = () => {
      setIsSubmitting(true);
      setTimeout(() => {
         setIsSubmitting(false);
         setIsBooked(true);
         toast.success('Mock booking confirmed successfully! (UI Only)');
      }, 1500);
   };

   const resetBooking = () => {
      setStep(1);
      setSelectedDate('');
      setSelectedTimeSlot('');
      setFocusArea('');
      setIsBooked(false);
   };
   return (
      <div className="bg-[#121520]/90 border border-violet-500/15 rounded-2xl overflow-hidden shadow-2xl relative">

         {/* Success State Overlay */}
         <AnimatePresence>
            {isBooked && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-zinc-950/95 z-20 flex flex-col items-center justify-center p-6 text-center space-y-4"
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
                        <span className="text-zinc-500">Interviewer:</span>
                        <span className="font-semibold text-zinc-200">{interviewer.firstName} {interviewer.lastName}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-zinc-500">Date:</span>
                        <span className="font-semibold text-zinc-200">{selectedDate}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-zinc-500">Time:</span>
                        <span className="font-semibold text-zinc-200">{selectedTimeSlot}</span>
                     </div>
                     {focusArea && (
                        <div className="pt-1.5 border-t border-white/5">
                           <span className="text-zinc-500 block mb-1">Focus Areas:</span>
                           <span className="text-zinc-400 block line-clamp-2">{focusArea}</span>
                        </div>
                     )}
                  </div>

                  <Button
                     onClick={resetBooking}
                     className="w-full bg-violet-600 hover:bg-violet-700 text-zinc-100 mt-2"
                  >
                     Book Another Session
                  </Button>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="font-bold text-zinc-100 text-lg">Book a Session</h3>
               <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400">
                  <span className={step === 1 ? 'text-violet-400' : ''}>Date</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className={step === 2 ? 'text-violet-400' : ''}>Time</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className={step === 3 ? 'text-violet-400' : ''}>Confirm</span>
               </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
               <div
                  className="bg-violet-500 h-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
               />
            </div>

            {/* Step Content */}
            <div className="min-h-55">
               {step === 1 && (
                  <div className="space-y-4">
                     <p className="text-sm text-zinc-400 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-violet-400" />
                        Select available interview date:
                     </p>

                     <div className="grid grid-cols-1 gap-2.5">
                        {availableDates.map(date => {
                           const isSelected = selectedDate === date;
                           return (
                              <button
                                 key={date}
                                 type="button"
                                 onClick={() => handleDateSelect(date)}
                                 className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${isSelected
                                    ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-zinc-300'
                                    }`}
                              >
                                 {date}
                              </button>
                           );
                        })}
                     </div>
                  </div>
               )}

               {step === 2 && (
                  <div className="space-y-4">
                     <p className="text-sm text-zinc-400 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-violet-400" />
                        Select a time slot for {selectedDate}:
                     </p>

                     <div className="grid grid-cols-1 gap-2.5">
                        {getTimeSlotsForDate(selectedDate).map(slot => {
                           const isSelected = selectedTimeSlot === slot;
                           return (
                              <button
                                 key={slot}
                                 type="button"
                                 onClick={() => setSelectedTimeSlot(slot)}
                                 className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${isSelected
                                    ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-zinc-300'
                                    }`}
                              >
                                 {slot}
                              </button>
                           );
                        })}
                     </div>
                  </div>
               )}

               {step === 3 && (
                  <div className="space-y-4">
                     <p className="text-sm text-zinc-400">
                        Review your booking details:
                     </p>

                     <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Date</span>
                           <span className="text-zinc-200 font-medium">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Time</span>
                           <span className="text-zinc-200 font-medium">{selectedTimeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Total Charged</span>
                           <span className="text-violet-400 font-semibold flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              {interviewer.creditRate} Credits
                           </span>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label htmlFor="focus-area" className="text-xs text-zinc-400 block font-medium">
                           What do you want to practice? (Optional)
                        </label>
                        <Textarea
                           id="focus-area"
                           placeholder="e.g. Frontend system design, React render optimization, mock coding feedback..."
                           value={focusArea}
                           onChange={(e) => setFocusArea(e.target.value)}
                           className="resize-none"
                        />
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
                     onClick={handlePrevStep}
                     className="border-white/10 hover:bg-white/5 text-zinc-300 w-1/3"
                  >
                     Back
                  </Button>
               )}

               {step < 3 ? (
                  <Button
                     type="button"
                     onClick={handleNextStep}
                     className="bg-violet-600 hover:bg-violet-700 text-zinc-100 grow"
                  >
                     Next Step
                  </Button>
               ) : (
                  <Button
                     type="button"
                     onClick={handleConfirmBooking}
                     disabled={isSubmitting}
                     className="bg-emerald-600 hover:bg-emerald-700 text-zinc-100 grow flex items-center justify-center gap-2"
                  >
                     {isSubmitting ? 'Scheduling...' : 'Confirm Booking'}
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
};

export default BookingForm;