import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, UserCheck, ShieldCheck, LayoutDashboard, TrendingUp, Users, Smartphone, Zap, Phone, X, Check, Loader2, ExternalLink, Laptop, ArrowLeft, LogIn, HelpCircle, ImageIcon, ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';

const WebsiteView: React.FC = () => {
  // Generate array for 57 images (Removed 58, 59, 60 as requested)
  const images = Array.from({ length: 57 }, (_, i) => i + 1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Quote Form State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    closings: '',
    comments: ''
  });

  // Media Modal State
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  // Enrollment Modal State
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  // Homeowner Portal State
  const [isPortalOptionsOpen, setIsPortalOptionsOpen] = useState(false);
  const [isClaimHelpOpen, setIsClaimHelpOpen] = useState(false);
  const [claimHelpView, setClaimHelpView] = useState<'SELECT' | 'DESKTOP' | 'MOBILE_SELECT' | 'ANDROID' | 'IOS'>('SELECT');

  // Image Error State for Carousel Fallback
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Deep Linking Effect
  useEffect(() => {
    const path = window.location.pathname;

    // 1. Check Pathname for /enrollment
    if (path === '/enrollment') {
      setIsEnrollmentOpen(true);
    }

    // 2. Check Pathname for /warrantyrequests
    if (path === '/warrantyrequests') {
      setIsClaimHelpOpen(true);
      setClaimHelpView('SELECT');
    }

    // 3. Check Query Params
    const params = new URLSearchParams(window.location.search);
    const modalParam = params.get('modal');

    if (modalParam) {
      switch (modalParam) {
        case 'quote':
          setIsQuoteOpen(true);
          break;
        case 'media':
          setIsMediaOpen(true);
          break;
        case 'portal':
          setIsPortalOptionsOpen(true);
          break;
        case 'claim':
          setIsClaimHelpOpen(true);
          setClaimHelpView('SELECT');
          break;
        case 'claim-desktop':
          setIsClaimHelpOpen(true);
          setClaimHelpView('DESKTOP');
          break;
      }
    }
  }, []);

  // BuilderTrend Script Injection for Enrollment Form
  useEffect(() => {
    if (isEnrollmentOpen) {
      const script = document.createElement('script');
      script.src = "https://buildertrend.net/leads/contactforms/js/btClientContactForm.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isEnrollmentOpen]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    // Speed can be adjusted here. 0.5 is a gentle pace.
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (scrollContainer && !isPaused.current) {
        // Infinite scroll logic: if we've scrolled past the first set, reset to 0
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += scrollSpeed;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleInteractionStart = () => {
    isPaused.current = true;
    if (resumeTimeout.current) {
      clearTimeout(resumeTimeout.current);
      resumeTimeout.current = null;
    }
  };

  const handleInteractionEnd = () => {
    // Add delay to allow native momentum scrolling to finish before auto-scroll resumes
    resumeTimeout.current = setTimeout(() => {
      isPaused.current = false;
    }, 1500); 
  };

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      handleInteractionStart();
      const scrollAmount = 300; // Approx card width + margin
      const container = scrollRef.current;
      
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      
      handleInteractionEnd();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const encode = (data: any) => {
      return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
    };

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "quote-request", ...formData })
    })
    .then(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    })
    .catch(error => {
      alert("Submission failed. Please try again or contact us directly.");
      setIsSubmitting(false);
    });
  };

  // Helper to generate internal SVG placeholder if local image fails
  const getPlaceholderImage = (num: number) => {
    const svg = `
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F4F8FB"/>
      <rect x="150" y="100" width="100" height="80" rx="10" fill="#C8D9EA"/>
      <path d="M150 160 L180 130 L210 160 L230 140 L250 160 V180 H150 Z" fill="#A4BFDB"/>
      <text x="50%" y="220" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#4D6487" font-weight="bold">Project ${num}</text>
    </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-white custom-scrollbar" id="home-container">
      
      {/* Hero Section */}
      <section 
        id="home" 
        className="relative w-full min-h-[700px] md:min-h-[90vh] flex flex-col justify-center items-center text-center px-6 md:px-20 overflow-hidden pt-10 pb-32"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/header.png" 
            alt="Cascade Builder Services Hero" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay for improved text contrast - Reduced Blur */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 max-w-5xl flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-4 md:mt-0 p-8">
          
          {/* Centered Logo */}
          <div className="flex flex-col items-center mb-4">
            <img 
              src="/logo.png" 
              alt="Cascade Builder Services Logo" 
              className="h-24 md:h-32 w-auto object-contain drop-shadow-sm mb-2"
            />
            <div className="bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-sm border border-primary-200">
              Since 2008
            </div>
          </div>

          <h1 className="text-display-large text-5xl md:text-7xl lg:text-8xl font-bold text-primary-900 tracking-tight leading-none drop-shadow-sm">
            You Build. <br/>
            <span className="text-primary-600">We Manage.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-700 max-w-3xl leading-relaxed font-medium p-4 rounded-2xl bg-white/30 backdrop-blur-md shadow-sm border border-white/50">
            Partnering with builders to deliver exceptional warranty management and homeowner satisfaction.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mt-8 w-full justify-center">
            {/* Get Quote */}
            <button 
              onClick={() => setIsQuoteOpen(true)}
              className="bg-primary-700 text-white px-8 py-4 rounded-full font-bold hover:bg-primary-600 transition-all hover:shadow-xl active:scale-95 shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              Get a Quote
              <ArrowRight size={20} />
            </button>
            
            {/* Homeowner Portal */}
            <button 
              onClick={() => setIsPortalOptionsOpen(true)}
              className="bg-primary-900 text-white px-8 py-4 rounded-full font-bold hover:bg-primary-800 transition-all hover:shadow-xl active:scale-95 shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              Homeowner Portal
            </button>

            {/* View Media */}
            <button 
              onClick={() => setIsMediaOpen(true)}
              className="bg-white/90 backdrop-blur border border-primary-200 text-primary-900 px-8 py-4 rounded-full font-bold hover:bg-white transition-all flex items-center justify-center shadow-md hover:shadow-lg text-lg"
            >
              View Media
            </button>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="services" className="py-12 px-6 md:px-20 bg-primary-50 relative rounded-t-[3rem] -mt-12 z-30 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-12 py-4 rounded-full bg-primary-200 mb-6 shadow-sm">
              <h3 className="text-xl md:text-2xl font-medium text-primary-900 leading-none">
                Comprehensive Builder Support
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1 - Updated to darker background */}
            <div className="bg-primary-100 p-8 rounded-[2rem] shadow-sm border border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-700 mb-6 group-hover:bg-primary-700 group-hover:text-white transition-colors duration-300">
                <UserCheck size={32} />
              </div>
              <h4 className="text-2xl font-bold text-primary-900 mb-3">New Home Orientations</h4>
              <p className="text-primary-600 leading-relaxed text-lg">
                CBS will walk your buyer through the home, document deficiencies, discuss normal maintenance items and explain the features and components of the home.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-primary-700 text-white p-8 rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-md">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-3">Warranty Management</h4>
              <p className="text-primary-100 leading-relaxed text-lg">
                Our team manages all aspects of your one-year materials and workmanship warranty including a 24 hour hotline for emergency warranty situations.
              </p>
            </div>

            {/* Card 3 - Updated to darker background */}
            <div className="bg-primary-100 p-8 rounded-[2rem] shadow-sm border border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-700 mb-6 group-hover:bg-primary-700 group-hover:text-white transition-colors duration-300">
                <LayoutDashboard size={32} />
              </div>
              <h4 className="text-2xl font-bold text-primary-900 mb-3">My Homepage</h4>
              <p className="text-primary-600 leading-relaxed text-lg">
                This is a personal, secure web portal for your buyers including an internal messaging system, warranty claim module, calendar and document manager.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why CBS? Section */}
      <section id="whycbs" className="py-12 px-6 md:px-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block px-12 py-4 rounded-full bg-primary-200 mb-6 shadow-sm">
              <h2 className="text-xl md:text-2xl font-medium text-primary-900 leading-none">
                Why Choose CBS?
              </h2>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-primary-600 text-lg md:text-xl leading-relaxed mb-16 space-y-6 bg-primary-100 p-8 rounded-[2rem] text-left">
             <h3 className="text-2xl font-bold text-primary-900 mb-4 text-center">Streamline Your Operations and Boost Satisfaction.</h3>
             <p>
               At Cascade Builder Services, we take the headache out of warranty management. We help builders and developers reduce operational costs by handling the heavy lifting:
             </p>
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200 my-6">
               <ul className="list-none space-y-4">
                 <li className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mt-0.5 flex-shrink-0">
                     <Check size={18} strokeWidth={3} />
                   </div>
                   <div>
                     <strong className="text-primary-900 block text-lg">Administration</strong>
                     <span className="text-primary-600">Full management of the builder’s one-year limited warranty.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mt-0.5 flex-shrink-0">
                     <Check size={18} strokeWidth={3} />
                   </div>
                   <div>
                     <strong className="text-primary-900 block text-lg">Onboarding</strong>
                     <span className="text-primary-600">Professional new home orientations.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mt-0.5 flex-shrink-0">
                     <Check size={18} strokeWidth={3} />
                   </div>
                   <div>
                     <strong className="text-primary-900 block text-lg">Quality Control</strong>
                     <span className="text-primary-600">Rigorous QA inspections.</span>
                   </div>
                 </li>
               </ul>
             </div>
             <p>
               With a 17-year track record and over 5,000 homes managed, our team combines deep industry knowledge with cutting-edge technology to serve you, your trade contractors, and your homeowners. Don't let warranty issues slow you down—contact us to see how we can save you time and money.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Benefits... */}
            <div className="flex gap-6 p-6 rounded-3xl hover:bg-primary-50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-700 shadow-sm">
                <TrendingUp size={28} />
              </div>
              <div>
                <h5 className="text-xl font-bold text-primary-900 mb-2">Cost Effective</h5>
                <p className="text-primary-600 text-lg leading-relaxed">Reduce overhead by outsourcing warranty service to a specialized team, saving you time and money.</p>
              </div>
            </div>

            <div className="flex gap-6 p-6 rounded-3xl hover:bg-primary-50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-700 shadow-sm">
                <Users size={28} />
              </div>
              <div>
                <h5 className="text-xl font-bold text-primary-900 mb-2">Expert Team</h5>
                <p className="text-primary-600 text-lg leading-relaxed">Professionals trained specifically in residential construction and high-touch customer service.</p>
              </div>
            </div>

            <div className="flex gap-6 p-6 rounded-3xl hover:bg-primary-50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-700 shadow-sm">
                 <Smartphone size={28} />
              </div>
              <div>
                <h5 className="text-xl font-bold text-primary-900 mb-2">Tech Enabled</h5>
                <p className="text-primary-600 text-lg leading-relaxed">State-of-the-art portal provides full transparency for builders and a seamless experience for buyers.</p>
              </div>
            </div>

            <div className="flex gap-6 p-6 rounded-3xl hover:bg-primary-50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-700 shadow-sm">
                <Zap size={28} />
              </div>
              <div>
                <h5 className="text-xl font-bold text-primary-900 mb-2">Scalable</h5>
                <p className="text-primary-600 text-lg leading-relaxed">We grow with your production volume, ensuring you never fall behind on service requests.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Top Builders Carousel */}
      <section id="testimonials" className="py-12 bg-primary-50 rounded-t-[3rem] overflow-hidden pb-12">
        <div className="text-center mb-16 px-6">
          <div className="inline-block px-12 py-4 rounded-full bg-primary-200 mb-6 shadow-sm">
             <h3 className="text-xl md:text-2xl font-medium text-primary-900 leading-none">
               Trusted by Top Builders
             </h3>
          </div>
          <p className="text-primary-600 text-lg max-w-2xl mx-auto">
            Industry-leading builders choose Cascade Builder Services.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full py-4 group">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-primary-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-primary-50 to-transparent z-10 pointer-events-none"></div>

          {/* Navigation Arrows */}
          <button 
             onClick={() => handleManualScroll('left')}
             className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur text-primary-900 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all border border-primary-200"
             aria-label="Scroll Left"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
             onClick={() => handleManualScroll('right')}
             className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur text-primary-900 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all border border-primary-200"
             aria-label="Scroll Right"
          >
            <ChevronRight size={24} />
          </button>

          {/* Interactive Scroll Container */}
          <div 
            ref={scrollRef}
            className="flex w-full overflow-x-auto no-scrollbar"
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            style={{ WebkitOverflowScrolling: 'touch' }} // Smooth momentum scroll on iOS
          >
            {/* Duplicate array for seamless looping visual */}
            {[...images, ...images].map((num, i) => (
              <div key={i} className="relative w-[220px] md:w-[300px] aspect-[4/3] mx-3 rounded-2xl overflow-hidden border border-primary-200 shadow-sm flex-shrink-0 bg-white p-2">
                <img 
                  src={imageErrors[i] ? getPlaceholderImage(num) : `/${num}.png`}
                  alt={`Construction Project ${num}`}
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                  onError={() => handleImageError(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 px-6 md:px-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
             <div className="inline-block px-12 py-4 rounded-full bg-primary-200 mb-6 shadow-sm">
               <h3 className="text-xl md:text-2xl font-medium text-primary-900 leading-none">
                 Contact Us
               </h3>
             </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* General Questions */}
            <div className="bg-primary-100 rounded-[2.5rem] p-10 text-center border border-primary-200">
               <p className="text-xl text-primary-600 mb-2 font-medium">For general questions, call us at</p>
               <a href="tel:8884295468" className="text-4xl md:text-5xl font-bold text-primary-900 tracking-tight hover:text-primary-700 transition-colors">
                 888-429-5468
               </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Homeowners */}
               <div className="bg-primary-50 rounded-[2.5rem] p-8 md:p-10 border border-primary-100">
                  <h4 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <UserCheck size={28} className="text-primary-700"/> Homeowners
                  </h4>
                  <p className="text-lg text-primary-600 leading-relaxed">
                    With questions or warranty requests, please <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="text-primary-800 font-bold underline hover:text-primary-600 transition-colors">login to your online account above</button> and send us a message or submit a warranty request.
                  </p>
               </div>

               {/* Builders */}
               <div className="bg-primary-50 rounded-[2.5rem] p-8 md:p-10 border border-primary-100">
                  <h4 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <Laptop size={28} className="text-primary-700"/> Builders
                  </h4>
                  <p className="text-lg text-primary-600 leading-relaxed mb-6">
                    With questions about our service or pricing please use our inquiry form.
                  </p>
                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    className="bg-primary-700 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-600 transition-all hover:shadow-lg flex items-center gap-2"
                  >
                    Get a Quote <ArrowRight size={20} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form Modal */}
      {isEnrollmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsEnrollmentOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl p-0 animate-in zoom-in-95 duration-200 flex flex-col">
            
            <button 
              onClick={() => setIsEnrollmentOpen(false)}
              className="absolute top-4 right-4 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors z-50 bg-white/80 backdrop-blur"
            >
              <X size={24} />
            </button>
            
            <div className="p-6 md:p-8 flex flex-col items-center">
               <h3 className="text-2xl font-bold text-primary-900 mb-6">Enrollment Form</h3>
               <div className="w-full">
                 <iframe 
                    src="https://buildertrend.net/leads/contactforms/ContactFormFrame.aspx?builderID=14554" 
                    scrolling="no" 
                    id="btIframe" 
                    style={{ background: 'transparent', border: '0px', margin: '0 auto', width: '100%' }}
                    title="BuilderTrend Enrollment Form"
                 ></iframe>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* Homeowner Portal Options Modal */}
      {isPortalOptionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsPortalOptionsOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200">
             <button 
              onClick={() => setIsPortalOptionsOpen(false)}
              className="absolute top-4 right-4 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-center text-primary-900 mb-8">Homeowner Portal</h3>
            <div className="flex flex-col gap-4">
              <a 
                href="https://buildertrend.net" 
                target="_blank" 
                rel="noreferrer"
                className="bg-primary-700 text-white p-4 rounded-full font-bold text-center hover:bg-primary-600 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                Login <LogIn size={20} />
              </a>
              <button 
                onClick={() => {
                  setIsPortalOptionsOpen(false);
                  setIsClaimHelpOpen(true);
                  setClaimHelpView('SELECT');
                }}
                className="bg-primary-100 text-primary-900 p-4 rounded-full font-bold hover:bg-primary-200 transition-all flex items-center justify-center gap-2"
              >
                How to Make a Claim <HelpCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How to Make a Claim Modal */}
      {isClaimHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsClaimHelpOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 flex flex-col">
            
            <button 
              onClick={() => setIsClaimHelpOpen(false)}
              className="absolute top-6 right-6 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors z-20"
            >
              <X size={24} />
            </button>

            {claimHelpView === 'SELECT' && (
              <div className="flex flex-col items-center text-center py-8">
                <h3 className="text-2xl md:text-3xl font-bold text-primary-900 mb-6">How to Submit Warranty Requests</h3>
                <p className="text-lg text-primary-600 max-w-lg mb-8">
                  If you have not activated your online account, please email us at <a href="mailto:info@cascadebuilderservices.com" className="text-primary-800 font-bold underline">info@cascadebuilderservices.com</a>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                   <button 
                     onClick={() => setClaimHelpView('DESKTOP')}
                     className="flex-1 bg-primary-700 text-white p-6 rounded-3xl hover:bg-primary-600 transition-all flex flex-col items-center gap-4 group shadow-md"
                   >
                     <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Laptop size={32} />
                     </div>
                     <span className="text-xl font-bold">Desktop</span>
                   </button>

                   <button 
                     onClick={() => setClaimHelpView('MOBILE_SELECT')}
                     className="flex-1 bg-primary-100 text-primary-900 p-6 rounded-3xl hover:bg-primary-200 transition-all flex flex-col items-center gap-4 group"
                   >
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Smartphone size={32} />
                     </div>
                     <span className="text-xl font-bold">Mobile</span>
                   </button>
                </div>
              </div>
            )}

            {claimHelpView === 'MOBILE_SELECT' && (
              <div className="flex flex-col items-center text-center py-8">
                <button 
                  onClick={() => setClaimHelpView('SELECT')}
                  className="absolute top-6 left-6 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors flex items-center gap-1"
                >
                  <ArrowLeft size={20} /> Back
                </button>
                <h3 className="text-2xl md:text-3xl font-bold text-primary-900 mb-8">Select Your Device</h3>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                   <button 
                     onClick={() => setClaimHelpView('ANDROID')}
                     className="flex-1 bg-white border border-primary-200 p-6 rounded-3xl hover:bg-primary-50 transition-all flex flex-col items-center gap-4 group shadow-sm hover:shadow-md"
                   >
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Smartphone size={32} />
                     </div>
                     <span className="text-xl font-bold text-primary-900">Android</span>
                   </button>

                   <button 
                     onClick={() => setClaimHelpView('IOS')}
                     className="flex-1 bg-white border border-primary-200 p-6 rounded-3xl hover:bg-primary-50 transition-all flex flex-col items-center gap-4 group shadow-sm hover:shadow-md"
                   >
                     <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Smartphone size={32} />
                     </div>
                     <span className="text-xl font-bold text-primary-900">iOS</span>
                   </button>
                </div>
              </div>
            )}

            {claimHelpView === 'ANDROID' && (
              <div className="flex flex-col gap-8 pb-8">
                 <div className="flex items-center gap-4 border-b border-primary-100 pb-6">
                  <button 
                    onClick={() => setClaimHelpView('MOBILE_SELECT')}
                    className="p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <h3 className="text-2xl font-bold text-primary-900">Android Instructions</h3>
                </div>

                <div className="space-y-10">
                   {/* Step 1 */}
                   <div>
                     <p className="text-lg text-primary-700 mb-4 leading-relaxed font-medium">
                       Download and install the Android app below:
                     </p>
                     <a href="https://play.google.com/store/apps/details?id=com.BuilderTREND.btMobileApp" target="_blank" rel="noreferrer" className="inline-block hover:opacity-80 transition-opacity">
                       <img src="/playstore.png" alt="Get it on Google Play" className="h-16" />
                     </a>
                   </div>

                   {/* Step 2 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Login to the app:
                     </p>
                     <img 
                       src="/alogin.png" 
                       alt="Login Screen" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 3 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Click on "Warranty Items"
                     </p>
                     <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">
                       (DO NOT submit requests under the “To-Do’s” tab. We will not be notified and doing so will delay the processing of your claims)
                     </p>
                     <img 
                       src="/aitems.png" 
                       alt="Warranty Items Tab" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 4 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       To add a new warranty request, click the blue circle icon on the bottom right corner:
                     </p>
                     <img 
                       src="/aadd.png" 
                       alt="Add Button" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 5 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Please submit warranty requests individually. Fill out the form including all pertinent information.
                     </p>
                     <img 
                       src="/aind.png" 
                       alt="Fill Form" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 6 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Please attach pictures and/or video by clicking the Add Attachment text:
                     </p>
                     <img 
                       src="/apic.png" 
                       alt="Add Attachment" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Final Step */}
                   <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                     <p className="text-lg text-green-800 font-medium">
                       After filling out the details and attaching pictures/videos, click Save at the top right corner. After you've filled out and saved each request, individually, we'll contact you by the end of the next business day explaining the next steps.
                     </p>
                   </div>
                </div>
              </div>
            )}

            {claimHelpView === 'IOS' && (
              <div className="flex flex-col gap-8 pb-8">
                 <div className="flex items-center gap-4 border-b border-primary-100 pb-6">
                  <button 
                    onClick={() => setClaimHelpView('MOBILE_SELECT')}
                    className="p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <h3 className="text-2xl font-bold text-primary-900">iOS Instructions</h3>
                </div>

                <div className="space-y-10">
                   {/* Step 1 */}
                   <div>
                     <p className="text-lg text-primary-700 mb-4 leading-relaxed font-medium">
                       Download and install the iOS app below:
                     </p>
                     <a href="https://apps.apple.com/us/app/buildertrend/id504370616" target="_blank" rel="noreferrer" className="inline-block hover:opacity-80 transition-opacity">
                       <img src="/appstore.png" alt="Download on the App Store" className="h-16" />
                     </a>
                   </div>

                   {/* Step 2 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Login to the app:
                     </p>
                     <img 
                       src="/ilogin.png" 
                       alt="Login Screen" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 3 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Click on "Warranty Items"
                     </p>
                     <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">
                       (DO NOT submit requests under the “To-Do’s” tab. We will not be notified and doing so will delay the processing of your claims)
                     </p>
                     <img 
                       src="/iitems.png" 
                       alt="Warranty Items Tab" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 4 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       To add a new warranty request, click the blue circle icon on the bottom right corner:
                     </p>
                     <img 
                       src="/iadd.png" 
                       alt="Add Button" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 5 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Please submit warranty requests individually. Fill out the form including all pertinent information.
                     </p>
                     <img 
                       src="/aind.png" 
                       alt="Fill Form" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 6 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Please attach pictures and/or video by clicking the Add Attachment text:
                     </p>
                     <img 
                       src="/ipic.png" 
                       alt="Add Attachment" 
                       className="w-full max-w-sm mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Final Step */}
                   <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                     <p className="text-lg text-green-800 font-medium">
                       After filling out the details and attaching pictures/videos, click Save at the top right corner. After you've filled out and saved each request, individually, we'll contact you by the end of the next business day explaining the next steps.
                     </p>
                   </div>
                </div>
              </div>
            )}

            {claimHelpView === 'DESKTOP' && (
              <div className="flex flex-col gap-8 pb-8">
                <div className="flex items-center gap-4 border-b border-primary-100 pb-6">
                  <button 
                    onClick={() => setClaimHelpView('SELECT')}
                    className="p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <h3 className="text-2xl font-bold text-primary-900">Desktop Instructions</h3>
                </div>

                <div className="space-y-10">
                   {/* Step 1 */}
                   <div>
                     <p className="text-lg text-primary-700 mb-4 leading-relaxed">
                       The first step is to login to your account. You can login here: <a href="https://buildertrend.net" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-4 py-1 ml-1 bg-primary-700 text-white text-sm font-bold rounded-full hover:bg-primary-600 align-middle">Login</a>
                     </p>
                   </div>

                   {/* Step 2 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Click the "Project Management" tab at the top of the page and click "Warranty"
                     </p>
                     <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">
                       (DO NOT submit requests under the “To-Do’s” tab. We will not be notified and doing so will delay the processing of your claims)
                     </p>
                     <img 
                       src="/warranty.png" 
                       alt="Click Project Management then Warranty" 
                       className="w-full max-w-lg mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 3 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Click the blue “+ Claim” button at the top right:
                     </p>
                     <img 
                       src="/newclaim.png" 
                       alt="Click New Claim Button" 
                       className="w-full max-w-lg mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 4 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Please submit warranty requests individually. Fill out the form including all pertinent information. Please include pictures and/or videos by clicking the Add button below Attachments. Here is an example:
                     </p>
                     <img 
                       src="/claimdetails.png" 
                       alt="Claim Details Form Example" 
                       className="w-full max-w-lg mx-auto rounded-xl border border-primary-200 shadow-sm object-contain"
                     />
                   </div>

                   {/* Step 5 */}
                   <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                     <p className="text-lg text-primary-700 mb-4 font-medium">
                       Once clicking Add, you can attach videos and pictures by either clicking Browse My Computer or simply dragging and dropping the files to the area indicated. Once you've added the files, click the Upload button at the bottom right corner:
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <img 
                         src="/upload.png" 
                         alt="Upload Interface" 
                         className="w-full h-48 object-contain bg-white rounded-xl border border-primary-200 shadow-sm mx-auto"
                       />
                       <img 
                         src="/upload2.png" 
                         alt="Upload Confirmation" 
                         className="w-full h-48 object-contain bg-white rounded-xl border border-primary-200 shadow-sm mx-auto"
                       />
                     </div>
                   </div>

                   {/* Step 6 */}
                   <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                     <p className="text-lg text-green-800 font-medium">
                       After you've entered all details and attached pictures and/or videos, click Save at the bottom right corner. Submit all requests individually using this procedure. Once you've submitted all of your warranty requests, we'll contact you by the end of the next business day explaining the next steps.
                     </p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quote Form Modal */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsQuoteOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsQuoteOpen(false)}
              className="absolute top-6 right-6 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>

            {!isSubmitted ? (
              <>
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-primary-900 mb-2">Get a Quote</h3>
                  <p className="text-primary-500">Tell us about your needs and we'll build a custom proposal for you.</p>
                </div>

                <form onSubmit={handleSubmitQuote} className="flex flex-col gap-4">
                  {/* Netlify Hidden Form Field */}
                  <input type="hidden" name="form-name" value="quote-request" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-primary-700 ml-2">First Name</label>
                      <input 
                        required 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-primary-50 border border-primary-200 rounded-2xl px-5 py-3 focus:border-primary-500 focus:ring-0 outline-none" 
                        placeholder="Jane"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-primary-700 ml-2">Last Name</label>
                      <input 
                        required 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-primary-50 border border-primary-200 rounded-2xl px-5 py-3 focus:border-primary-500 focus:ring-0 outline-none" 
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-primary-700 ml-2">Company Name</label>
                      <input 
                        required 
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full bg-primary-50 border border-primary-200 rounded-2xl px-5 py-3 focus:border-primary-500 focus:ring-0 outline-none" 
                        placeholder="Acme Builders"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-primary-700 ml-2">Annual Closings</label>
                      <input 
                        required 
                        name="closings"
                        value={formData.closings}
                        onChange={handleInputChange}
                        type="text"
                        className="w-full bg-primary-50 border border-primary-200 rounded-2xl px-5 py-3 focus:border-primary-500 focus:ring-0 outline-none" 
                        placeholder="e.g. 50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-primary-700 ml-2">Email</label>
                      <input 
                        required 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        className="w-full bg-primary-50 border border-primary-200 rounded-2xl px-5 py-3 focus:border-primary-500 focus:ring-0 outline-none" 
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-primary-700 ml-2">Phone</label>
                      <input 
                        required 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        type="tel"
                        className="w-full bg-primary-50 border border-primary-200 rounded-2xl px-5 py-3 focus:border-primary-500 focus:ring-0 outline-none" 
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-primary-700 ml-2">Comments</label>
                    <textarea 
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      className="w-full bg-primary-50 border border-primary-200 rounded-2xl px-5 py-3 focus:border-primary-500 focus:ring-0 outline-none min-h-[120px]" 
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="mt-4 bg-primary-700 text-white py-4 rounded-full font-bold text-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit'}
                  </button>
                  
                  <div className="mt-4 text-center border-t border-primary-100 pt-4">
                     <p className="text-primary-500 font-medium">Need immediate assistance?</p>
                     <a href="tel:8884295468" className="text-primary-700 font-bold text-xl flex items-center justify-center gap-2 mt-1 hover:underline">
                       <Phone size={20} />
                       888-429-5468
                     </a>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Check size={40} />
                </div>
                <h3 className="text-3xl font-bold text-primary-900 mb-4">Request Sent!</h3>
                <p className="text-primary-600 text-lg max-w-md mb-8">
                  Thank you for your interest in Cascade Builder Services. We have received your details.
                </p>
                <button 
                  onClick={() => {
                    setIsQuoteOpen(false);
                    setIsSubmitted(false);
                    setFormData({ firstName: '', lastName: '', company: '', phone: '', email: '', closings: '', comments: '' });
                  }}
                  className="bg-primary-100 text-primary-900 px-8 py-3 rounded-full font-bold hover:bg-primary-200 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Media Modal */}
      {isMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm" onClick={() => setIsMediaOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 flex flex-col">
            
            <button 
              onClick={() => setIsMediaOpen(false)}
              className="absolute top-6 right-6 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="flex justify-center md:justify-start mb-8">
              <div className="inline-block px-10 py-3 rounded-full bg-primary-200">
                <h3 className="text-2xl font-bold text-primary-900 leading-none">Media</h3>
              </div>
            </div>
            
            <div className="flex flex-col gap-10">
              
              {/* Section 1: Seattle Real Estate Radio */}
              <div className="bg-primary-100 rounded-3xl p-6 border border-primary-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                   <img 
                      src="/nossum.png" 
                      alt="Christian Nossum and Dan Keller" 
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-sm bg-primary-50"
                   />
                   <div className="flex-1">
                       <h4 className="text-xl font-bold text-primary-900 mb-2">Seattle Real Estate Radio</h4>
                       <p className="text-primary-600 mb-4 text-lg">
                          Christian Nossum and Dan Keller host Seattle Real Estate Radio. In the segment below, Christian, Dan and Kevin Pierce (founder of Cascade Builder Services) discuss the value that home builders gain from partnering with a third party warranty management company.
                       </p>
                   </div>
                </div>
                
                {/* YouTube Embed */}
                <div className="flex flex-col gap-2 mt-4">
                  <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-primary-200 bg-primary-900 relative">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/HhfM43e_WEg?rel=0&modestbranding=1" 
                      title="Cascade Builder Services on Seattle Real Estate Radio" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="text-center bg-white p-4 rounded-xl mt-2">
                    <p className="text-sm text-primary-500 mb-2">
                      Note: If the video fails to load due to browser privacy settings, please use the direct link below.
                    </p>
                    <a 
                      href="https://youtu.be/HhfM43e_WEg" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
                    >
                      Watch on YouTube <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Section 2: Team Reba */}
              <div className="bg-primary-100 rounded-3xl p-6 border border-primary-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                   <img 
                      src="/reba.png" 
                      alt="Team Reba" 
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-sm bg-primary-50"
                   />
                   <div className="flex-1">
                       <h4 className="text-xl font-bold text-primary-900 mb-2">Team Reba's Radio Show</h4>
                       <p className="text-primary-600 mb-2 text-lg">
                          Kevin Pierce joins Team Reba's radio show to discuss Cascade Builder Services and how they provide unrivaled value to home builders in Washington.
                       </p>
                       <p className="text-sm font-bold text-primary-500 uppercase tracking-wide mb-6">
                          Airs every Tuesday at 3pm on KKOL 1300AM
                       </p>
                       
                       <a 
                          href="https://teamreba.com/2017/02/24/this-weeks-open-house-recap-third-party-warranties-cascade-builder-services/"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-600 transition-colors shadow-md group"
                       >
                          Click here to listen! <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                       </a>
                   </div>
                </div>
              </div>

            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setIsMediaOpen(false)}
                className="bg-primary-100 text-primary-900 px-8 py-3 rounded-full font-bold hover:bg-primary-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteView;