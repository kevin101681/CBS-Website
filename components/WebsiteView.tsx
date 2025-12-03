import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, UserCheck, ShieldCheck, LayoutDashboard, TrendingUp, Users, Smartphone, Zap, Phone, X, Check, Loader2, ExternalLink, Laptop, ArrowLeft, LogIn, HelpCircle, ImageIcon, ChevronLeft, ChevronRight, ClipboardCheck, Eye } from 'lucide-react';

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
  const [isViewClaimsHelpOpen, setIsViewClaimsHelpOpen] = useState(false);
  const [claimHelpView, setClaimHelpView] = useState<'SELECT' | 'DESKTOP' | 'MOBILE_SELECT' | 'ANDROID' | 'IOS'>('SELECT');

  // Image Error State for Carousel Fallback
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Deep Linking Effect
  useEffect(() => {
    // Normalize path by removing trailing slash and converting to lowercase
    const path = window.location.pathname.replace(/\/$/, '').toLowerCase();

    // 1. Check Pathname for /enrollment
    if (path === '/enrollment') {
      setIsEnrollmentOpen(true);
    }

    // 2. Check Pathname for /warrantyrequests
    // Updated to open the main Homeowner Portal Modal (Menu)
    if (path === '/warrantyrequests') {
      setIsPortalOptionsOpen(true);
    }

    // 3. Check Pathname for /viewingclaims
    if (path === '/viewingclaims') {
      setIsViewClaimsHelpOpen(true);
    }

    // 4. Check Query Params
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
        case 'enrollment':
          setIsEnrollmentOpen(true);
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

  const encode = (data: any) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "quote", ...formData })
    })
      .then(() => {
        setIsSubmitted(true);
        setIsSubmitting(false);
      })
      .catch(error => {
        alert("Submission failed. Please try again or call us.");
        setIsSubmitting(false);
      });
  };

  // Helper to generate internal SVG placeholder if local image fails
  const getPlaceholderImage = (num: number) => {
    const svg = `
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#ffffff"/>
      <rect x="150" y="100" width="100" height="80" rx="10" fill="#F4F8FB"/>
      <path d="M150 160 L180 130 L210 160 L230 140 L250 160 V180 H150 Z" fill="#E4ECF4"/>
      <text x="50%" y="220" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#4D6487" font-weight="bold">Project ${num}</text>
    </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleScrollToContact = () => {
    setIsClaimHelpOpen(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
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
          
          {/* Centered Logo with Badge */}
          <div className="flex flex-col items-center mb-4">
            <div className="bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] shadow-xl border border-white/50 mb-4">
              <img 
                src="/logo.png" 
                alt="Cascade Builder Services Logo" 
                className="h-24 md:h-32 w-auto object-contain drop-shadow-sm"
              />
            </div>
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
            {/* Card 1 */}
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

            {/* Card 3 */}
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
      <section id="testimonials" className="py-12 bg-white rounded-t-[3rem] overflow-hidden pb-12">
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
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

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
                    With questions or warranty requests, please <button onClick={() => setIsPortalOptionsOpen(true)} className="text-primary-800 font-bold underline hover:text-primary-600 transition-colors">login to your online account</button> and send us a message or submit a warranty request.
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
          <div className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
             
             {/* Header */}
             <div className="p-6 border-b border-primary-100 flex items-center justify-center bg-white z-10 relative">
               <div className="inline-block px-8 py-2 rounded-full bg-primary-200 shadow-sm">
                  <h3 className="text-xl font-medium text-primary-900 leading-none">Enrollment Form</h3>
               </div>
               <button 
                onClick={() => setIsEnrollmentOpen(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
               >
                 <X size={24} />
               </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                <iframe 
                  src="https://buildertrend.net/leads/contactforms/ContactFormFrame.aspx?builderID=14554" 
                  id="btIframe" 
                  className="w-full border-none min-h-[800px]"
                  scrolling="no"
                  title="Enrollment Form"
                />
             </div>
          </div>
        </div>
      )}

      {/* Quote Form Modal */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsQuoteOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-primary-100 flex items-center justify-center bg-white z-10 relative">
               <div className="inline-block px-8 py-2 rounded-full bg-primary-200 shadow-sm">
                  <h3 className="text-xl font-medium text-primary-900 leading-none">Get a Quote</h3>
               </div>
               <button 
                onClick={() => setIsQuoteOpen(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
               >
                 <X size={24} />
               </button>
             </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
              {!isSubmitted ? (
                <>
                  <p className="text-primary-500 text-center mb-6">Tell us about your project needs.</p>
                  
                  <form name="quote" method="POST" data-netlify="true" onSubmit={handleSubmitQuote} className="space-y-4">
                    <input type="hidden" name="form-name" value="quote" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-primary-700 mb-1 ml-2">First Name</label>
                        <input 
                          type="text" 
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-primary-50 border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-primary-700 mb-1 ml-2">Last Name</label>
                        <input 
                          type="text" 
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-primary-50 border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-700 mb-1 ml-2">Company Name</label>
                      <input 
                        type="text" 
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-primary-50 border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-700 mb-1 ml-2">Annual Closings</label>
                      <input 
                        type="text" 
                        name="closings"
                        value={formData.closings}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-primary-50 border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-primary-700 mb-1 ml-2">Phone</label>
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-primary-50 border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-primary-700 mb-1 ml-2">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-primary-50 border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-700 mb-1 ml-2">Comments</label>
                      <textarea 
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-primary-50 border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit'}
                      </button>
                    </div>
                    
                    <div className="text-center pt-4 border-t border-primary-100">
                      <p className="text-primary-500 font-medium">Questions? Call us.</p>
                      <a href="tel:8884295468" className="text-xl font-bold text-primary-700 hover:text-primary-900">888-429-5468</a>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">Request Sent!</h3>
                  <p className="text-primary-600 mb-8">Thank you for contacting us. We will get back to you shortly.</p>
                  <button 
                    onClick={() => setIsQuoteOpen(false)}
                    className="bg-primary-100 text-primary-700 px-8 py-3 rounded-full font-bold hover:bg-primary-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {isMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsMediaOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-primary-100 flex items-center justify-center bg-white z-10 relative">
               <div className="inline-block px-8 py-2 rounded-full bg-primary-200 shadow-sm">
                  <h3 className="text-xl font-medium text-primary-900 leading-none">Media</h3>
               </div>
               <button 
                onClick={() => setIsMediaOpen(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
               >
                 <X size={24} />
               </button>
             </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
              <div className="flex flex-col gap-8">
                {/* Card 1: Seattle Real Estate Radio */}
                <div className="bg-primary-100 rounded-[2rem] p-6 shadow-sm border border-primary-200">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-48 bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0">
                      <img src="/nossum.png" alt="Christian Nossum and Dan Keller" className="w-full h-full object-cover object-top max-h-48" />
                    </div>
                    <div className="flex-1 text-left">
                       <h4 className="text-xl font-bold text-primary-900 mb-2">Seattle Real Estate Radio</h4>
                       <p className="text-primary-600 mb-4 text-sm leading-relaxed">
                         Christian Nossum and Dan Keller host Seattle Real Estate Radio. In the segment below, Christian, Dan and Kevin Pierce (founder of Cascade Builder Services) discuss the value that home builders gain from partnering with a third party warranty management company.
                       </p>
                       <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg mt-2 bg-black">
                         <iframe 
                            src="https://drive.google.com/file/d/12bN3I9-6jwx_PbQLu_Ybf_5DAuJZbaFO/preview" 
                            className="w-full h-full border-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            referrerPolicy="no-referrer"
                         ></iframe>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Team Reba */}
                <div className="bg-primary-100 rounded-[2rem] p-6 shadow-sm border border-primary-200">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-48 bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0">
                      <img src="/reba.png" alt="Team Reba Radio Show" className="w-full h-full object-cover object-top max-h-48" />
                    </div>
                    <div className="flex-1 text-left">
                       <h4 className="text-xl font-bold text-primary-900 mb-2">Team Reba's Radio Show</h4>
                       <p className="text-primary-600 mb-2 text-sm leading-relaxed">
                         Kevin Pierce joins Team Reba's radio show to discuss Cascade Builder Services and how they provide unrivaled value to home builders in Washington.
                       </p>
                       <p className="text-primary-700 font-medium mb-4 text-sm">
                         Airs every Tuesday at 3pm on KKOL 1300AM.
                       </p>
                       <a 
                         href="https://teamreba.com/2017/02/24/this-weeks-open-house-recap-third-party-warranties-cascade-builder-services/" 
                         target="_blank" 
                         rel="noreferrer"
                         className="bg-primary-700 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 w-fit"
                       >
                         Click here to listen! <ExternalLink size={18} />
                       </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portal Options Modal */}
      {isPortalOptionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsPortalOptionsOpen(false)} />
           <div className="relative bg-white rounded-[2rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center flex flex-col overflow-hidden">
             
             {/* Header */}
             <div className="p-6 border-b border-primary-100 flex items-center justify-center bg-white z-10 relative">
               <div className="inline-block px-8 py-2 rounded-full bg-primary-200 shadow-sm">
                  <h3 className="text-xl font-medium text-primary-900 leading-none">Homeowner Portal</h3>
               </div>
               <button 
                onClick={() => setIsPortalOptionsOpen(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
               >
                 <X size={24} />
               </button>
             </div>

             {/* Content */}
             <div className="flex-1 p-8">
               <p className="text-primary-500 mb-6">Select an option to continue</p>
               <div className="flex flex-col gap-4">
                  <button 
                    className="w-full bg-primary-700 text-white py-4 rounded-full font-bold text-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <LogIn size={20} /> Login
                  </button>
                  <button 
                    onClick={() => {
                      setIsPortalOptionsOpen(false);
                      setIsClaimHelpOpen(true);
                      setClaimHelpView('SELECT');
                    }}
                    className="w-full bg-primary-700 text-white py-4 rounded-full font-bold text-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <HelpCircle size={20} /> How to Make a Claim
                  </button>
                  <button 
                    onClick={() => {
                      setIsPortalOptionsOpen(false);
                      setIsViewClaimsHelpOpen(true);
                    }}
                    className="w-full bg-primary-700 text-white py-4 rounded-full font-bold text-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Eye size={20} /> How to View Claims
                  </button>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* How to View Claims Modal */}
      {isViewClaimsHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsViewClaimsHelpOpen(false)} />
           <div className="relative bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
             
             {/* FAB Back Button */}
             <button
               onClick={() => {
                 setIsViewClaimsHelpOpen(false);
                 setIsPortalOptionsOpen(true);
               }}
               className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-primary-100 text-primary-900 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg hover:bg-primary-200 transition-all border border-primary-200"
               title="Go Back"
             >
               <ArrowLeft size={24} />
             </button>

             {/* Header - X Removed */}
             <div className="p-6 border-b border-primary-100 flex items-center justify-center bg-white z-10 relative">
               <div className="inline-block px-8 py-2 rounded-full bg-primary-200 shadow-sm">
                  <h3 className="text-xl font-medium text-primary-900 leading-none">How to View Claims</h3>
               </div>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
               <div className="prose prose-slate text-primary-600 mb-8 max-w-none text-lg leading-relaxed space-y-4">
                 <p>
                   After we've evaluated your warranty claims, determinations will be made and reflected on your Warranty page. This page defaults to showing Open and New claims only.
                 </p>
                 <p>
                   Please note that your open claims list may be shorter than the amount of claims you've submitted. We will often combine several claims into one that are all assigned to the same contractor.
                 </p>
                 <p>
                   Completed claims and claims marked as non-warranty do not show by default. You will need to use the filter option to see these claims. Clicking on the title of the claim will show more details in the description field.
                 </p>
                 <p className="font-bold text-primary-900">
                   Please watch the video clip below which shows how to use the filter options.
                 </p>
               </div>

               <div className="rounded-xl overflow-hidden shadow-lg border border-primary-200 bg-black aspect-video mb-12">
                 <iframe 
                    src="https://drive.google.com/file/d/1_7MB7ULBXcUIo4tG9qiH23JGbW2IBJTe/preview" 
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    referrerPolicy="no-referrer"
                 ></iframe>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* How to Make a Claim Modal */}
      {isClaimHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsClaimHelpOpen(false)} />
           <div className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
             
             {/* FAB Back Button for nested views */}
             {claimHelpView !== 'SELECT' && (
               <button
                 onClick={() => setClaimHelpView(claimHelpView === 'ANDROID' || claimHelpView === 'IOS' ? 'MOBILE_SELECT' : 'SELECT')}
                 className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-primary-100 text-primary-900 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg hover:bg-primary-200 transition-all border border-primary-200"
                 title="Go Back"
               >
                 <ArrowLeft size={24} />
               </button>
             )}

             {/* FAB Back Button for Main Selection View */}
             {claimHelpView === 'SELECT' && (
               <button
                 onClick={() => {
                    setIsClaimHelpOpen(false);
                    setIsPortalOptionsOpen(true);
                 }}
                 className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-primary-100 text-primary-900 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg hover:bg-primary-200 transition-all border border-primary-200"
                 title="Go Back"
               >
                 <ArrowLeft size={24} />
               </button>
             )}

             {/* Header - X Removed */}
             <div className="p-6 border-b border-primary-100 flex items-center justify-center bg-white z-10 relative">
               <div className="inline-block px-8 py-2 rounded-full bg-primary-200 shadow-sm text-center">
                  <h3 className="text-xl font-medium text-primary-900 leading-none">Submit Warranty Requests</h3>
               </div>
             </div>

             {/* Content Scroll Area */}
             <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
               
               {/* Selection View */}
               {claimHelpView === 'SELECT' && (
                 <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-8 mb-12">
                   <div className="mb-12 flex flex-col items-center gap-3">
                     <p className="text-lg text-primary-600">
                       If you have not activated your online account, please contact us.
                     </p>
                     <button 
                       onClick={handleScrollToContact}
                       className="bg-primary-700 text-white px-6 py-2 rounded-full font-bold hover:bg-primary-600 transition-all shadow-md"
                     >
                       Contact Us
                     </button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                     <button 
                       onClick={() => setClaimHelpView('DESKTOP')}
                       className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-primary-200 border border-primary-300 hover:bg-primary-300 hover:border-primary-400 hover:shadow-lg transition-all group"
                     >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-400 group-hover:text-primary-700 shadow-sm transition-colors">
                          <Laptop size={40} />
                        </div>
                        <span className="text-xl font-bold text-primary-900">Desktop</span>
                     </button>

                     <button 
                       onClick={() => setClaimHelpView('MOBILE_SELECT')}
                       className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-primary-200 border border-primary-300 hover:bg-primary-300 hover:border-primary-400 hover:shadow-lg transition-all group"
                     >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-400 group-hover:text-primary-700 shadow-sm transition-colors">
                          <Smartphone size={40} />
                        </div>
                        <span className="text-xl font-bold text-primary-900">Mobile</span>
                     </button>
                   </div>
                 </div>
               )}

               {/* Desktop View */}
               {claimHelpView === 'DESKTOP' && (
                 <div className="max-w-3xl mx-auto space-y-12 pb-12">
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-bold">1</span>
                        Login to your account
                      </h4>
                      <div className="pl-11">
                         <p className="text-primary-600 mb-4">The first step is to login to your account.</p>
                         <a href="https://buildertrend.net" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-6 py-2 rounded-full font-bold hover:bg-primary-200 transition-colors">
                           <LogIn size={18} /> Login Here
                         </a>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-bold">2</span>
                        Navigate to Warranty
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-primary-600">
                           Click the "Project Management" tab at the top of the page and click "Warranty".
                         </p>
                         <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm border border-red-200 font-medium">
                           ⚠️ DO NOT submit requests under the “To-Do’s” tab. We will not be notified and doing so will delay the processing of your claims.
                         </div>
                         <img src="/warranty.png" alt="Navigate to Warranty Tab" className="w-full max-w-[150px] mx-auto rounded-xl border border-primary-200 shadow-md object-contain" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-bold">3</span>
                        Create New Claim
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-primary-600">
                           Click the blue “+ Claim” button at the top right.
                         </p>
                         <img src="/newclaim.png" alt="Click New Claim Button" className="w-full max-w-lg mx-auto rounded-xl border border-primary-200 shadow-md object-contain" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-bold">4</span>
                        Enter Details
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-primary-600">
                           Please submit warranty requests individually. Fill out the form including all pertinent information. Please include pictures and/or videos by clicking the Add button below Attachments.
                         </p>
                         <img src="/claimdetails.png" alt="Claim Form Details" className="w-full max-w-lg mx-auto rounded-xl border border-primary-200 shadow-md object-contain" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-bold">5</span>
                        Upload Files
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-primary-600">
                           Once clicking Add, you can attach videos and pictures by either clicking Browse My Computer or simply dragging and dropping the files. Click "Upload" when finished.
                         </p>
                         <div className="flex flex-col md:flex-row gap-4">
                            <img src="/upload.png" alt="Upload Interface" className="w-full md:w-1/2 h-48 object-contain rounded-xl border border-primary-200 shadow-md bg-primary-100" />
                            <img src="/upload2.png" alt="Upload Button" className="w-full md:w-1/2 h-48 object-contain rounded-xl border border-primary-200 shadow-md bg-primary-100" />
                         </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex items-start gap-4">
                      <Check className="text-green-700 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-bold text-green-800 mb-1">Final Step</h5>
                        <p className="text-green-800 text-sm">
                          After you've entered all details and attached pictures/videos, click Save at the bottom right corner. Once you've submitted all of your warranty requests, we'll contact you by the end of the next business day explaining the next steps.
                        </p>
                      </div>
                    </div>
                 </div>
               )}

               {/* Mobile OS Select View */}
               {claimHelpView === 'MOBILE_SELECT' && (
                 <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-8">
                   <h4 className="text-xl font-bold text-primary-900 mb-8">Select your device type</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                     <button 
                       onClick={() => setClaimHelpView('ANDROID')}
                       className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-primary-200 border border-primary-300 hover:bg-primary-300 hover:border-primary-400 hover:shadow-lg transition-all group"
                     >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-400 group-hover:text-green-600 shadow-sm transition-colors">
                          <Smartphone size={40} />
                        </div>
                        <span className="text-xl font-bold text-primary-900">Android</span>
                     </button>

                     <button 
                       onClick={() => setClaimHelpView('IOS')}
                       className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-primary-200 border border-primary-300 hover:bg-primary-300 hover:border-primary-400 hover:shadow-lg transition-all group"
                     >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-400 group-hover:text-blue-600 shadow-sm transition-colors">
                          <Smartphone size={40} />
                        </div>
                        <span className="text-xl font-bold text-primary-900">iOS (iPhone)</span>
                     </button>
                   </div>
                 </div>
               )}

               {/* Android View */}
               {claimHelpView === 'ANDROID' && (
                 <div className="max-w-md mx-auto space-y-12 pb-12">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        Download App
                      </h4>
                      <div className="pl-11">
                         <a href="https://play.google.com/store/apps/details?id=com.BuilderTREND.btMobileApp" target="_blank" rel="noreferrer">
                           <img src="/playstore.png" alt="Get it on Google Play" className="h-12 w-auto hover:opacity-80 transition-opacity" />
                         </a>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        Login
                      </h4>
                      <div className="pl-11">
                         <img src="/alogin.png" alt="Android Login Screen" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        Select Warranty Items
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-sm text-primary-600">Click on "Warranty Items".</p>
                         <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs border border-red-200 font-medium">
                           ⚠️ DO NOT submit requests under "To-Do’s".
                         </div>
                         <img src="/aitems.png" alt="Warranty Items Menu" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        Add New Request
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-sm text-primary-600">Click the blue circle icon on the bottom right corner.</p>
                         <img src="/aadd.png" alt="Add Button" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">5</span>
                        Fill Details
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-sm text-primary-600">Submit requests individually. Fill out all info.</p>
                         <img src="/aind.png" alt="Form Details" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">6</span>
                        Attach Photos
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-sm text-primary-600">Click "Add Attachment" to include photos/video.</p>
                         <img src="/apic.png" alt="Add Attachment" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                        <h5 className="font-bold text-green-800 mb-1">Finish</h5>
                        <p className="text-green-800 text-sm">
                          Click Save at the top right corner. We'll contact you by the end of the next business day.
                        </p>
                    </div>
                 </div>
               )}

               {/* iOS View */}
               {claimHelpView === 'IOS' && (
                 <div className="max-w-md mx-auto space-y-12 pb-12">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        Download App
                      </h4>
                      <div className="pl-11">
                         <a href="https://apps.apple.com/us/app/buildertrend/id504370616" target="_blank" rel="noreferrer">
                           <img src="/appstore.png" alt="Download on App Store" className="h-12 w-auto hover:opacity-80 transition-opacity" />
                         </a>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        Login
                      </h4>
                      <div className="pl-11">
                         <img src="/ilogin.png" alt="iOS Login Screen" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        Select Warranty Items
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-sm text-primary-600">Click on "Warranty Items".</p>
                         <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs border border-red-200 font-medium">
                           ⚠️ DO NOT submit requests under "To-Do’s".
                         </div>
                         <img src="/iitems.png" alt="Warranty Items Menu" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        Add New Request
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-sm text-primary-600">Click the blue circle icon on the bottom right corner.</p>
                         <img src="/iadd.png" alt="Add Button" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">5</span>
                        Fill Details
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-sm text-primary-600">Submit requests individually. Fill out all info.</p>
                         <img src="/aind.png" alt="Form Details" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-primary-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">6</span>
                        Attach Photos
                      </h4>
                      <div className="pl-11 space-y-4">
                         <p className="text-sm text-primary-600">Click "Add Attachment" to include photos/video.</p>
                         <img src="/ipic.png" alt="Add Attachment" className="w-full rounded-xl border border-primary-200 shadow-sm" />
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                        <h5 className="font-bold text-green-800 mb-1">Finish</h5>
                        <p className="text-green-800 text-sm">
                          Click Save at the top right corner. We'll contact you by the end of the next business day.
                        </p>
                    </div>
                 </div>
               )}

             </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default WebsiteView;