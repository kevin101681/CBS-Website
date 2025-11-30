import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, UserCheck, ShieldCheck, LayoutDashboard, TrendingUp, Users, Smartphone, Zap, Phone, X, Check, Loader2 } from 'lucide-react';

const WebsiteView: React.FC = () => {
  // Generate array for 60 images
  const images = Array.from({ length: 60 }, (_, i) => i + 1);
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

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    // Speed can be adjusted here. 0.5 is a gentle pace.
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (scrollContainer && !isPaused.current) {
        // Infinite scroll logic: if we've scrolled past the first set, reset to 0
        // We assume the content is duplicated to allow seamless loop
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network delay and construct mailto
    setTimeout(() => {
      const subject = `New Quote Request from ${formData.company}`;
      const body = `
Name: ${formData.firstName} ${formData.lastName}
Company: ${formData.company}
Phone: ${formData.phone}
Email: ${formData.email}
Annual Closings: ${formData.closings}

Comments:
${formData.comments}
      `;
      
      // Open email client
      window.location.href = `mailto:kevin@cascadebuilderservices.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-white custom-scrollbar" id="home-container">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Hero Section */}
      <section id="home" className="relative w-full min-h-[700px] md:min-h-[90vh] bg-primary-200 flex flex-col justify-center items-center text-center px-6 md:px-20 overflow-hidden pt-20">
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-4 md:mt-0 p-8">
          
          <h1 className="text-display-large text-5xl md:text-7xl lg:text-8xl font-bold text-primary-900 tracking-tight leading-none drop-shadow-sm">
            You Build. <br/>
            <span className="text-primary-600">We Manage.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-700 max-w-3xl leading-relaxed font-medium p-4">
            Partnering with builders to deliver exceptional warranty management and homeowner satisfaction.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
            <button 
              onClick={() => setIsQuoteOpen(true)}
              className="bg-primary-700 text-white px-8 py-4 rounded-full font-bold hover:bg-primary-600 transition-all hover:shadow-xl active:scale-95 shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              Get a Quote
              <ArrowRight size={20} />
            </button>
            <button className="bg-white border border-primary-200 text-primary-900 px-8 py-4 rounded-full font-bold hover:bg-primary-50 transition-all flex items-center justify-center shadow-md hover:shadow-lg text-lg">
              View Media
            </button>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="services" className="py-24 px-6 md:px-20 bg-primary-50 relative rounded-t-[3rem] -mt-12 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-8 py-3 rounded-full bg-primary-200 mb-6">
              <h3 className="text-3xl md:text-5xl font-medium text-primary-900 leading-none">
                Comprehensive Builder Support
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-700 mb-6 group-hover:bg-primary-700 group-hover:text-white transition-colors duration-300">
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
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-700 mb-6 group-hover:bg-primary-700 group-hover:text-white transition-colors duration-300">
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
      <section id="whycbs" className="py-24 px-6 md:px-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block px-8 py-3 rounded-full bg-primary-200 mb-6">
              <h2 className="text-3xl md:text-5xl font-medium text-primary-900 leading-none">
                Why Choose CBS?
              </h2>
            </div>
          </div>
          <p className="text-xl text-primary-600 mb-16 leading-relaxed max-w-3xl mx-auto">
            We understand that the post-closing experience defines your reputation. Our dedicated team acts as an extension of your company, ensuring that homeowners feel supported long after they receive their keys.
          </p>
          
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
      <section id="testimonials" className="py-24 bg-primary-50 rounded-t-[3rem] overflow-hidden">
        <div className="text-center mb-16 px-6">
          <div className="inline-block px-8 py-3 rounded-full bg-primary-200 mb-6">
             <h3 className="text-3xl md:text-5xl font-medium text-primary-900 leading-none">
               Trusted by Top Builders
             </h3>
          </div>
          <p className="text-primary-600 text-lg max-w-2xl mx-auto">
            See the quality and craftsmanship we manage across the region.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full py-4 group">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-primary-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-primary-50 to-transparent z-10 pointer-events-none"></div>

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
              <div key={i} className="relative w-[300px] md:w-[400px] aspect-[4/3] mx-4 rounded-3xl overflow-hidden border border-primary-200 shadow-sm flex-shrink-0 bg-primary-100">
                <img 
                  src={`https://placehold.co/400x300/e4ecf4/344155?text=Project+${num}`} 
                  alt={`Construction Project ${num}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media / Pricing Placeholder */}
      <section id="media" className="py-24 px-6 md:px-20 bg-primary-700 text-white text-center rounded-t-[3rem] -mt-12 relative z-30">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Media & Pricing</h2>
            <p className="text-primary-100 text-xl mb-10 leading-relaxed">
              Interested in our pricing structure or want to see our orientations in action? 
              Contact us to request our full media kit and rate sheet tailored to your production volume.
            </p>
            <button className="bg-white text-primary-900 hover:bg-primary-50 px-10 py-4 rounded-full font-bold transition-all shadow-lg text-lg">
              Request Information
            </button>
         </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-primary-900 text-xl">CASCADE</span>
            </div>
            <p className="text-primary-600 text-base leading-relaxed">
              Professional warranty management and homeowner orientation services for builders who care about quality.
            </p>
          </div>
          {/* ... Footer Links ... */}
          <div>
            <h4 className="font-bold text-primary-900 mb-6 text-lg">Services</h4>
            <ul className="space-y-3 text-primary-600 text-base">
              <li><a href="#" className="hover:text-primary-900 transition-colors">Orientations</a></li>
              <li><a href="#" className="hover:text-primary-900 transition-colors">Warranty Management</a></li>
              <li><a href="#" className="hover:text-primary-900 transition-colors">Client Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary-900 mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-primary-600 text-base">
              <li><a href="#" className="hover:text-primary-900 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-900 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-900 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary-900 mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-3 text-primary-600 text-base">
              <li className="flex items-center gap-3">
                <Phone size={18} /> 888-429-5468
              </li>
              <li>support@cascadebuilderservices.com</li>
              <li>123 Summit Ave, Seattle, WA</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-primary-100 text-center text-sm text-primary-400 font-medium">
          © 2024 Cascade Builder Services. You Build. We Manage.
        </div>
      </footer>

      {/* Quote Form Modal */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsQuoteOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 flex flex-col">
            
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
                        type="number"
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
                  Thank you for your interest in Cascade Builder Services. We have prepared an email draft in your default client with your details.
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
    </div>
  );
};

export default WebsiteView;