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

  // Privacy Policy Modal State
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

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

    // 2. Check Pathname for /privacypolicy
    if (path === '/privacypolicy') {
      setIsPrivacyPolicyOpen(true);
    }

    // 3. Check Pathname for /warrantyrequests
    // Updated to open the main Homeowner Portal Modal (Menu)
    if (path === '/warrantyrequests') {
      setIsPortalOptionsOpen(true);
    }

    // 4. Check Pathname for /viewingclaims
    if (path === '/viewingclaims') {
      setIsViewClaimsHelpOpen(true);
    }

    // 5. Check Query Params
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
        case 'privacypolicy':
          setIsPrivacyPolicyOpen(true);
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

  const privacyPolicyContent = `
<style>
  [data-custom-class='body'], [data-custom-class='body'] * {
          background: transparent !important;
        }
[data-custom-class='title'], [data-custom-class='title'] * {
          font-family: Arial !important;
font-size: 26px !important;
color: #000000 !important;
        }
[data-custom-class='subtitle'], [data-custom-class='subtitle'] * {
          font-family: Arial !important;
color: #595959 !important;
font-size: 14px !important;
        }
[data-custom-class='heading_1'], [data-custom-class='heading_1'] * {
          font-family: Arial !important;
font-size: 19px !important;
color: #000000 !important;
        }
[data-custom-class='heading_2'], [data-custom-class='heading_2'] * {
          font-family: Arial !important;
font-size: 17px !important;
color: #000000 !important;
        }
[data-custom-class='body_text'], [data-custom-class='body_text'] * {
          color: #595959 !important;
font-size: 14px !important;
font-family: Arial !important;
        }
[data-custom-class='link'], [data-custom-class='link'] * {
          color: #3030F1 !important;
font-size: 14px !important;
font-family: Arial !important;
word-break: break-word !important;
        }
</style>
      <span style="display: block;margin: 0 auto 3.125rem;width: 11.125rem;height: 2.375rem;background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzgiIGhlaWdodD0iMzgiIHZpZXdCb3g9IjAgMCAxNzggMzgiPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBmaWxsPSIjRDFEMUQxIiBkPSJNNC4yODMgMjQuMTA3Yy0uNzA1IDAtMS4yNTgtLjI1Ni0xLjY2LS43NjhoLS4wODVjLjA1Ny41MDIuMDg2Ljc5Mi4wODYuODd2Mi40MzRILjk4NXYtOC42NDhoMS4zMzJsLjIzMS43NzloLjA3NmMuMzgzLS41OTQuOTUtLjg5MiAxLjcwMi0uODkyLjcxIDAgMS4yNjQuMjc0IDEuNjY1LjgyMi40MDEuNTQ4LjYwMiAxLjMwOS42MDIgMi4yODMgMCAuNjQtLjA5NCAxLjE5OC0uMjgyIDEuNjctLjE4OC40NzMtLjQ1Ni44MzMtLjgwMyAxLjA4LS4zNDcuMjQ3LS43NTYuMzctMS4yMjUuMzd6TTMuOCAxOS4xOTNjLS40MDUgMC0uNy4xMjQtLjg4Ni4zNzMtLjE4Ny4yNDktLjI4My42Ni0uMjkgMS4yMzN2LjE3N2MwIC42NDUuMDk1IDEuMTA3LjI4NyAxLjM4Ni4xOTIuMjguNDk1LjQxOS45MS40MTkuNzM0IDAgMS4xMDEtLjYwNSAxLjEwMS0xjgxNiAwLS41OS0uMDktMS4wMzQtLjI3LTEuMzI5LS4xODItLjI5NS0uNDY1LS40NDMtLjg1Mi0uNDQzem01LjU3IDEuNzk0YzAgLjU5NC4wOTggMS4wNDQuMjkzIDEuMzQ4LjE5Ni4zMDQuNTEzLjQ1Ny45NTQuNDU3LjQzNyAwIC43NS0uMTUyLjk0Mi0uNDU0LjE5Mi0uMzAzLjI4OC0uNzUzLjI4OC0xLjM1MSAwLS41OTUtLjA5Ny0xLjA0LS4yOS0xLjMzOC0uMTk0LS4yOTctLjUxLS40NDUtLjk1LS40NDUtLjQzOCAwLS43NTMuMTQ3LS45NDYuNDQzLS4xOTQuMjk1LS4yOS43NDItLjI5IDEuMzR6bTQuMTUzIDBjMCAuOTc3LS4yNTggMS43NDItLjc3NCAyLjI5My0uNTE1LjU1Mi0xLjIzMy44MjctMi4xNTQuODI3LS41NzYgMC0xLjA4NS0uMTI2LTEuNTI1LS4zNzhhMi41MiAyLjUyIDAgMCAxLTEuMDE1LTEuMDg4Yy0uMjM3LS40NzMtLjM1NS0xLjAyNC0uMzU1LTEuNjU0IDAtLjk4MS4yNTYtMS43NDQuNzY4LTIuMjg4LjUxMi0uNTQ1IDEuMjMyLS44MTcgMi4xNi0uODE3LjU3NiAwIDEuMDg1LjEyNiAxLjUyNS4zNzYuNDQuMjUxLjc3OS42MSAxLjAxNSAxLjA4LjIzNi40NjkuMzU1IDEuMDE5LjM1NSAxLjY0OXpNMTkuNzEgMjRsLS40NjItMi4xLS42MjMtMi42NTNoLS4wMzdMMTcuNDkzIDI0SDE1LjczbC0xLjcwOC02LjAwNWgxLjYzM2wuNzA0IDIuODc5Yy4wMTQuMDc5LjAzNy4xOTUuMDY3LjM1YTIwLjk5OCAyMC45OTggMCAwIDEgLjE2NyAxLjAwMmMuMDIzLjE2NS4wMzYuMjk5LjA0LjM5OWguMDMyYy4wMzItLjI1OC4wOS0uNjExLjE3Mi0xLjA2LjA4Mi0uNDUuMTQxLS43NTQuMTc3LS45MTFsLjcyLTIuNjU5aDEuNjA2TDIxLjQ5NCAyNGgtMS43ODN6bTcuMDg2LTQuOTUyYy0uMzQ4IDAtLjYyLjExLS44MTcuMzMtLjE5Ny4yMi0uMzEuNTMzLS4zMzguOTM3aDIuMjk5Yy0uMDA4LS40MDQtLjExMy0uNzE3LS4zMTctLjkzNy0uMjA0LS4yMi0uNDgtLjMzLS44MjctLjMzem0uMjMgNS4wNmMtLjk2NiAwLTEuNzIyLS4yNjctMi4yNjYtLjgtLjU0NC0uNTM0LS44MTYtMS4yOS0uODE2LTIuMjY3IDAtMS4wMDcuMjUxLTEuNzg1Ljc1NC0yLjMzNC41MDMtLjU1IDEuMTk5LS44MjUgMi4wODctLjgyNS44NDggMCAxLjUxLjI0MiAxLjk4Mi43MjUuNDcyLjQ4NC43MDkgMS4xNTIuNzA5IDIuMDA0di43OTVoLTMuODczYy4wMTguNDY1LjE1Ni44MjkuNDE0IDEuMDkuMjU4LjI2MS42Mi4zOTIgMS4wODUuMzkyLjM2MSAwIC43MDMtLjAzNyAxLjAyNi0uMTEzYTUuMTMzIDUuMTMzIDAgMCAwIDEuMDEtLjM2djEuMjY4Yy0uMjg3LjE0My0uNTkzLjI1LS45Mi4zMmE1Ljc5IDUuNzkgMCAwIDEtMS4xOTEuMTA0em03LjI1My02LjIyNmMuMjIyIDAgLjQwNi4wMTYuNTUzLjA0OWwtLjEyNCAxLjUzNmExLjg3NyAxLjg3NyAwIDAgMC0uNDgzLS4wNTRjLS41MjMgMC0uOTMuMTM0LTEuMjIyLjQwMy0uMjkyLjI2OC0uNDM4LjY0NC0uNDM4IDEuMTI4VjI0aC0xLjYzOHYtNi4wMDVoMS4yNGwuMjQyIDEuMDFoLjA4Yy4xODctLjMzNy40MzktLjYwOC43NTYtLjgxNGExLjg2IDEuODYgMCAwIDEgMS4wMzQtLjMwOXptNC4wMjkgMS4xNjZjLS4zNDcgMC0uNjIuMTEtLjgxNy4zMy0uMTk3LjIyLS4zMS41MzMtLjMzOC45MzdoMi4yOTljLS4wMDctLjQwNC0uMTEzLS43MTctLjMxNy0uOTM3LS4yMDQtLjIyLS40OC0uMzMtLjgyNy0uMzN6bS4yMyA1LjA2Yy0uOTY2IDAtMS43MjItLjI2Ny0yLjI2Ni0uOC0uNTQ0LS41MzQtLjgxNi0xLjI5LS44MTYtMi4yNjcgMC0xLjAwNy4yNTEtMS43ODUuNzU0LTIuMzM0LjUwNC0uNTUgMS4yLS44MjUgMi4wODctLjgyNS44NDkgMCAxLjUxLjI0MiAxLjk4Mi43MjUuNDcyLjQ4NC43MDkgMS4xNTIuNzA5IDIuMDA0di43OTVoLTMuODczYy4wMTguNDY1LjE1Ni44MjkuNDE0IDEuMDkuMjU4LjI2MS42Mi4zOTIgMS4wODUuMzkyLjM2MiAwIC43MDQtLjAzNyAxLjAyNi0uMTEzYTUuMTMzIDUuMTMzIDAgMCAwIDEuMDEtLjM2djEuMjY4Yy0uMjg3LjE0My0uNTkzLjI1LS45MTkuMzJhNS43OSA1Ljc5IDAgMCAxLTEuMTkyLjEwNHptNS44MDMgMGMtLjcwNiAwLTEuMjYtLjI3NS0xLjY2My0uODIyLS40MDMtLjU0OC0uNjA0LTEuMzA3LS42MDQtMi4yNzggMC0uOTg0LjIwNS0xLjc1Mi42MTUtMi4zMDEuNDEtLjU1Ljk3NS0uODI1IDEuNjk1LS44MjUuNzU1IDAgMS4zMzIuMjk0IDEuNzI5Ljg4MWguMDU0YTYuNjk3IDYuNjk3IDAgMCAxLS4xMjQtMS4xOTh2LTEuOTIyaDEuNjQ0VjI0SDQ2LjQzbC0uMzE3LS43NzloLS4wN2MtLjM3Mi41OTEtLjk0Ljg4Ni0xLjcwMi44ODZ6bS41NzQtMS4zMDZjLjQyIDAgLjcyNi0uMTIxLjkyMS0uMzY1LjE5Ni0uMjQzLjMwMi0uNjU3LjMyLTEuMjR2LS4xNzhjMC0uNjQ0LS4xLTEuMTA2LS4yOTgtMS4zODYtLjE5OS0uMjc5LS41MjItLjQxOS0uOTctLjQxOS0uOTYyLjk2MiAwIDAgMC0uODUuNDY1Yy0uMjAzLjMxLS4zMDQuNzYtLjMwNCAxLjM1IDAgLjU5Mi4xMDIgMS4wMzUuMzA2IDEuMzMuMjA0LjI5Ni40OTYuNDQzLjg3NS40NDN6bTEwLjkyMi00LjkyYy43MDkgMCAxLjI2NC4yNzcgMS42NjUuODMuNC41NTMuNjAxIDEuMzEyLjYwMSAyLjI3NSAwIC45OTItLjIwNiAxLjc2LS42MiAyLjMwNC0uNDE0LjU0NC0uOTc3LjgxNi0xLjY5LjgxNi0uNzA1IDAtMS4yNTgtLjI1Ni0xLjY1OS0uNzY4aC0uMTEzbC0uMjc0LjY2MWgtMS4yNTF2LTguMzU3aDEuNjM4djEuOTQ0YzAgLjI0Ny0uMDIxLjY0My0uMDY0IDEuMTg3aC4wNjRjLjM4My0uNTk0Ljk1LS44OTIgMS43MDMtLjg5MnptLS41MjcgMS4zMWMtLjQwNCAwLS43LjEyNS0uODg2LjM3NC0uMTg2LjI0OS0uMjgzLjY2LS4yOSAxLjIzM3YuMTc3YzAgLjY0NS4wOTYgMS4xMDcuMjg3IDEuMzg2LjE5Mi4yOC40OTUuNDE5LjkxLjQxOS4zMzcgMCAuNjA1LS4xNTUuODA0LS40NjUuMTk5LS4zMS4yOTgtLjc2LjI5OC0xLjM1IDAtLjU5MS0uMS0xLjAzNS0uMy0xLjMzYS45NDMuOTQzIDAgMCAwLS44MjMtLjQ0M3ptMy4xODYtMS4xOTdoMS43OTRsMS4xMzQgMy4zNzljLjA5Ni4yOTMuMTYzLjY0LjE5OCAxLjA0MmguMDMzYy4wMzktLjM3LjExNi0uNzE3LjIzLTEuMDQybDEuMTEyLTMuMzc5aDEuNzU3bC0yLjU0IDYuNzczYy0uMjM0LjYyNy0uNTY2IDEuMDk2LS45OTcgMS40MDctLjQzMi4zMTItLjkzNi40NjgtMS41MTIuNDY4LS4yODMgMC0uNTYtLjAzLS44MzMtLjA5MnYtMS4zYTIuOCAyLjggMCAwIDAgLjY0NS4wN2MuMjkgMCAuNTQzLS4wODguNzYtLjI2Ni4yMTctLjE3Ny4zODYtLjQ0NC41MDgtLjgwM2wuMDk2LS4yOTUtMi4zODUtNS45NjJ6Ii8+CiAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzMpIj4KICAgICAgICAgICAgPGNpcmNsZSBjeD0iMTkiIGN5PSIxOSIgcj0iMTkiIGZpbGw9IiNFMEUwRTAiLz4KICAgICAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTIyLjQ3NCAxNS40NDNoNS4xNjJMMTIuNDM2IDMwLjRWMTAuMzYzaDE1LjJsLTUuMTYyIDUuMDh6Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxwYXRoIGZpbGw9IiNEMkQyRDIiIGQ9Ik0xMjEuNTQ0IDE0LjU2di0xLjcyOGg4LjI3MnYxLjcyOGgtMy4wMjRWMjRoLTIuMjR2LTkuNDRoLTMuMDA4em0xMy43NDQgOS41NjhjLTEuMjkgMC0yLjM0MS0uNDE5LTMuMTUyLTEuMjU2LS44MS0uODM3LTEuMjE2LTEuOTQ0LTEuMjE2LTMuMzJzLjQwOC0yLjQ3NyAxLjIyNC0zLjMwNGMuODE2LS44MjcgMS44NzItMS4yNCAzLjE2OC0xLjI0czIuMzYuNDAzIDMuMTkyIDEuMjA4Yy44MzIuODA1IDEuMjQ4IDEuODggMS4yNDggMy4yMjQgMCAuMzEtLjAyMS41OTctLjA2NC44NjRoLTYuNDY0Yy4wNTMuNTc2LjI2NyAxLjA0LjY0IDEuMzkyLjM3My4zNTIuODQ4LjUyOCAxLjQyNC41MjguNzc5IDAgMS4zNTUtLjMyIDEuNzI4LS45NmgyLjQzMmEzLjg5MSAzLjg5MSAwIDAgMS0xLjQ4OCAyLjA2NGMtLjczNi41MzMtMS42MjcuOC0yLjY3Mi44em0xLjQ4LTYuNjg4Yy0uNC0uMzUyLS44ODMtLjUyOC0xLjQ0OC0uNTI4cy0xLjAzNy4xNzYtMS40MTYuNTI4Yy0uMzc5LjM1Mi0uNjA1LjgyMS0uNjggMS40MDhoNC4xOTJjLS4wMzItLjU4Ny0uMjQ4LTEuMDU2LS42NDgtMS40MDh6bTcuMDE2LTIuMzA0djEuNTY4Yy41OTctMS4xMyAxLjQ2MS0xLjY5NiAyLjU5Mi0xLjY5NnYyLjMwNGgtLjU2Yy0uNjcyIDAtMS4xNzkuMTY4LTEuNTIuNTA0LS4zNDEuMzM2LS41MTIuOTE1LS41MTIgMS43MzZWMjRoLTIuMjU2di04Ljg2NGgyLjI1NnptNi40NDggMHYxLjMyOGMuNTY1LS45NyAxLjQ4My0xLjQ1NiAyLjc1Mi0xLjQ1Ni42NzIgMCAxLjI3Mi4xNTUgMS44LjQ2NC41MjguMzEuOTM2Ljc1MiAxLjIyNCAxLjMyOC4zMS0uNTU1LjczMy0uOTkyIDEuMjcyLTEuMzEyYTMuNDg4IDMuNDg4IDAgMCAxIDEuODE2LS40OGMxLjA1NiAwIDEuOTA3LjMzIDIuNTUyLjk5Mi42NDUuNjYxLjk2OCAxLjU5Ljk2OCAyLjc4NFYyNGgtMi4yNHYtNC44OTZjMC0uNjkzLS4xNzYtMS4yMjQtLjUyOC0xLjU5Mi0uMzUyLS4zNjgtLjgzMi0uNTUyLTEuNDQtLjU1MnMtMS4wOS4xODQtMS40NDguNTUyYy0uMzU3LjM2OC0uNTM2Ljg5OS0uNTM2IDEuNTkyVjI0aC0yLjI0di00Ljg5NmMwLS42OTMtLjE3Ni0xLjIyNC0uNTI4LTEuNTkyLS4zNTItLjM2OC0uODMyLS41NTItMS40NC0uNTUycy0xLjA5LjE4NC0xLjQ0OC41NTJjLS4zNTcuMzY4LS41MzYuODk5LS41MzYgMS41OTJWMjRoLTIuMjU2di04Ljg2NGgyLjI1NnpNMTY0LjkzNiAyNFYxMi4xNmgyLjI1NlYyNGgtMi4yNTZ6bTcuMDQtLjE2bC0zLjQ3Mi04LjcwNGgyLjUyOGwyLjI1NiA2LjMwNCAyLjM4NC02LjMwNGgyLjM1MmwtNS41MzYgMTMuMDU2aC0yLjM1MmwxLjg0LTQuMzUyeiIvPgogICAgPC9nPgo8L3N2Zz4K) center no-repeat;"></span>

      <div data-custom-class="body">
      <div><strong><span style="font-size: 26px;"><span data-custom-class="title"><bdt class="block-component"></bdt><bdt class="question"><h1>PRIVACY POLICY</h1></bdt><bdt class="statement-end-if-in-editor"></bdt></span></span></strong></div><div><span style="color: rgb(127, 127, 127);"><strong><span style="font-size: 15px;"><span data-custom-class="subtitle">Last updated <bdt class="question">November 23, 2025</bdt></span></span></strong></span></div><div><br></div><div><br></div><div><br></div><div style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text">This Privacy Notice for <bdt class="question noTranslate">Cascade Builder Services</bdt><bdt class="block-component"></bdt></bdt> (<bdt class="block-component"></bdt>"<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"<bdt class="statement-end-if-in-editor"></bdt></span><span data-custom-class="body_text">), describes how and why we might access, collect, store, use, and/or share (<bdt class="block-component"></bdt>"<strong>process</strong>"<bdt class="statement-end-if-in-editor"></bdt>) your personal information when you use our services (<bdt class="block-component"></bdt>"<strong>Services</strong>"<bdt class="statement-end-if-in-editor"></bdt>), including when you:</span></span></span><span style="font-size: 15px;"><span style="color: rgb(127, 127, 127);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></li></ul><div><bdt class="block-component"><span style="font-size: 15px;"><span style="font-size: 15px;"><span style="color: rgb(127, 127, 127);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></span></bdt></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Download and use<bdt class="block-component"></bdt> our mobile application<bdt class="block-component"></bdt> (<bdt class="question">BlueTag)<span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><bdt class="statement-end-if-in-editor">,</bdt></span></span></span></span></span></span></span></span></bdt></span><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><bdt class="statement-end-if-in-editor"><bdt class="block-component"> or any other application of ours that links to this Privacy Notice</bdt></bdt></span></span></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></span></bdt></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><span style="color: rgb(127, 127, 127);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Engage with us in other related ways, including any sales, marketing, or events<span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><bdt class="statement-end-if-in-editor"></bdt></span></span></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><span style="color: rgb(127, 127, 127);"><span data-custom-class="body_text"><strong>Questions or concerns?-ß</strong>Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services.<bdt class="block-component"></bdt> If you still have any questions or concerns, please contact us at <bdt class="question noTranslate"><a target="_blank" data-custom-class="link" href="mailto:kfp1016@gmail.com">kfp1016@gmail.com</a></bdt>.</span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><strong><span style="font-size: 15px;"><span data-custom-class="heading_1"><h2>SUMMARY OF KEY POINTS</h2></span></span></strong></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong><em>This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our-ß</em></strong></span></span><a data-custom-class="link" href="#toc"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text"><strong><em>table of contents</em></strong></span></span></a><span style="font-size: 15px;"><span data-custom-class="body_text"><strong><em>-ßbelow to find the section you are looking for.</em></strong></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about-ß</span></span><a data-custom-class="link" href="#personalinfo"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text">personal information you disclose to us</span></span></a><span data-custom-class="body_text">.</span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>Do we process any sensitive personal information?-ß</strong>Some of the information may be considered <bdt class="block-component"></bdt>"special" or "sensitive"<bdt class="statement-end-if-in-editor"></bdt> in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. <bdt class="block-component"></bdt>We do not process sensitive personal information.<bdt class="else-block"></bdt></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>Do we collect any information from third parties?</strong> <bdt class="block-component"></bdt>We do not collect any information from third parties.<bdt class="else-block"></bdt></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about-ß</span></span><a data-custom-class="link" href="#infouse"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text">how we process your information</span></span></a><span data-custom-class="body_text">.</span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>In what situations and with which <bdt class="block-component"></bdt>parties do we share personal information?</strong> We may share information in specific situations and with specific <bdt class="block-component"></bdt>third parties. Learn more about-ß</span></span><a data-custom-class="link" href="#whoshare"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text">when and with whom we share your personal information</span></span></a><span style="font-size: 15px;"><span data-custom-class="body_text">.<bdt class="block-component"></bdt></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>How do we keep your information safe?</strong> We have adequate <bdt class="block-component"></bdt>organizational<bdt class="statement-end-if-in-editor"></bdt> and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other <bdt class="block-component"></bdt>unauthorized<bdt class="statement-end-if-in-editor"></bdt> third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about-ß</span></span><a data-custom-class="link" href="#infosafe"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text">how we keep your information safe</span></span></a><span data-custom-class="body_text">.</span><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="statement-end-if-in-editor"></bdt></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about-ß</span></span><a data-custom-class="link" href="#privacyrights"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text">your privacy rights</span></span></a><span data-custom-class="body_text">.</span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by <bdt class="block-component">submitting a-ß</bdt></span></span><a data-custom-class="link" href="https://app.termly.io/dsar/e257dc4f-3b33-4928-b2ed-5ad8e0d1a1eb" rel="noopener noreferrer" target="_blank"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text">data subject access request</span></span></a><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text">Want to learn more about what we do with any information we collect?-ß</span></span><a data-custom-class="link" href="#toc"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text">Review the Privacy Notice in full</span></span></a><span style="font-size: 15px;"><span data-custom-class="body_text">.</span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><br></div><div id="toc" style="line-height: 1.5;"><span style="font-size: 15px;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>TABLE OF CONTENTS</h2></span></strong>-ß</span>-ß</span>-ß</span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><a data-custom-class="link" href="#infocollect"><span style="color: rgb(0, 58, 250);">1. WHAT INFORMATION DO WE COLLECT?</span></a></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><a data-custom-class="link" href="#infouse"><span style="color: rgb(0, 58, 250);">2. HOW DO WE PROCESS YOUR INFORMATION?<bdt class="block-component"></bdt></span></a></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span style="color: rgb(0, 58, 250);"><a data-custom-class="link" href="#whoshare">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></span><span data-custom-class="body_text"><bdt class="block-component"></bdt></a><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><bdt class="block-component"></bdt></span></span></span></span><bdt class="block-component"></bdt></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span style="color: rgb(89, 89, 89);"><span style="color: rgb(89, 89, 89);"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><a data-custom-class="link" href="#sociallogins"><span style="color: rgb(0, 58, 250);"><span style="color: rgb(0, 58, 250);"><span style="color: rgb(0, 58, 250);">4. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</span></span></span></a><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span style="color: rgb(89, 89, 89);"><span style="color: rgb(89, 89, 89);"><bdt class="statement-end-if-in-editor"></bdt></span></span><bdt class="block-component"></bdt></span></span></span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><a data-custom-class="link" href="#inforetain"><span style="color: rgb(0, 58, 250);">5. HOW LONG DO WE KEEP YOUR INFORMATION?</span></a><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span style="color: rgb(89, 89, 89);"><bdt class="block-component"></bdt></span></span></span></span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><a data-custom-class="link" href="#infosafe"><span style="color: rgb(0, 58, 250);">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</span></a><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><bdt class="statement-end-if-in-editor"></bdt><bdt class="block-component"></bdt></span></span></span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><a data-custom-class="link" href="#infominors"><span style="color: rgb(0, 58, 250);">7. DO WE COLLECT INFORMATION FROM MINORS?</span></a><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><bdt class="statement-end-if-in-editor"></bdt></span></span></span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span style="color: rgb(0, 58, 250);"><a data-custom-class="link" href="#privacyrights">8. WHAT ARE YOUR PRIVACY RIGHTS?</a></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><a data-custom-class="link" href="#DNT"><span style="color: rgb(0, 58, 250);">9. CONTROLS FOR DO-NOT-TRACK FEATURES<bdt class="block-component"></bdt></span></a></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><a data-custom-class="link" href="#uslaws"><span style="color: rgb(0, 58, 250);">10. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</span></a></span><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></bdt></span></div><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></bdt><bdt class="block-component"></bdt><bdt class="block-component"></bdt><bdt class="block-component"></bdt><bdt class="block-component"></bdt><bdt class="block-component"></bdt><bdt class="block-component"></bdt><bdt class="block-component"></bdt><bdt class="block-component"></bdt><bdt class="block-component"></span></bdt></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><a data-custom-class="link" href="#policyupdates"><span style="color: rgb(0, 58, 250);">11. DO WE MAKE UPDATES TO THIS NOTICE?</span></a></span></div><div style="line-height: 1.5;"><a data-custom-class="link" href="#contact"><span style="color: rgb(0, 58, 250); font-size: 15px;">12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</span></a></div><div style="line-height: 1.5;"><a data-custom-class="link" href="#request"><span style="color: rgb(0, 58, 250);">13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</span></a></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><br></div><div id="infocollect" style="line-height: 1.5;"><span style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0); font-size: 15px;"><span style="font-size: 15px; color: rgb(0, 0, 0);"><span style="font-size: 15px; color: rgb(0, 0, 0);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>1. WHAT INFORMATION DO WE COLLECT?</h2></span></strong></span></span></span></span></span><span data-custom-class="heading_2" id="personalinfo" style="color: rgb(0, 0, 0);"><span style="font-size: 15px;"><strong><h3>Personal information you disclose to us</h3></strong></span></span><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>In Short:</em></strong></span></span></span></span><span data-custom-class="body_text"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>-ß</em></strong><em>We collect personal information that you provide to us.</em></span></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">We collect personal information that you voluntarily provide to us when you <span style="font-size: 15px;"><bdt class="block-component"></bdt></span>register on the Services,-ß</span><span style="font-size: 15px;"><span data-custom-class="body_text"><span style="font-size: 15px;"><bdt class="statement-end-if-in-editor"></bdt></span></span><span data-custom-class="body_text">express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</span></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></span></span></span></span></div><div id="sensitiveinfo" style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>Sensitive Information.</strong> <bdt class="block-component"></bdt>We do not process sensitive information.</span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="else-block"></bdt></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"><bdt class="block-component"></bdt></bdt></span></span></span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong>Social Media Login Data.-ß</strong>We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider, as described in the section called <bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt><span style="font-size: 15px;"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(0, 58, 250);"><a data-custom-class="link" href="#sociallogins">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></span></span></span></span><bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt> below.</span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><bdt class="statement-end-if-in-editor"><bdt class="statement-end-if-in-editor"></bdt></bdt></span></span></span></span><bdt class="block-component"><bdt class="block-component"></span></span></bdt></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></bdt></span></span></span><bdt class="block-component"><span style="font-size: 15px;"></span></bdt></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><strong><span data-custom-class="heading_2"><h3>Google API</h3></span></strong><span data-custom-class="body_text">Our use of information received from Google APIs will adhere to-ß</span></span><a data-custom-class="link" href="https://developers.google.com/terms/api-services-user-data-policy" rel="noopener noreferrer" target="_blank"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text">Google API Services User Data Policy</span></span></a><span style="font-size: 15px;"><span data-custom-class="body_text">, including the-ß</span></span><a data-custom-class="link" href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" rel="noopener noreferrer" target="_blank"><span style="color: rgb(0, 58, 250); font-size: 15px;"><span data-custom-class="body_text">Limited Use requirements</span></span></a><span style="font-size: 15px;"><span data-custom-class="body_text">.</span><br></span></div><div><span style="font-size: 15px;"><br></span></div><div style="line-height: 1.5;"><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"></span></bdt><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="statement-end-if-in-editor"><bdt class="block-component"></bdt></bdt></span></span></span></span></bdt></span></span></span></span></span></span></span></span><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></div><div style="line-height: 1.5;"><br></div><div id="infouse" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2></span></strong></span></span></span><span data-custom-class="body_text"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>In Short:-ß</em></strong><em>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.<bdt class="block-component"></bdt> We may also process your information for other purposes <bdt class="block-component"></bdt>with your<bdt class="statement-end-if-in-editor"></bdt> consent.</em></span></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong><bdt class="block-component"></bdt></span></span></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong>To facilitate account creation and authentication and otherwise manage user accounts.-ß</strong>We may process your information so you can create and log in to your account, as well as keep your account in working order.<span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="statement-end-if-in-editor"></bdt></span></span></span></span></span></span></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></bdt></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></bdt></span></span></span></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></bdt></span></span></span></span></span></span></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><p style="font-size: 15px; line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></bdt></span></span></span></span></span></span></span></span></span></span></span></li></ul><p style="font-size: 15px; line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></bdt></span></span></span></span></span></span></span></span></span></span></span></li></ul><p style="font-size: 15px; line-height: 1.5;"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></span></li></ul><p style="font-size: 15px; line-height: 1.5;"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></bdt></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></bdt></span></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></bdt></span></span></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"><span data-custom-class="body_text"></bdt></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></bdt></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></bdt></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></bdt></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></bdt></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></bdt></span></span><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></div><div style="line-height: 1.5;"><br></div><div id="whoshare" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>In Short:</em></strong><em>-ßWe may share information in specific situations described in this section and/or with the following <bdt class="block-component"></bdt>third parties.</em></span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text">We <bdt class="block-component"></bdt>may need to share your personal information in the following situations:</span></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</span></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"><span data-custom-class="body_text"></span></bdt></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></bdt></span></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt><span data-custom-class="body_text"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></span><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><bdt class="block-component"><span data-custom-class="heading_1"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span><span style="font-size: 15px;"><bdt class="block-component"></bdt></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div id="sociallogins" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>4. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>In Short:-ß</em></strong><em>If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</em></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.<span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.<span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="statement-end-if-in-editor"></bdt></span><bdt class="block-component"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div id="inforetain" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>In Short:-ß</em></strong><em>We keep your information for as long as necessary to <bdt class="block-component"></bdt>fulfill<bdt class="statement-end-if-in-editor"></bdt> the purposes outlined in this Privacy Notice unless otherwise required by law.</em></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).<bdt class="block-component"></bdt> No purpose in this notice will require us keeping your personal information for longer than <span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span><bdt class="block-component"></bdt><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="else-block"></bdt></span></span></span>.</span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">When we have no ongoing legitimate business need to process your personal information, we will either delete or <bdt class="block-component"></bdt>anonymize<bdt class="statement-end-if-in-editor"></bdt> such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.<span style="color: rgb(89, 89, 89);"><bdt class="block-component"></bdt></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div id="infosafe" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>In Short:-ß</em></strong><em>We aim to protect your personal information through a system of <bdt class="block-component"></bdt>organizational<bdt class="statement-end-if-in-editor"></bdt> and technical security measures.</em></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">We have implemented appropriate and reasonable technical and <bdt class="block-component"></bdt>organizational<bdt class="statement-end-if-in-editor"></bdt> security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other <bdt class="block-component"></bdt>unauthorized<bdt class="statement-end-if-in-editor"></bdt> third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.<span style="color: rgb(89, 89, 89);"><bdt class="statement-end-if-in-editor"></bdt></span><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div id="infominors" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>7. DO WE COLLECT INFORMATION FROM MINORS?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>In Short:</em></strong><em>-ßWe do not knowingly collect data from or market to <bdt class="block-component"></bdt>children under 18 years of age<bdt class="block-component"></bdt><bdt class="else-block"></bdt>.</em><bdt class="block-component"></bdt></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">We do not knowingly collect, solicit data from, or market to children under 18 years of age<bdt class="block-component"></bdt>, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18<bdt class="block-component"></bdt> or that you are the parent or guardian of such a minor and consent to such minor dependentG╟╓s use of the Services. If we learn that personal information from users less than 18 years of age<bdt class="block-component"></bdt> has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18<bdt class="block-component"></bdt>, please contact us at <span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="question"><a target="_blank" data-custom-class="link" href="mailto:kfp1016@gmail.com">kfp1016@gmail.com</a></bdt><bdt class="else-block"></bdt></span></span>.</span><span data-custom-class="body_text"><bdt class="else-block"><bdt class="block-component"></bdt></span></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div id="privacyrights" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>8. WHAT ARE YOUR PRIVACY RIGHTS?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>In Short:</em></strong><em>-ß<span style="color: rgb(89, 89, 89);"><span style="font-size: 15px;"><span data-custom-class="body_text"><em><bdt class="block-component"></bdt></em></span></span>-ß</span>You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</em><span style="color: rgb(89, 89, 89);"><span style="font-size: 15px;"><bdt class="block-component"><bdt class="block-component"></span></span></span></div><div style="line-height: 1.5;"><br></div><div id="withdrawconsent" style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><u>Withdrawing your consent:</u></strong> If we are relying on your consent to process your personal information,<bdt class="block-component"></bdt> which may be express and/or implied consent depending on the applicable law,<bdt class="statement-end-if-in-editor"></bdt> you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section <bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt></span></span></span><a data-custom-class="link" href="#contact"><span style="font-size: 15px; color: rgb(0, 58, 250);"><span style="font-size: 15px; color: rgb(0, 58, 250);"><span data-custom-class="body_text">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</span></span></span></a><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt> below<bdt class="block-component"></bdt>.</span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text">However, please note that this will not affect the lawfulness of the processing before its withdrawal nor,<bdt class="block-component"></bdt> when applicable law allows,<bdt class="statement-end-if-in-editor"></bdt> will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.<bdt class="block-component"></bdt></span></span><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt><span style="font-size: 15px;"><span data-custom-class="heading_2"><strong><h3>Account Information</h3></strong></span></span><span data-custom-class="body_text"><span style="font-size: 15px;">If you would at any time like to review or change the information in your account or terminate your account, you can:<bdt class="forloop-component"></bdt></span></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span data-custom-class="body_text"><span style="font-size: 15px;"><bdt class="question">Contact us using the contact information provided.</bdt></span></span></li></ul><div style="line-height: 1.5;"><span data-custom-class="body_text"><span style="font-size: 15px;"><bdt class="forloop-component"></bdt></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text">Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</span></span><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></span></span><bdt class="block-component"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span data-custom-class="body_text"><span style="font-size: 15px;">If you have questions or comments about your privacy rights, you may email us at <bdt class="question noTranslate"><a target="_blank" data-custom-class="link" href="mailto:kfp1016@gmail.com">kfp1016@gmail.com</a></bdt>.</span></span><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"><span data-custom-class="body_text"></span></span></bdt></div><div style="line-height: 1.5;"><br></div><div id="DNT" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (<bdt class="block-component"></bdt>"DNT"<bdt class="statement-end-if-in-editor"></bdt>) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for <bdt class="block-component"></bdt>recognizing<bdt class="statement-end-if-in-editor"></bdt> and implementing DNT signals has been <bdt class="block-component"></bdt>finalized<bdt class="statement-end-if-in-editor"></bdt>. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.</span></span></span><bdt class="block-component"><span style="font-size: 15px;"></span></bdt></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><br></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text">California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for <bdt class="block-component"></bdt>recognizing<bdt class="statement-end-if-in-editor"></bdt> or <bdt class="block-component"></bdt>honoring<bdt class="statement-end-if-in-editor"></bdt> DNT signals, we do not respond to them at this time.</span></span><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"></span></bdt></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></div><div style="line-height: 1.5;"><br></div><div id="uslaws" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>10. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong><em>In Short:-ß</em></strong><em>If you are a resident of<bdt class="block-component"></bdt> California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia<bdt class="else-block"></bdt>, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below.</em></span><strong><span data-custom-class="heading_2"><h3>Categories of Personal Information We Collect</h3></span></strong><span data-custom-class="body_text">The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section <bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt></span></span></span><a data-custom-class="link" href="#infocollect"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(0, 58, 250);"><span data-custom-class="body_text"><span data-custom-class="link">WHAT INFORMATION DO WE COLLECT?</span></span></span></span></a><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt></span></span></span></div><div style="line-height: 1.5;"><br></div><table style="width: 100%;"><thead><tr><th style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black; text-align: left;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong>Category</strong></span></span></span></th><th style="width: 51.4385%; border-top: 1px solid black; border-right: 1px solid black; text-align: left;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong>Examples</strong></span></span></span></th><th style="width: 14.9084%; border-right: 1px solid black; border-top: 1px solid black; text-align: center; text-align: left;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong>Collected</strong></span></span></span></th></tr></thead><tbody><tr><td style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">A. Identifiers</span></span></span></div></td><td style="width: 51.4385%; border-top: 1px solid black; border-right: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</span></span></span></div></td><td style="width: 14.9084%; text-align: center; vertical-align: middle; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"><bdt class="block-component"></bdt></bdt>NO<bdt class="statement-end-if-in-editor"><bdt class="block-component"></bdt></span></span></span></div><div style="line-height: 1.5;"><br></div></td></tr></tbody></table><div style="line-height: 1.5;"><bdt class="block-component"></bdt></div><table style="width: 100%;"><tbody><tr><td style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">B. Personal information as defined in the California Customer Records statute</span></span></span></div></td><td style="width: 51.4385%; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Name, contact information, education, employment, employment history, and financial information</span></span></span></div></td><td style="width: 14.9084%; text-align: center; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="forloop-component"><bdt class="block-component"><bdt class="block-component">NO<bdt class="statement-end-if-in-editor"><bdt class="block-component"></bdt></bdt></span></span></span></div><div style="line-height: 1.5;"><br></div></td></tr></tbody></table><div style="line-height: 1.5;"><bdt class="block-component"></bdt></div><table style="width: 100%;"><tbody><tr><td style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>C<bdt class="else-block"></bdt>. Protected classification characteristics under state or federal law</span></span></span></div></td><td style="width: 51.4385%; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data</span></span></span></div></td><td style="width: 14.9084%; text-align: center; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><br></div><div data-custom-class="body_text" style="line-height: 1.5;"><bdt class="forloop-component"><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="block-component"></bdt>NO<bdt class="statement-end-if-in-editor"></bdt><bdt class="block-component"></span></bdt></div><div style="line-height: 1.5;"><br></div></td></tr><tr><td style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>D<bdt class="else-block"></bdt>. Commercial information</span></span></span></div></td><td style="width: 51.4385%; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Transaction information, purchase history, financial details, and payment information</span></span></span></div></td><td style="width: 14.9084%; text-align: center; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><br></div><div data-custom-class="body_text" style="line-height: 1.5;"><bdt class="forloop-component"><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="block-component"></bdt>NO<bdt class="statement-end-if-in-editor"><bdt class="block-component"></span></bdt></div><div style="line-height: 1.5;"><br></div></td></tr><tr><td style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>E<bdt class="else-block"></bdt>. Biometric information</span></span></span></div></td><td style="width: 51.4385%; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Fingerprints and voiceprints</span></span></span></div></td><td style="width: 14.9084%; text-align: center; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><br></div><div data-custom-class="body_text" style="line-height: 1.5;"><bdt class="forloop-component"><span data-custom-class="body_text"><bdt class="block-component"><bdt class="block-component">NO</bdt><bdt class="statement-end-if-in-editor"></bdt><bdt class="block-component"></span></bdt></div><div style="line-height: 1.5;"><br></div></td></tr><tr><td style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>F<bdt class="else-block"></bdt>. Internet or other similar network activity</span></span></span></div></td><td style="width: 51.4385%; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Browsing history, search history, online <bdt class="block-component"></bdt>behavior<bdt class="statement-end-if-in-editor"></bdt>, interest data, and interactions with our and other websites, applications, systems, and advertisements</span></span></span></div></td><td style="width: 14.9084%; text-align: center; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><br></div><div data-custom-class="body_text" style="line-height: 1.5;"><bdt class="forloop-component"><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="block-component"></bdt>NO<bdt class="statement-end-if-in-editor"></bdt><bdt class="block-component"></span></bdt></div><div style="line-height: 1.5;"><br></div></td></tr><tr><td style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>G<bdt class="else-block"></bdt>. Geolocation data</span></span></span></div></td><td style="width: 51.4385%; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Device location</span></span></span></div></td><td style="width: 14.9084%; text-align: center; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><br></div><div data-custom-class="body_text" style="line-height: 1.5;"><bdt class="forloop-component"><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="block-component"></bdt>NO<bdt class="statement-end-if-in-editor"></bdt><bdt class="block-component"></span></bdt></div><div style="line-height: 1.5;"><br></div></td></tr><tr><td style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>H<bdt class="else-block"></bdt>. Audio, electronic, sensory, or similar information</span></span></span></div></td><td style="width: 51.4385%; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Images and audio, video or call recordings created in connection with our business activities</span></span></span></div></td><td style="width: 14.9084%; text-align: center; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><br></div><div data-custom-class="body_text" style="line-height: 1.5;"><bdt class="forloop-component"><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="block-component"></bdt>NO<bdt class="statement-end-if-in-editor"></bdt><bdt class="block-component"></span></bdt></div><div style="line-height: 1.5;"><br></div></td></tr><tr><td style="width: 33.8274%; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>I<bdt class="else-block"></bdt>. Professional or employment-related information</span></span></span></div></td><td style="width: 51.4385%; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us</span></span></span></div></td><td style="width: 14.9084%; text-align: center; border-right: 1px solid black; border-top: 1px solid black;"><div style="line-height: 1.5;"><br></div><div data-custom-class="body_text" style="line-height: 1.5;"><bdt class="forloop-component"><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="block-component"></bdt>NO<bdt class="statement-end-if-in-editor"></bdt><bdt class="block-component"></span></bdt></div><div style="line-height: 1.5;"><br></div></td></tr><tr><td style="border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black; width: 33.8274%;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>J<bdt class="else-block"></bdt>. Education Information</span></span></span></div></td><td style="border-right: 1px solid black; border-top: 1px solid black; width: 51.4385%;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Student records and directory information</span></span></span></div></td><td style="text-align: center; border-right: 1px solid black; border-top: 1px solid black; width: 14.9084%;"><div style="line-height: 1.5;"><br></div><div data-custom-class="body_text" style="line-height: 1.5;"><bdt class="forloop-component"><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="block-component"></bdt>NO<bdt class="statement-end-if-in-editor"></bdt><bdt class="block-component"></span></bdt></div><div style="line-height: 1.5;"><br></div></td></tr><tr><td style="border-width: 1px; border-color: black; border-style: solid; width: 33.8274%;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>K<bdt class="else-block"></bdt>. Inferences drawn from collected personal information</span></span></span></div></td><td style="border-bottom: 1px solid black; border-top: 1px solid black; border-right: 1px solid black; width: 51.4385%;"><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individualG╟╓s preferences and characteristics</span></span></span></div></td><td style="text-align: center; border-right: 1px solid black; border-bottom: 1px solid black; border-top: 1px solid black; width: 14.9084%;"><div style="line-height: 1.5;"><br></div><div data-custom-class="body_text" style="line-height: 1.5;"><span data-custom-class="body_text"><bdt class="block-component"></bdt>NO<span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="statement-end-if-in-editor"></bdt></span></span></span></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div></td></tr><tr><td style="border-left: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black; line-height: 1.5;"><span data-custom-class="body_text"><bdt class="block-component"></bdt>L<bdt class="else-block"></bdt>. Sensitive personal Information</span></td><td style="border-right: 1px solid black; border-bottom: 1px solid black; line-height: 1.5;"><bdt class="block-component"><span data-custom-class="body_text"></span></bdt></td><td style="border-right: 1px solid black; border-bottom: 1px solid black;"><div data-empty="true" style="text-align: center;"><br></div><div data-custom-class="body_text" data-empty="true" style="text-align: center; line-height: 1.5;"><bdt class="block-component"><span data-custom-class="body_text"></bdt>NO</span><bdt class="statement-end-if-in-editor"><span data-custom-class="body_text"></span></bdt></div><div data-empty="true" style="text-align: center;"><br></div></td></tr></tbody></table><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></bdt></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text">We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:</span><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;">Receiving help through our customer support channels;<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text"><span style="font-size: 15px;">Participation in customer surveys or contests; and<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text"><span style="font-size: 15px;">Facilitation in the delivery of our Services and to respond to your inquiries.</span><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span data-custom-class="body_text"></span></bdt></li></ul><div style="line-height: 1.5;"><strong><span style="font-size: 15px;"><span data-custom-class="heading_2"><h3>Sources of Personal Information</h3></span></span></strong><span style="font-size: 15px;"><span data-custom-class="body_text">Learn more about the sources of personal information we collect in <bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt></span></span><span style="color: rgb(0, 58, 250);"><span data-custom-class="body_text"><a data-custom-class="link" href="#infocollect"><span style="color: rgb (0, 58, 250); font-size: 15px;">WHAT INFORMATION DO WE COLLECT?</span></a></span></span><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt>"</span><bdt class="statement-end-if-in-editor"><span data-custom-class="body_text"></span></bdt></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><strong><span data-custom-class="heading_2"><h3>How We Use and Share Personal Information</h3></span></strong></span></span><span data-custom-class="body_text" style="font-size: 15px;"><bdt class="block-component"></bdt>Learn more about how we use your personal information in the section, <bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt></span><a data-custom-class="link" href="#infouse"><span style="color: rgb(0, 58, 250); font-size: 15px;">HOW DO WE PROCESS YOUR INFORMATION?</span></a><span data-custom-class="body_text" style="font-size: 15px;"><bdt class="block-component"></bdt>"</span><bdt class="statement-end-if-in-editor"><span data-custom-class="body_text" style="font-size: 15px;"></span></bdt></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></bdt></bdt></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><strong>Will your information be shared with anyone else?</strong></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, <bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt></span></span></span><a data-custom-class="link" href="#whoshare"><span style="font-size: 15px; color: rgb(0, 58, 250);"><span style="font-size: 15px; color: rgb(0, 58, 250);">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</span></span></a><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be <bdt class="block-component"></bdt>"selling"<bdt class="statement-end-if-in-editor"></bdt> of your personal information.<span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We<span style="color: rgb(89, 89, 89);">-ß</span>will not sell or share personal information in the future belonging to website visitors, users, and other consumers.<span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="statement-end-if-in-editor"></bdt></span></span></span></span><bdt class="block-component"></bdt></span></span></span></span></span></span></span></span></span></bdt></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span data-custom-class="body_text"><span style="color: rgb(0, 0, 0);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></span></span></span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><strong><span data-custom-class="heading_2"><h3>Your Rights</h3></span></strong><span data-custom-class="body_text">You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:</span><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;"><strong>Right to know</strong> whether or not we are processing your personal data<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;"><strong>Right to access-ß</strong>your personal data<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;"><strong>Right to correct-ß</strong>inaccuracies in your personal data<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;"><strong>Right to request</strong> the deletion of your personal data<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;"><strong>Right to obtain a copy-ß</strong>of the personal data you previously shared with us<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;"><strong>Right to non-discrimination</strong> for exercising your rights<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;"><strong>Right to opt out</strong> of the processing of your personal data if it is used for targeted advertising<bdt class="block-component"></bdt> (or sharing as defined under CaliforniaG╟╓s privacy law)<bdt class="statement-end-if-in-editor"></bdt>, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (<bdt class="block-component"></bdt>"profiling"<bdt class="statement-end-if-in-editor"></bdt>)<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text">Depending upon the state where you live, you may also have the following rights:</span><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;">Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;">Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in<bdt class="block-component"></bdt> California, Delaware, and Maryland<bdt class="else-block"></bdt><bdt class="block-component"></bdt>)<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></span></bdt></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;">Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in<bdt class="block-component"></bdt> Minnesota and Oregon<bdt class="else-block"></bdt>)</span><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></span></bdt></div><ul><li data-custom-class="body_text" style="line-height: 1.5; font-size: 15px;">Right to obtain a list of third parties to which we have sold personal data (as permitted by applicable law, including the privacy law in Connecticut)<bdt class="statement-end-if-in-editor"></bdt></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;">Right to review, understand, question, and depending on where you live, correct how personal data has been profiled (as permitted by applicable law, including the privacy law in <bdt class="block-component"></bdt>Connecticut and Minnesota<bdt class="else-block"></bdt>)<bdt class="statement-end-if-in-editor"></bdt></span></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></span></bdt></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;">Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)</span><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"></span></bdt></li></ul><div style="line-height: 1.5;"><bdt class="block-component"><span style="font-size: 15px;"></span></bdt></div><ul><li data-custom-class="body_text" style="line-height: 1.5;"><span style="font-size: 15px;">Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)</span><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"></span></bdt></li></ul><div style="line-height: 1.5;"><span style="font-size: 15px;"><bdt class="statement-end-if-in-editor"></bdt></span><strong><span style="font-size: 15px;"><span data-custom-class="heading_2"><h3>How to Exercise Your Rights</h3></span></span></strong><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">To exercise these rights, you can contact us <bdt class="block-component"></bdt>by submitting a-ß</span></span></span><a data-custom-class="link" href="https://app.termly.io/dsar/e257dc4f-3b33-4928-b2ed-5ad8e0d1a1eb" rel="noopener noreferrer" target="_blank"><span style="font-size: 15px; color: rgb(0, 58, 250);"><span style="font-size: 15px; color: rgb(0, 58, 250);">data subject access request</span></span></a><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">, <bdt class="block-component"></bdt></span><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="block-component"></bdt></span><span data-custom-class="body_text"><bdt class="block-component"></bdt><bdt class="block-component"><span data-custom-class="body_text"><bdt class="block-component">by emailing us at-ß</bdt><bdt class="question noTranslate"><a target="_blank" data-custom-class="link" href="mailto:kfp1016@gmail.com">kfp1016@gmail.com</a></bdt>, <bdt class="statement-end-if-in-editor"></bdt></bdt></span></span></span></span></span></span></span></span></span></span></span></span><span data-custom-class="body_text">or by referring to the contact details at the bottom of this document.</span></span></span><bdt class="block-component"><span style="font-size: 15px;"></span></bdt><bdt class="block-component"><span style="font-size: 15px;"></span></bdt></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text">Under certain US state data protection laws, you can designate an <bdt class="block-component"></bdt>authorized<bdt class="statement-end-if-in-editor"></bdt> agent to make a request on your behalf. We may deny a request from an <bdt class="block-component"></bdt>authorized<bdt class="statement-end-if-in-editor"></bdt> agent that does not submit proof that they have been validly <bdt class="block-component"></bdt>authorized<bdt class="statement-end-if-in-editor"></bdt> to act on your behalf in accordance with applicable laws.</span><br><strong><span data-custom-class="heading_2"><h3>Request Verification</h3></span></strong><span data-custom-class="body_text">Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes.</span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><br></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text">If you submit the request through an <bdt class="block-component"></bdt>authorized<bdt class="statement-end-if-in-editor"></bdt> agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf.</span></span><bdt class="block-component"><span style="font-size: 15px;"></span></bdt><span style="font-size: 15px;"><span data-custom-class="heading_2"><strong><h3>Appeals</h3></strong></span><span data-custom-class="body_text">Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at <bdt class="block-component"></bdt><bdt class="question noTranslate"><a target="_blank" data-custom-class="link" href="mailto:kfp1016@gmail.com">kfp1016@gmail.com</a></bdt><bdt class="else-block"></bdt>. We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general.</span><bdt class="statement-end-if-in-editor"></bdt></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"><bdt class="block-component"></span></bdt></span></span></span></span></span></span></span></span></span></span><bdt class="block-component"><span style="font-size: 15px;"></span></bdt><span style="font-size: 15px;"><strong><span data-custom-class="heading_2"><h3>California <bdt class="block-component"></bdt>"Shine The Light"<bdt class="statement-end-if-in-editor"></bdt> Law</h3></span></strong><span data-custom-class="body_text">California Civil Code Section 1798.83, also known as the <bdt class="block-component"></bdt>"Shine The Light"<bdt class="statement-end-if-in-editor"></bdt> law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section <bdt class="block-component"></bdt>"<bdt class="statement-end-if-in-editor"></bdt></span></span><span data-custom-class="body_text"><a data-custom-class="link" href="#contact"><span style="color: rgb(0, 58, 250); font-size: 15px;">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</span></a></span><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"></bdt>"</span><bdt class="statement-end-if-in-editor"><span data-custom-class="body_text"></span></bdt></span><bdt class="statement-end-if-in-editor"><span style="font-size: 15px;"></span></bdt><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="statement-end-if-in-editor"><span data-custom-class="body_text"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="statement-end-if-in-editor"><bdt class="statement-end-if-in-editor"></bdt></bdt></span></span></span></span></span></span></span></span></span></span></span></bdt></span></span></span></span></span></span></span></span></span></span><bdt class="block-component"><span style="font-size: 15px;"></bdt></span><bdt class="block-component"><span style="font-size: 15px;"></span></bdt></div><div style="line-height: 1.5;"><br></div><div id="policyupdates" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>11. DO WE MAKE UPDATES TO THIS NOTICE?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><em><strong>In Short:-ß</strong>Yes, we will update this notice as necessary to stay compliant with relevant laws.</em></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">We may update this Privacy Notice from time to time. The updated version will be indicated by an updated <bdt class="block-component"></bdt>"Revised"<bdt class="statement-end-if-in-editor"></bdt> date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.</span></span></span></div><div style="line-height: 1.5;"><br></div><div id="contact" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">If you have questions or comments about this notice, you may <span style="color: rgb(89, 89, 89); font-size: 15px;"><span data-custom-class="body_text"><bdt class="block-component"><bdt class="block-component"></bdt></bdt>email us at <bdt class="question noTranslate"><a target="_blank" data-custom-class="link" href="mailto:kfp1016@gmail.com">kfp1016@gmail.com</a> or-ß</bdt><bdt class="statement-end-if-in-editor"><bdt class="block-component"></bdt></bdt></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text">contact us by post at:</span></span></span></span></span></span></div><div style="line-height: 1.5;"><br></div><div style="line-height: 1.5;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><span style="font-size: 15px;"><span style="color: rgb(89, 89, 89);"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="question noTranslate">Cascade Builder Services</bdt></span></span></span></span></span><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></bdt></span></span></span></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="question noTranslate">__________</bdt><span style="color: rgb(89, 89, 89);"><span style="font-size: 15px;"><bdt class="block-component"></bdt></span></span></span></bdt></span></div><div style="line-height: 1.5;"><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="question">__________</bdt><span style="color: rgb(89, 89, 89);"><span style="font-size: 15px;"><bdt class="block-component"></bdt><bdt class="block-component"></bdt><bdt class="block-component"></bdt></span></span></span><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89);"><span style="font-size: 15px;"><bdt class="statement-end-if-in-editor"><bdt class="block-component"></span></bdt><span style="font-size: 15px;"><span data-custom-class="body_text"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px;"><span data-custom-class="body_text"><bdt class="statement-end-if-in-editor"><bdt class="block-component"></bdt></span></span></div><div style="line-height: 1.5;"><br></div><div id="request" style="line-height: 1.5;"><span style="color: rgb(127, 127, 127);"><span style="color: rgb(89, 89, 89); font-size: 15px;"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span id="control" style="color: rgb(0, 0, 0);"><strong><span data-custom-class="heading_1"><h2>13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2></span></strong></span></span></span></span></span><span style="font-size: 15px; color: rgb(89, 89, 89);"><span style="font-size: 15px; color: rgb(89, 89, 89);"><span data-custom-class="body_text"><bdt class="block-component"></bdt></bdt>You have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to <bdt class="block-component"></bdt>withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please <bdt class="block-component"></bdt>fill out and submit a-ß</span><span style="color: rgb(0, 58, 250);"><span data-custom-class="body_text"><span style="color: rgb(0, 58, 250); font-size: 15px;"><a data-custom-class="link" href="https://app.termly.io/dsar/e257dc4f-3b33-4928-b2ed-5ad8e0d1a1eb" rel="noopener noreferrer" target="_blank">data subject access request</a></span></span></span><bdt class="block-component"><span data-custom-class="body_text"></bdt></span></span><span data-custom-class="body_text">.</span></span></span></div><style>
      ul {
        list-style-type: square;
      }
      ul > li > ul {
        list-style-type: circle;
      }
      ul > li > ul > li > ul {
        list-style-type: square;
      }
      ol li {
        font-family: Arial ;
      }
    </style>
      </div>
  `;

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
                     <span className="text-primary-600">Full management of the builderG╟╓s one-year limited warranty.</span>
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
               With a 17-year track record and over 5,000 homes managed, our team combines deep industry knowledge with cutting-edge technology to serve you, your trade contractors, and your homeowners. Don't let warranty issues slow you downG╟÷contact us to see how we can save you time and money.
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
                  src="https://buildertrend.net/leads/contactforms/ContactFormFrame.aspx?builderID=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJidWlsZGVySWQiOjE0NTU0fQ.51ncoT1zTRFj7obs1mrymJbr5T4fWtTzBRdGTp8KFuk" 
                  id="btIframe" 
                  className="w-full border-none min-h-[800px]"
                  scrolling="no"
                  title="Enrollment Form"`n                  style={{ background: 'transparent', border: '0px', margin: '0 auto', width: '100%' }}`n                
                />
             </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyPolicyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsPrivacyPolicyOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
             
             {/* Header */}
             <div className="p-6 border-b border-primary-100 flex items-center justify-center bg-white z-10 relative">
               <div className="inline-block px-8 py-2 rounded-full bg-primary-200 shadow-sm">
                  <h3 className="text-xl font-medium text-primary-900 leading-none">Privacy Policy</h3>
               </div>
               <button 
                onClick={() => setIsPrivacyPolicyOpen(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
               >
                 <X size={24} />
               </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-8">
                <div dangerouslySetInnerHTML={{ __html: privacyPolicyContent }} />
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
                    <div className="flex-shrink-0">
                      <img src="/nossum.png" alt="Christian Nossum and Dan Keller" className="w-auto h-auto max-w-[200px] max-h-[200px] rounded-xl" />
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
                    <div className="flex-shrink-0">
                      <img src="/reba.png" alt="Team Reba Radio Show" className="w-auto h-auto max-w-[200px] max-h-[200px] rounded-xl" />
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
                  <a 
                    href="https://buildertrend.net" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full bg-primary-700 text-white py-4 rounded-full font-bold text-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <LogIn size={20} /> Login
                  </a>
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
             <div className={`flex-1 overflow-y-auto p-6 md:p-8 ${claimHelpView === 'SELECT' ? 'no-scrollbar' : 'custom-scrollbar'}`}>
               
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
                           G▄ßn+┼ DO NOT submit requests under the G╟úTo-DoG╟╓sG╟Ñ tab. We will not be notified and doing so will delay the processing of your claims.
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
                           Click the blue G╟ú+ ClaimG╟Ñ button at the top right.
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
                           G▄ßn+┼ DO NOT submit requests under "To-DoG╟╓s".
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
                           G▄ßn+┼ DO NOT submit requests under "To-DoG╟╓s".
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
