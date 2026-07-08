'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CITIES = [
  { name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Delhi', slug: 'delhi', state: 'Delhi NCR', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
  { name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana', image: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pune', slug: 'pune', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=400&q=80' }
];

const PRIORITIES = [
  { id: 'housing', name: 'Housing & PG', icon: '🏠', color: 'bg-white border-outline text-gray-700 hover:border-gray-400' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: 'bg-white border-outline text-gray-700 hover:border-gray-400' },
  { id: 'grocery', name: 'Fresh Groceries', icon: '🛒', color: 'bg-white border-outline text-gray-700 hover:border-gray-400' },
  { id: 'services', name: 'Home Services', icon: '🔧', color: 'bg-white border-outline text-gray-700 hover:border-gray-400' },
  { id: 'tiffin', name: 'Tiffin & Mess', icon: '🍱', color: 'bg-white border-outline text-gray-700 hover:border-gray-400' },
  { id: 'gym', name: 'Gym & Fitness', icon: '💪', color: 'bg-white border-outline text-gray-700 hover:border-gray-400' },
  { id: 'maid', name: 'Maids & Cooks', icon: '🧹', color: 'bg-white border-outline text-gray-700 hover:border-gray-400' },
  { id: 'transport', name: 'Local Transport', icon: '🚌', color: 'bg-white border-outline text-gray-700 hover:border-gray-400' }
];

export default function Onboard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [budget, setBudget] = useState(15000);

  const handleCitySelect = (slug) => {
    setSelectedCity(slug);
    setStep(2);
  };

  const togglePriority = (id) => {
    setSelectedPriorities(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const preferences = {
      city: selectedCity,
      priorities: selectedPriorities,
      budget: budget,
      onboarded: true,
      checklist: [
        { id: 1, text: 'Rent Agreement', completed: true, category: 'housing' },
        { id: 2, text: 'WiFi Setup', completed: false, category: 'housing' },
        { id: 3, text: 'Find local tiffin service', completed: false, category: 'tiffin' },
        { id: 4, text: 'Hire regular cook/maid', completed: false, category: 'maid' },
        { id: 5, text: 'Register at nearby gym', completed: false, category: 'gym' },
        { id: 6, text: 'Locate nearest Metro/Bus stop', completed: false, category: 'transport' },
        { id: 7, text: 'Gas Connection setup', completed: false, category: 'housing' },
        { id: 8, text: 'Find nearest Sabji Mandi', completed: false, category: 'grocery' }
      ]
    };
    
    localStorage.setItem('basera_preferences', JSON.stringify(preferences));
    router.push(`/${selectedCity}`);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col justify-between bg-pattern">
      {/* Header */}
      <header className="px-6 py-5 max-w-max-width-desktop mx-auto w-full flex justify-between items-center z-10">
        <Link href="/" className="font-plus-jakarta text-2xl font-bold text-primary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[26px] text-primary">home_pin</span>
          <span>Basera</span>
        </Link>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step {step} of 3</span>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-6 py-8 z-10">
        <div className="bg-white rounded-card border border-outline p-8 w-full max-w-2xl shadow-sm">
          
          {/* STEP 1: Select City */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-plus-jakarta text-xl font-bold text-primary mb-1">Which city are you moving to?</h2>
                <p className="text-xs text-gray-500 font-semibold">Choose your destination to personalize your relocation dashboard.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CITIES.map(city => (
                  <button
                    key={city.slug}
                    onClick={() => handleCitySelect(city.slug)}
                    className="group relative h-40 rounded-xl overflow-hidden border border-outline text-left active:scale-98 transition-all hover:shadow-sm"
                  >
                    <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent z-10"></div>
                    <div className="absolute bottom-4 left-4 text-white z-20">
                      <p className="text-sm font-bold leading-none">{city.name}</p>
                      <p className="text-[10px] text-white/70 font-semibold mt-1 tracking-wider uppercase">{city.state}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Choose Priorities */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-plus-jakarta text-xl font-bold text-primary mb-1">What are your immediate needs?</h2>
                <p className="text-xs text-gray-500 font-semibold">Select all elements you want to prioritize setting up.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {PRIORITIES.map(priority => {
                  const isSelected = selectedPriorities.includes(priority.id);
                  return (
                    <button
                      key={priority.id}
                      onClick={() => togglePriority(priority.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left text-xs font-bold ${
                        isSelected 
                          ? 'bg-primary border-primary text-white' 
                          : 'bg-white border-outline text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-xl">{priority.icon}</span>
                      <span>{priority.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 rounded-full border border-primary text-primary font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={selectedPriorities.length === 0}
                  className="px-8 py-2.5 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Monthly Budget */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-plus-jakarta text-xl font-bold text-primary mb-1">Set your monthly budget</h2>
                <p className="text-xs text-gray-500 font-semibold">We will use this parameter to personalize recommendation listings.</p>
              </div>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Limit</span>
                  <span className="text-base font-bold text-primary">₹{budget.toLocaleString('en-IN')} / month</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="100000" 
                  step="2500" 
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-primary bg-gray-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-full border border-primary text-primary font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleFinish}
                  className="px-8 py-2.5 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                >
                  Configure Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-outline-variant/60">
        <div className="max-w-max-width-desktop mx-auto px-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Basera. Designed for local relocation.</p>
        </div>
      </footer>
    </div>
  );
}
