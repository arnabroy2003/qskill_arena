import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  ShieldCheck,
  User,
  Users,
  Terminal,
  Building,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  Check,
  Plus,
  Trash2,
  Loader2,
  ExternalLink
} from 'lucide-react';

// Google Sheets API Webhook Endpoint (e.g. Google Apps Script Web App URL)
// Can be set directly here or in .env as VITE_GOOGLE_SHEET_URL
const GOOGLE_SHEET_API_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || '';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  collegeName: string;
  studyYear: string;
  preferredDomains: string[];
  otherDomain: string;
  primaryProgrammingSkill: string;
  otherSkill: string;
  experienceLevel: string;
  participationType: 'Individual Participant' | 'Team Participant';
  teamName: string;
  teamSize: number;
  teamMembers: string[];
  interests: string[];
  additionalWords: string;
  consent: boolean;
}

const initialFormState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  collegeName: '',
  studyYear: '',
  preferredDomains: [],
  otherDomain: '',
  primaryProgrammingSkill: '',
  otherSkill: '',
  experienceLevel: '',
  participationType: 'Individual Participant',
  teamName: '',
  teamSize: 2,
  teamMembers: [''],
  interests: [],
  additionalWords: '',
  consent: false,
};

export default function InterestFormPage() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Available options
  const studyYearOptions = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    '5th Year',
    'Postgraduate',
    'Graduated',
    'Other'
  ];

  const domainOptions = [
    'Python Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Full Stack Development',
    'Frontend Development',
    'Backend Development',
    'Java Development',
    'C / C++ Programming',
    'App Development',
    'Cybersecurity',
    'Cloud Computing',
    'Other'
  ];

  const skillOptions = [
    'Python',
    'JavaScript',
    'Java',
    'C',
    'C++',
    'C#',
    'PHP',
    'Go',
    'SQL',
    'Other',
    'Still Learning / Beginner'
  ];

  const experienceLevelOptions = [
    { label: 'Beginner', desc: 'Just started learning.' },
    { label: 'Basic', desc: 'Understand programming fundamentals.' },
    { label: 'Intermediate', desc: 'Can build small projects independently.' },
    { label: 'Advanced', desc: 'Comfortable with complex projects and problem-solving.' },
    { label: 'Experienced', desc: 'Have substantial project or practical experience.' }
  ];

  const interestOptions = [
    'Competing with students across India.',
    'Winning cash prizes and goodies.',
    'Earning certificates and recognition.',
    'Testing my technical skills.',
    'Solving real-world problems.',
    'Learning new technologies.',
    'Networking with other tech enthusiasts.',
    'Improving my confidence.',
    'Showcasing my abilities.'
  ];

  // Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        ...(name === 'primaryProgrammingSkill' && value !== 'Other' ? { otherSkill: '' } : {})
      }));
    }
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const toggleDomain = (domain: string) => {
    setFormData(prev => {
      const exists = prev.preferredDomains.includes(domain);
      const updated = exists
        ? prev.preferredDomains.filter(d => d !== domain)
        : [...prev.preferredDomains, domain];
      return { 
        ...prev, 
        preferredDomains: updated,
        ...(domain === 'Other' && exists ? { otherDomain: '' } : {})
      };
    });
    if (errors.preferredDomains) {
      setErrors(prev => {
        const u = { ...prev };
        delete u.preferredDomains;
        return u;
      });
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const handleTeamMemberChange = (index: number, val: string) => {
    setFormData(prev => {
      const updated = [...prev.teamMembers];
      updated[index] = val;
      return { ...prev, teamMembers: updated };
    });
  };

  const addTeamMember = () => {
    if (formData.teamMembers.length < formData.teamSize - 1) {
      setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, ''] }));
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Indian phone regex: 10 digits starting with 6, 7, 8, or 9
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.location.trim()) newErrors.location = 'Current Location (City, State) is required.';
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College or University Name is required.';
    if (!formData.studyYear) newErrors.studyYear = 'Please select your current year of study.';
    if (formData.preferredDomains.length === 0) newErrors.preferredDomains = 'Select at least one preferred domain.';
    if (!formData.primaryProgrammingSkill) newErrors.primaryProgrammingSkill = 'Please select your primary skill.';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Please select your current experience level.';
    if (!formData.consent) newErrors.consent = 'You must acknowledge the terms to proceed.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submission to Google Sheets
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      const firstErrorEl = document.querySelector('[data-error="true"]');
      if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: `+91 ${formData.phone.trim()}`,
        location: formData.location.trim(),
        collegeName: formData.collegeName.trim(),
        studyYear: formData.studyYear,
        preferredDomains: formData.preferredDomains.join(', '),
        otherDomain: formData.otherDomain ? formData.otherDomain.trim() : '',
        primaryProgrammingSkill: formData.primaryProgrammingSkill,
        otherSkill: formData.otherSkill ? formData.otherSkill.trim() : '',
        experienceLevel: formData.experienceLevel,
        participationType: formData.participationType,
        teamName: formData.participationType === 'Team Participant' ? formData.teamName.trim() : '',
        teamSize: formData.participationType === 'Team Participant' ? formData.teamSize : '',
        teamMembers: formData.participationType === 'Team Participant' ? formData.teamMembers.filter(m => m.trim() !== '').join(', ') : '',
        interests: formData.interests.join(', '),
        additionalWords: formData.additionalWords.trim(),
        consent: formData.consent ? 'Yes' : 'No'
      };

      if (GOOGLE_SHEET_API_URL) {
        await fetch(GOOGLE_SHEET_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Fallback simulation when VITE_GOOGLE_SHEET_URL is not set yet
        await new Promise(resolve => setTimeout(resolve, 700));
        console.log('Interest form submission payload (Set VITE_GOOGLE_SHEET_URL to send to Google Sheets):', payload);
      }

      setIsSubmittedSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Failed to record expression of interest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070910] text-[#F8FAFC] font-sans selection:bg-violet-600/40 selection:text-white relative overflow-x-hidden antialiased py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Matrix & Subtle Gradient Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(139, 92, 246, 0.25) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 80px 80px'
        }}
      />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Navigation Breadcrumb / Brand */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <a href="/" className="flex items-center gap-2.5 text-slate-300 hover:text-white transition group">
            <img 
              src="https://i.ibb.co/B5BSy9kd/q-trans.png" 
              alt="Q-logo" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.45)]"
            />
            <div className="flex flex-col">
              <span className="font-mono text-sm uppercase font-bold tracking-wider text-white">
                QSkill <span className="text-violet-400">Arena 2026</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 -mt-0.5">by QSkill</span>
            </div>
          </a>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>INTEREST FORM OPEN</span>
          </div>
        </div>

        {/* SUCCESS STATE */}
        {isSubmittedSuccess ? (
          <div className="rounded-2xl bg-gradient-to-b from-[#17122a] via-[#101426] to-[#0a0d18] border-2 border-cyan-400/60 p-8 sm:p-14 text-center shadow-2xl shadow-cyan-950/50 my-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 p-[2px] mx-auto mb-6 shadow-xl shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0c1020] rounded-[14px] flex items-center justify-center text-cyan-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>
            <div className="inline-block px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-4">
              EXPRESSION RECORDED
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              You're on Our Radar!
            </h1>
            <p className="text-base sm:text-lg text-[#A5B4CC] max-w-xl mx-auto leading-relaxed mb-8">
              Thank you for your interest in QSkill Arena 2026. We've received your expression of interest. Stay connected with QSkill for upcoming announcements, participation guidelines and registration updates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-lg shadow-violet-950/50 hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <span>BACK TO QSKILL ARENA</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* 2. PAGE HEADER */}
            <header className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/50 border border-violet-500/40 text-violet-300 text-xs font-mono uppercase tracking-widest font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                EXPRESSION OF INTEREST
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4">
                Ready to Enter Your Arena?
              </h1>
              <p className="text-base sm:text-lg text-[#A5B4CC] max-w-2xl mx-auto leading-relaxed">
                Tell us a little about yourself and your technical interests. Register your interest in QSkill Arena 2026 and be among the first to receive tournament updates, participation details and announcements.
              </p>
              <div className="mt-3 text-xs font-mono text-slate-500">
                Note: This is an Expression of Interest form, NOT the final tournament registration.
              </div>
            </header>

            {/* 3. TOURNAMENT INFORMATION CARD */}
            <section className="mb-12 rounded-2xl bg-[#0e1324]/80 border border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-2 mb-3 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                About QSkill Arena
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                QSkill Arena is a student-focused technology competition where participants from different technical domains come together to demonstrate their skills, solve challenges, compete and earn recognition.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Prize Pool Card */}
                <div className="p-4 rounded-xl bg-[#070910] border border-amber-400/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-amber-300 font-bold uppercase">Prize Pool</span>
                      <Trophy className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl font-mono font-black text-amber-400 mb-2">
                      ₹28,000 Pool
                    </div>
                    <ul className="text-[11px] font-mono text-slate-300 space-y-1">
                      <li>• Champion: ₹20,000 + gifts & goodies</li>
                      <li>• Runner-Up: ₹8,000 + gifts & goodies</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500">
                    PROPOSED ALLOCATIONS
                  </div>
                </div>

                {/* Certificates Card */}
                <div className="p-4 rounded-xl bg-[#070910] border border-violet-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-violet-300 font-bold uppercase">Certificates</span>
                      <Award className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="text-xl font-mono font-black text-violet-300 mb-2">
                      Multi-Tier Merit
                    </div>
                    <ul className="text-[11px] font-mono text-slate-300 space-y-1">
                      <li>• Participation Certificate (All eligible)</li>
                      <li>• QSkill Qualified (Round 1)</li>
                      <li>• QSkill Elite (Round 3) & Finalist</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500">
                    OFFICIAL RECOGNITION
                  </div>
                </div>

                {/* Entry Fee Card */}
                <div className="p-4 rounded-xl bg-[#070910] border border-cyan-400/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-cyan-300 font-bold uppercase">Entry Fee</span>
                      <Tag className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-xl font-mono font-black text-cyan-300 mb-2">
                      ₹49 / ₹99
                    </div>
                    <ul className="text-[11px] font-mono text-slate-300 space-y-1">
                      <li>• Existing QSkill Students: ₹49</li>
                      <li>• Standard Entry Fee: ₹99</li>
                      <li>• No fee collected on this page</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500">
                    PROPOSED REGISTRATION RATES
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-slate-400">
                These are the currently proposed tournament details. Final rules, eligibility, fee collection instructions and participation guidelines will be shared through official announcements.
              </div>
            </section>

            {/* ERROR BANNER IF ANY */}
            {submitError && (
              <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs sm:text-sm font-mono flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold mb-0.5">Submission Notice</div>
                  <div>{submitError}</div>
                </div>
              </div>
            )}

            {/* 4. INTEREST FORM */}
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* SECTION A: Personal Information */}
              <div className="rounded-2xl bg-[#111729] border border-white/10 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/5 text-violet-300 font-mono text-sm font-bold uppercase tracking-wider">
                  <User className="w-4 h-4 text-cyan-400" />
                  Section A — Personal Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div data-error={Boolean(errors.fullName)}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className={`w-full px-4 py-3 rounded-xl bg-[#070910] border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                        errors.fullName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs font-mono text-red-400">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div data-error={Boolean(errors.email)}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@domain.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#070910] border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                          errors.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                        }`}
                      />
                      <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs font-mono text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div data-error={Boolean(errors.phone)}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-white/10 bg-white/[0.03] text-xs font-mono text-slate-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        maxLength={10}
                        className={`w-full px-4 py-3 rounded-r-xl bg-[#070910] border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                          errors.phone 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs font-mono text-red-400">{errors.phone}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div data-error={Boolean(errors.location)}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Current Location <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Kolkata, West Bengal"
                        className={`w-full px-4 py-3 rounded-xl bg-[#070910] border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                          errors.location 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                        }`}
                      />
                      <MapPin className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-xs font-mono text-red-400">{errors.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION B: Academic Information */}
              <div className="rounded-2xl bg-[#111729] border border-white/10 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/5 text-violet-300 font-mono text-sm font-bold uppercase tracking-wider">
                  <Building className="w-4 h-4 text-cyan-400" />
                  Section B — Academic Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* College Name */}
                  <div data-error={Boolean(errors.collegeName)}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      College / University Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      placeholder="e.g. IIT"
                      className={`w-full px-4 py-3 rounded-xl bg-[#070910] border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                        errors.collegeName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                      }`}
                    />
                    {errors.collegeName && (
                      <p className="mt-1 text-xs font-mono text-red-400">{errors.collegeName}</p>
                    )}
                  </div>

                  {/* Study Year */}
                  <div data-error={Boolean(errors.studyYear)}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Current Year of Study <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="studyYear"
                      value={formData.studyYear}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl bg-[#070910] border text-sm text-white focus:outline-none focus:ring-1 transition ${
                        errors.studyYear 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                      }`}
                    >
                      <option value="" disabled>Select Year</option>
                      {studyYearOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0c1020] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.studyYear && (
                      <p className="mt-1 text-xs font-mono text-red-400">{errors.studyYear}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION C: Technical Background */}
              <div className="rounded-2xl bg-[#111729] border border-white/10 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/5 text-violet-300 font-mono text-sm font-bold uppercase tracking-wider">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Section C — Technical Background
                </div>

                {/* Preferred Domains Multi-select */}
                <div className="mb-6" data-error={Boolean(errors.preferredDomains)}>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Preferred Domain(s) <span className="text-rose-400">*</span>
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                    Select all technology domains you would be interested in competing or qualifying within:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {domainOptions.map((domain) => {
                      const selected = formData.preferredDomains.includes(domain);
                      return (
                        <button
                          type="button"
                          key={domain}
                          onClick={() => toggleDomain(domain)}
                          className={`p-3 rounded-xl border text-left text-xs font-mono flex items-center justify-between transition ${
                            selected
                              ? 'bg-violet-950/60 border-cyan-400 text-cyan-300 shadow-md'
                              : 'bg-[#070910] border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <span>{domain}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            selected ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-slate-600'
                          }`}>
                            {selected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Conditional text input when "Other" domain is selected */}
                  {formData.preferredDomains.includes('Other') && (
                    <div className="mt-3.5 p-4 rounded-xl bg-[#090d1c] border border-cyan-400/40 animate-in fade-in duration-200">
                      <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300 mb-1.5 font-semibold">
                        Specify Your Other Domain(s)
                      </label>
                      <input
                        type="text"
                        name="otherDomain"
                        value={formData.otherDomain}
                        onChange={handleInputChange}
                        placeholder="e.g. Blockchain, Game Dev, Embedded Systems, IoT, etc."
                        className="w-full px-4 py-2.5 rounded-lg bg-[#070910] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition font-mono"
                        autoFocus
                      />
                    </div>
                  )}

                  {errors.preferredDomains && (
                    <p className="mt-2 text-xs font-mono text-red-400">{errors.preferredDomains}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Primary Programming Skill */}
                  <div data-error={Boolean(errors.primaryProgrammingSkill)}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Primary Programming Skill <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="primaryProgrammingSkill"
                      value={formData.primaryProgrammingSkill}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl bg-[#070910] border text-sm text-white focus:outline-none focus:ring-1 transition ${
                        errors.primaryProgrammingSkill 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                      }`}
                    >
                      <option value="" disabled>Select Primary Skill</option>
                      {skillOptions.map((skill) => (
                        <option key={skill} value={skill} className="bg-[#0c1020] text-white">
                          {skill}
                        </option>
                      ))}
                    </select>
                    {formData.primaryProgrammingSkill === 'Other' && (
                      <div className="mt-2.5 animate-in fade-in duration-200">
                        <input
                          type="text"
                          name="otherSkill"
                          value={formData.otherSkill}
                          onChange={handleInputChange}
                          placeholder="Please specify your programming language"
                          className="w-full px-4 py-2.5 rounded-lg bg-[#070910] border border-cyan-400/40 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition font-mono"
                          autoFocus
                        />
                      </div>
                    )}
                    {errors.primaryProgrammingSkill && (
                      <p className="mt-1 text-xs font-mono text-red-400">{errors.primaryProgrammingSkill}</p>
                    )}
                  </div>

                  {/* Current Experience Level */}
                  <div data-error={Boolean(errors.experienceLevel)}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Current Experience Level <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl bg-[#070910] border text-sm text-white focus:outline-none focus:ring-1 transition ${
                        errors.experienceLevel 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                      }`}
                    >
                      <option value="" disabled>Select Level</option>
                      {experienceLevelOptions.map((lvl) => (
                        <option key={lvl.label} value={`${lvl.label} — ${lvl.desc}`} className="bg-[#0c1020] text-white">
                          {lvl.label} — {lvl.desc}
                        </option>
                      ))}
                    </select>
                    {errors.experienceLevel && (
                      <p className="mt-1 text-xs font-mono text-red-400">{errors.experienceLevel}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION D: Participation Preferences */}
              <div className="rounded-2xl bg-[#111729] border border-white/10 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/5 text-violet-300 font-mono text-sm font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Section D — Participation Preferences
                </div>

                {/* Participation Type Cards */}
                <div className="mb-6">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
                    How would you like to participate? <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, participationType: 'Individual Participant' }))}
                      className={`p-5 rounded-xl border text-left transition ${
                        formData.participationType === 'Individual Participant'
                          ? 'bg-gradient-to-b from-violet-950/60 to-[#0c1020] border-cyan-400 text-white shadow-lg'
                          : 'bg-[#070910] border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <User className="w-5 h-5 text-cyan-400" />
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          formData.participationType === 'Individual Participant' ? 'bg-cyan-400/20 text-cyan-300' : 'text-slate-500'
                        }`}>
                          SOLO
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">Individual Participant</h4>
                      <p className="text-xs text-slate-400">Compete solo representing yourself throughout the rounds.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, participationType: 'Team Participant' }))}
                      className={`p-5 rounded-xl border text-left transition ${
                        formData.participationType === 'Team Participant'
                          ? 'bg-gradient-to-b from-violet-950/60 to-[#0c1020] border-cyan-400 text-white shadow-lg'
                          : 'bg-[#070910] border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Users className="w-5 h-5 text-violet-400" />
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          formData.participationType === 'Team Participant' ? 'bg-violet-400/20 text-violet-300' : 'text-slate-500'
                        }`}>
                          SQUAD
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">Team Participant</h4>
                      <p className="text-xs text-slate-400">Collaborate with peers to solve complex engineering challenges.</p>
                    </button>
                  </div>
                </div>

                {/* Conditional Team Details */}
                {formData.participationType === 'Team Participant' && (
                  <div className="mb-6 p-5 rounded-xl bg-[#090d1c] border border-violet-500/30 space-y-4 animate-in fade-in duration-200">
                    <div className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Team Information (Proposed)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Subject to official rules</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">
                          Team Name (Optional)
                        </label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleInputChange}
                          placeholder="e.g. Code Titans"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#070910] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">
                          Number of Team Members
                        </label>
                        <select
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={(e) => {
                            const newSize = Number(e.target.value);
                            setFormData(prev => ({
                              ...prev,
                              teamSize: newSize,
                              teamMembers: prev.teamMembers.slice(0, newSize - 1)
                            }));
                          }}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#070910] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-400"
                        >
                          {[2, 3, 4, 5].map(num => (
                            <option key={num} value={num} className="bg-[#0c1020] text-white">
                              {num} Members
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-mono text-slate-300">
                          Other Team Members' Names (Optional)
                        </label>
                        {formData.teamMembers.length < formData.teamSize - 1 && (
                          <button
                            type="button"
                            onClick={addTeamMember}
                            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Member
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {formData.teamMembers.map((member, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={member}
                              onChange={(e) => handleTeamMemberChange(idx, e.target.value)}
                              placeholder={`Member ${idx + 2} Full Name`}
                              className="flex-1 px-3 py-2 rounded-lg bg-[#070910] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-400"
                            />
                            {formData.teamMembers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTeamMember(idx)}
                                className="p-2 text-slate-500 hover:text-rose-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] font-mono text-slate-400 italic">
                      * Final team size and team participation rules will be announced officially.
                    </p>
                  </div>
                )}

                {/* What interests you most */}
                <div className="mb-6">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    What interests you most about QSkill Arena? (Optional)
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                    Choose as many as apply to help us calibrate the event:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {interestOptions.map((interest) => {
                      const selected = formData.interests.includes(interest);
                      return (
                        <button
                          type="button"
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`p-3 rounded-xl border text-left text-xs font-mono flex items-start justify-between transition ${
                            selected
                              ? 'bg-cyan-950/40 border-cyan-400/80 text-cyan-200'
                              : 'bg-[#070910] border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <span className="leading-snug pr-2">{interest}</span>
                          <div className={`w-3.5 h-3.5 rounded border mt-0.5 shrink-0 flex items-center justify-center ${
                            selected ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-slate-600'
                          }`}>
                            {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Words */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Additional Words (Optional)
                  </label>
                  <textarea
                    rows={3}
                    name="additionalWords"
                    value={formData.additionalWords}
                    onChange={handleInputChange}
                    placeholder="Tell us anything else you'd like us to know about your interests, skills or expectations."
                    className="w-full px-4 py-3 rounded-xl bg-[#070910] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              {/* 5. CONSENT & SUBMISSION */}
              <div className="rounded-2xl bg-[#111729] border border-white/10 p-6 sm:p-8 shadow-xl">
                <div data-error={Boolean(errors.consent)} className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        formData.consent 
                          ? 'bg-cyan-400 border-cyan-400 text-black' 
                          : errors.consent
                            ? 'border-red-500 bg-[#070910]'
                            : 'border-white/20 bg-[#070910] group-hover:border-cyan-400'
                      }`}>
                        {formData.consent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-300 leading-relaxed select-none">
                      I understand that this form is only an <strong className="text-white">Expression of Interest</strong> and does not confirm my final participation or registration in QSkill Arena 2026. I agree to receive official updates and announcements regarding the competition.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-2 text-xs font-mono text-red-400 pl-8">{errors.consent}</p>
                  )}
                </div>

                {/* Submit Action Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <div className="text-xs font-mono text-slate-500">
                    No payment details required. Pre-launch interest registry.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-cyan-400 text-white font-mono text-sm uppercase tracking-wider font-extrabold shadow-xl shadow-violet-950/60 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>RECORDING INTEREST...</span>
                      </>
                    ) : (
                      <>
                        <span>SUBMIT MY INTEREST</span>
                        <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition duration-200" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {/* Minimal Page Footer */}
        <footer className="mt-16 pt-6 border-t border-white/5 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 QSkill Arena. Organized by QSkill.</span>
          <span className="text-[11px] text-slate-600">
            PRE-LAUNCH EXPRESSION OF INTEREST PORTAL
          </span>
        </footer>
      </div>
    </div>
  );
}