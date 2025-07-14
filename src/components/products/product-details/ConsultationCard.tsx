import * as Switch from '@radix-ui/react-switch';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsultation } from '@/store/use-consultation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const CONSULTATION_TYPES = [
  { label: 'Virtual Consultation', price: 120000 },
  { label: 'In-Person Consultation', price: 200000 },
];

const schema = z.object({
  type: z.string().min(1, 'Select a consultation type'),
  description: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof schema>;

const ConsultationForm: React.FC<{ onSubmit: (data: ConsultationFormValues) => void }>
  = ({ onSubmit }) => {
    const { control, register, handleSubmit, formState: { errors }, watch } = useForm<ConsultationFormValues>({
      resolver: zodResolver(schema),
      defaultValues: { type: '', description: '' },
    });
    const selectedType = watch('type');
    const selectedObj = CONSULTATION_TYPES.find(t => t.label === selectedType);
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <label className="block font-medium mb-1 text-sm">Consultation Type</label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="w-full border-[0.5px] border-[#E4E7EC] rounded-lg px-3 py-2 text-sm  flex justify-between items-center">
                    {selectedObj ? `${selectedObj.label} - ₦${selectedObj.price.toLocaleString()}` : 'Select type'}
                    <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white min-w-[220px]">
                  {CONSULTATION_TYPES.map((c) => (
                    <DropdownMenuItem key={c.label} onClick={() => field.onChange(c.label)}>
                      {c.label} - ₦{c.price.toLocaleString()}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
          {errors.type && <span className="text-xs text-red-500">{errors.type.message}</span>}
        </div>
        <div>
          <label className="block font-medium mb-1 text-sm">Tell us about your hair goals (optional)</label>
          <textarea
            {...register('description')}
            className="w-full border-[0.5px] border-[#E4E7EC] rounded-lg px-3 py-2 text-sm min-h-[100px]"
            placeholder="Describe your desired look, lifestyle or any specific concern..."
          />
        </div>
        {/* You can add a submit button if needed */}
      </form>
    );
  };

const ConsultationCard: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const setConsultation = useConsultation(state => state.setConsultation);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    if (!checked) setConsultation(false);
  };

  const handleFormSubmit = (data: ConsultationFormValues) => {
    const typeObj = CONSULTATION_TYPES.find(t => t.label === data.type);
    setConsultation(true, {
      type: data.type,
      price: typeObj?.price || 0,
      description: data.description,
    });
  };

  return (
    <div className="rounded-2xl border-[0.5px] border-[#98A2B3] p-6 w-full max-w-md mx-auto mt-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-semibold text-lg">Need Consultation?</div>
          <div className={`text-sm mt-1 ${enabled ? 'text-[#A4846C]' : 'text-gray-400'}`}>Get personalized styling advice from our certified stylists</div>
        </div>
        <Switch.Root
          checked={enabled}
          onCheckedChange={handleToggle}
          className={`w-10 h-6 bg-gray-200 rounded-full relative outline-none transition-colors duration-200 ${enabled ? 'bg-primary' : 'bg-gray-200'}`}
        >
          <Switch.Thumb className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
        </Switch.Root>
      </div>
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.0, 0.0, 0.2, 1], // ease-out
              opacity: { duration: 0.3 }
            }}
            className="overflow-hidden"
          >
            <ConsultationForm onSubmit={handleFormSubmit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultationCard; 