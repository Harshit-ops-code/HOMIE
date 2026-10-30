'use client';

import { useState } from 'react';

export default function SurvivalKitModal({ isOpen, onClose, cityName = 'Delhi' }) {
  const [step, setStep] = useState(1);
  const [selectedStay, setSelectedStay] = useState('coliving'); // 'coliving', '1bhk', 'studio'
  const [selectedMeals, setSelectedMeals] = useState('both'); // 'lunch_dinner', 'both', 'dinner_only'
  const [mealDiet, setMealDiet] = useState('north_veg'); // 'north_veg', 'jain', 'non_veg', 'south_veg'
  const [domesticHelp, setDomesticHelp] = useState(['maid']); // 'maid', 'cook', 'laundry'
  const [extras, setExtras] = useState(['wifi', 'metro_card']); // 'wifi', 'metro_card', 'drinking_water'

  if (!isOpen) return null;

  const stayOptions = [
    { id: 'coliving', name: 'Managed Co-Living / PG', price: 14500, desc: 'Zero deposit lock-in, daily housekeeping, high-speed WiFi' },
    { id: 'studio', name: 'Private Studio Flat', price: 21000, desc: 'Direct owner, verified lease, modular kitchenette' },
    { id: '1bhk', name: 'Independent 1BHK Flat', price: 26000, desc: 'Semi-furnished, separate balcony, quiet residential colony' }
  ];

  const mealOptions = [
    { id: 'lunch_dinner', name: 'Lunch + Dinner Tiffin Box', price: 3400, desc: '6 days/week fresh hot home meals delivered to desk/door' },
    { id: 'both', name: 'Breakfast + Lunch + Dinner (3x Daily)', price: 4600, desc: 'Full daily nutrition subscription with rotational menu' },
    { id: 'dinner_only', name: 'Dinner Only (Working Executive)', price: 2200, desc: 'Light, healthy home-style dinner delivered by 8:30 PM' }
  ];

  const helpOptions = [
    { id: 'maid', name: 'Daily Maid (Sweeping & Mopping)', price: 1500, icon: 'cleaning_services' },
    { id: 'cook', name: 'Dedicated Morning/Evening Cook', price: 3000, icon: 'skillet' },
    { id: 'laundry', name: 'Weekly Wash & Steam Iron Service', price: 1200, icon: 'local_laundry_service' }
  ];

  const extraOptions = [
    { id: 'wifi', name: 'Instant 200 Mbps Fiber WiFi Activation', price: 699, icon: 'wifi' },
    { id: 'metro_card', name: 'Preloaded Metro Smart Card (₹500)', price: 500, icon: 'directions_subway' },
    { id: 'drinking_water', name: '20L RO Water Jar Weekly Subscription', price: 400, icon: 'water_drop' }
  ];

  const toggleDomesticHelp = (id) => {
    setDomesticHelp(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleExtra = (id) => {
    setExtras(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Pricing calculations
  const stayCost = stayOptions.find(s => s.id === selectedStay)?.price || 0;
  const mealCost = mealOptions.find(m => m.id === selectedMeals)?.price || 0;
  const helpCost = domesticHelp.reduce((acc, curr) => {
    const item = helpOptions.find(h => h.id === curr);
    return acc + (item?.price || 0);
  }, 0);
  const extrasCost = extras.reduce((acc, curr) => {
    const item = extraOptions.find(e => e.id === curr);
    return acc + (item?.price || 0);
  }, 0);

  const totalMonthlyCost = stayCost + mealCost + helpCost + extrasCost;

  const handleWhatsAppDispatch = () => {
    const stayName = stayOptions.find(s => s.id === selectedStay)?.name;
    const mealName = mealOptions.find(m => m.id === selectedMeals)?.name;
    const helpNames = domesticHelp.map(h => helpOptions.find(item => item.id === h)?.name).join(', ') || 'None';
    const extraNames = extras.map(e => extraOptions.find(item => item.id === e)?.name).join(', ') || 'None';

    const text = encodeURIComponent(
      `*Hello Basera Concierge!* 🏠\n` +
      `I want to dispatch my *First 48-Hours Relocation Survival Kit* for *${cityName}*.\n\n` +
      `• *Stay Preference:* ${stayName} (₹${stayCost.toLocaleString('en-IN')})\n` +
      `• *Tiffin Subscription:* ${mealName} [${mealDiet}] (₹${mealCost.toLocaleString('en-IN')})\n` +
      `• *Domestic Support:* ${helpNames} (₹${helpCost.toLocaleString('en-IN')})\n` +
      `• *Quick Essentials:* ${extraNames} (₹${extrasCost.toLocaleString('en-IN')})\n\n` +
      `*Total Estimated Monthly Cost:* ₹${totalMonthlyCost.toLocaleString('en-IN')}\n\n` +
      `Please connect me with the verified neighborhood vendors directly.`
    );

    window.open(`https://wa.me/919560290859?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fdfbf7] w-full max-w-2xl rounded-3xl border border-outline shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline bg-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center text-terracotta">
              <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta">
                1-Click Relocation Engine
              </span>
              <h3 className="font-editorial text-xl font-bold text-primary">
                First 48-Hours Survival Kit
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-sand hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-4 border-b border-outline bg-sand/60 text-center text-xs font-bold">
          {[
            { stepNum: 1, label: '1. Stay' },
            { stepNum: 2, label: '2. Tiffin' },
            { stepNum: 3, label: '3. Helpers' },
            { stepNum: 4, label: '4. Summary' }
          ].map(s => (
            <button
              key={s.stepNum}
              onClick={() => setStep(s.stepNum)}
              className={`py-3 transition-colors cursor-pointer border-b-2 ${
                step === s.stepNum 
                  ? 'border-terracotta text-terracotta bg-white' 
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-5">
          
          {/* STEP 1: STAY SELECTION */}
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <div className="flex flex-col gap-1">
                <h4 className="font-editorial text-lg font-bold text-primary">Select Your Verified Stay Tier</h4>
                <p className="text-xs text-gray-500 font-medium">Audited no-brokerage flats and co-living hubs near transit corridors in {cityName}.</p>
              </div>

              <div className="flex flex-col gap-3">
                {stayOptions.map(stay => (
                  <div
                    key={stay.id}
                    onClick={() => setSelectedStay(stay.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedStay === stay.id 
                        ? 'bg-white border-terracotta shadow-md ring-1 ring-terracotta/20' 
                        : 'bg-sand/40 border-outline hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-primary">{stay.name}</span>
                      <span className="text-xs text-gray-500 font-medium">{stay.desc}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="text-sm font-bold text-terracotta">₹{stay.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">/month</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: TIFFIN & MEAL SUBSCRIPTION */}
          {step === 2 && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-150">
              <div className="flex flex-col gap-1">
                <h4 className="font-editorial text-lg font-bold text-primary">Daily Home-Cooked Tiffin Plan</h4>
                <p className="text-xs text-gray-500 font-medium">Unlike Swiggy/Zomato, these are monthly home-kitchen subscriptions made with pure ghee and fresh veggies.</p>
              </div>

              {/* Diet selector */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'north_veg', label: 'North Indian Pure Veg' },
                  { id: 'jain', label: 'Jain (No Onion / Garlic)' },
                  { id: 'south_veg', label: 'South Indian Home Style' },
                  { id: 'non_veg', label: 'Egg / Non-Veg Alternate' }
                ].map(diet => (
                  <button
                    key={diet.id}
                    type="button"
                    onClick={() => setMealDiet(diet.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      mealDiet === diet.id 
                        ? 'bg-terracotta text-white border-terracotta' 
                        : 'bg-white border-outline text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {mealOptions.map(meal => (
                  <div
                    key={meal.id}
                    onClick={() => setSelectedMeals(meal.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedMeals === meal.id 
                        ? 'bg-white border-terracotta shadow-md ring-1 ring-terracotta/20' 
                        : 'bg-sand/40 border-outline hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-primary">{meal.name}</span>
                      <span className="text-xs text-gray-500 font-medium">{meal.desc}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="text-sm font-bold text-terracotta">₹{meal.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">/month</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DOMESTIC HELPERS & ESSENTIALS */}
          {step === 3 && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-150">
              <div className="flex flex-col gap-1">
                <h4 className="font-editorial text-lg font-bold text-primary">Domestic Helpers & Transit Pack</h4>
                <p className="text-xs text-gray-500 font-medium">Pre-audited verified helpers with police background verification and standard colony rates.</p>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Domestic Support (Optional)</span>
                {helpOptions.map(help => {
                  const isChecked = domesticHelp.includes(help.id);
                  return (
                    <div
                      key={help.id}
                      onClick={() => toggleDomesticHelp(help.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                        isChecked 
                          ? 'bg-white border-terracotta shadow-sm' 
                          : 'bg-sand/30 border-outline hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-olive text-[20px]">{help.icon}</span>
                        <span className="text-xs font-bold text-primary">{help.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-terracotta">+₹{help.price.toLocaleString('en-IN')}/mo</span>
                        <span className={`material-symbols-outlined text-[20px] ${isChecked ? 'text-terracotta' : 'text-gray-300'}`}>
                          {isChecked ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Arrival Essentials</span>
                {extraOptions.map(extra => {
                  const isChecked = extras.includes(extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                        isChecked 
                          ? 'bg-white border-terracotta shadow-sm' 
                          : 'bg-sand/30 border-outline hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-amber-600 text-[20px]">{extra.icon}</span>
                        <span className="text-xs font-bold text-primary">{extra.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-terracotta">+₹{extra.price.toLocaleString('en-IN')}</span>
                        <span className={`material-symbols-outlined text-[20px] ${isChecked ? 'text-terracotta' : 'text-gray-300'}`}>
                          {isChecked ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: SUMMARY & 1-CLICK DISPATCH */}
          {step === 4 && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-150">
              <div className="bg-sand/70 p-5 rounded-2xl border border-outline flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-outline pb-2.5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Monthly Budget</span>
                  <span className="font-editorial text-2xl font-bold text-terracotta">₹{totalMonthlyCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex flex-col gap-2 text-xs font-medium text-gray-600">
                  <div className="flex justify-between">
                    <span>Stay ({stayOptions.find(s => s.id === selectedStay)?.name})</span>
                    <span className="font-bold text-primary">₹{stayCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiffin Subscription ({mealOptions.find(m => m.id === selectedMeals)?.name})</span>
                    <span className="font-bold text-primary">₹{mealCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domestic Helpers ({domesticHelp.length} services selected)</span>
                    <span className="font-bold text-primary">₹{helpCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arrival Essentials ({extras.length} items selected)</span>
                    <span className="font-bold text-primary">₹{extrasCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-olive-light border border-olive/20 text-olive flex items-start gap-3">
                <span className="material-symbols-outlined text-[22px] flex-shrink-0">verified_user</span>
                <p className="text-xs font-medium leading-relaxed">
                  Basera audits every node personally. Zero brokerage fee will be charged to you. We connect you directly with the verified local providers.
                </p>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppDispatch}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                Dispatch Kit on WhatsApp (Direct Vendor Connect)
              </button>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-outline bg-white flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-outline text-xs font-bold text-gray-600 hover:bg-sand transition-all cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-terracotta hover:bg-[#b04d29] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
            >
              Next Step
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          ) : null}
        </div>

      </div>
    </div>
  );
}
