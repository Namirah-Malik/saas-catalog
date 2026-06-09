"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  images?: string[];
  specifications?: Record<string, string>;
  category?: { name: string };
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  primaryColor?: string;
  logo?: string;
}

interface CartItem extends Product {
  qty: number;
}

interface ClientPageProps {
  tenant: Tenant;
  products: Product[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    bg: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80",
    eyebrow: "Authorized Microtek Partner",
    headline: "Power Your Future with Clean Solar Energy",
    sub: "Save up to 80% on electricity bills. 30-year warranty. Easy EMI options. Join 1000+ satisfied customers across India.",
    cta1: "Explore Products",
    cta2: "Get Free Consultation",
  },
  {
    bg: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=80",
    eyebrow: "Reliable Power Backup",
    headline: "Never Face a Powercut Again",
    sub: "From home inverters to industrial UPS systems — we deliver uninterrupted power for every need, every load, every hour.",
    cta1: "View Inverters",
    cta2: "Calculate Your Load",
  },
  {
    bg: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1600&q=80",
    eyebrow: "Premium Tubular Batteries",
    headline: "Long-Lasting Backup You Can Count On",
    sub: "Microtek tubular batteries with 36–60 month warranty. Compatible with all inverter brands. Pan-India delivery available.",
    cta1: "Shop Batteries",
    cta2: "Talk to Expert",
  },
  {
    bg: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1600&q=80",
    eyebrow: "15+ Years of Excellence",
    headline: "Trusted by 1000+ Homes & Businesses",
    sub: "From Hyderabad to pan-India — Satyajan Energy Solutions is your one-stop shop for inverters, batteries, solar & UPS.",
    cta1: "Our Products",
    cta2: "Read Reviews",
  },
];

const MARQUEE_ITEMS = [
  "Solar Panel Installation",
  "Battery Replacement",
  "Inverter Setup & Repair",
  "Free Consultation",
  "24/7 Support",
  "Easy EMI Options",
  "Pan-India Delivery",
  "Free Installation",
  "Microtek Authorized Partner",
  "Lithium Battery Upgrade",
  "Online UPS Solutions",
  "Warranty Claim Support",
];

const WHY_CARDS = [
  {
    icon: "🛡️",
    title: "Authorized Channel Partner",
    desc: "Official partner ensuring genuine products with full manufacturer warranty and support.",
    color: "#10b981",
  },
  {
    icon: "🏆",
    title: "15+ Years of Excellence",
    desc: "Proven track record of delivering reliable power solutions across India with an expert technical team.",
    color: "#3b82f6",
  },
  {
    icon: "🎧",
    title: "24/7 Customer Support",
    desc: "Dedicated support team available round the clock for installation, maintenance, and troubleshooting.",
    color: "#f59e0b",
  },
  {
    icon: "💰",
    title: "Best Price Guarantee",
    desc: "Competitive pricing with flexible payment options and special discounts for bulk orders.",
    color: "#8b5cf6",
  },
  {
    icon: "🚚",
    title: "Pan-India Delivery",
    desc: "Fast and reliable delivery to 500+ locations with professional installation services.",
    color: "#ef4444",
  },
  {
    icon: "🔧",
    title: "Free Installation & Training",
    desc: "Complimentary installation by certified technicians with comprehensive product training.",
    color: "#06b6d4",
  },
];

const COMPARISON_ROWS = [
  { feature: "Product Availability", satyajan: true, online: true, local: true },
  { feature: "Expert Guidance", satyajan: "Experienced Team", online: "Limited", local: "Depends" },
  { feature: "Proper Product Recommendation", satyajan: true, online: "Limited", local: "Depends" },
  { feature: "Installation Support", satyajan: true, online: "Limited", local: "Depends" },
  { feature: "Fast Delivery (Same/Next Day)", satyajan: true, online: "By Location", local: "Limited" },
  { feature: "Paperless Warranty Support", satyajan: true, online: "Limited", local: "Depends" },
  { feature: "Warranty Claim Assistance", satyajan: true, online: "Limited", local: "Depends" },
  { feature: "After-Sales Service", satyajan: true, online: "Limited", local: "Limited" },
  { feature: "Direct Expert Support (Call/WhatsApp)", satyajan: true, online: "Not Available", local: "Limited" },
];

const TESTIMONIALS_GOOGLE = [
  {
    name: "Mallikarjun M",
    location: "Hyderabad",
    meta: "Local Guide · 32 reviews",
    text: "Very reliable and responsive service, from inspection to installation done in matter of hours. Pricing is reasonable and very competitive.",
    source: "Google",
    avatar: "M",
    color: "#3b82f6",
  },
  {
    name: "Akshay Chatala",
    location: "Hyderabad",
    meta: "4 reviews",
    text: "Purchased battery working very & very good service installation done by them.",
    source: "Google",
    avatar: "A",
    color: "#10b981",
  },
  {
    name: "Karthik Srinivasan",
    location: "Hyderabad",
    meta: "2 reviews",
    text: "I had purchased inverter 3 years back, it's working great and I am very happy with the product and after sales service is very good.",
    source: "Google",
    avatar: "K",
    color: "#f59e0b",
  },
  {
    name: "Rushikesh Manchala",
    location: "Hyderabad",
    meta: "2 reviews",
    text: "I am using the invertor from past 2 years till now there is no trouble and its working well. This product is good and can go for it.",
    source: "Google",
    avatar: "R",
    color: "#8b5cf6",
  },
  {
    name: "Atul Ragit",
    location: "Hyderabad",
    meta: "ECE Solar · 1 review",
    text: "Nice Service by Satyajan Energy Solution. Fast Delivery with quality products.",
    source: "Google",
    avatar: "A",
    color: "#ef4444",
  },
  {
    name: "Chandu Yadav",
    location: "Hyderabad",
    meta: "4 reviews · 3 photos",
    text: "Good service whole sale price, fast delivery.",
    source: "Google",
    avatar: "C",
    color: "#06b6d4",
  },
  {
    name: "Syed Sha Kaleem",
    location: "Hyderabad",
    meta: "Local Guide · 78 reviews",
    text: "Battery is working fine no problem since 3-4 years. Great quality product and reliable service from Satyajan.",
    source: "Google",
    avatar: "S",
    color: "#10b981",
  },
];

const TESTIMONIALS_INDIAMART = [
  {
    name: "Imran",
    location: "Hyderabad, Telangana",
    meta: "05-Jan-2026 · Verified Buyer",
    text: "Purchased Microtek Inverter — very satisfied with the quality and prompt service by Satyajan Energy Solutions.",
    source: "IndiaMART",
    avatar: "I",
    color: "#f59e0b",
  },
  {
    name: "Akhil Reddy",
    location: "Adilabad, Telangana",
    meta: "30-Dec-2022 · Off Grid Solar · Verified Buyer",
    text: "He has always provided us with the lowest prices and the best quality. Thank you so much Arun garu for your friendly cooperation.",
    source: "IndiaMART",
    avatar: "A",
    color: "#3b82f6",
  },
  {
    name: "Svnarasimha Reddy",
    location: "Proddatur, Andhra Pradesh",
    meta: "30-Jan-2026 · Solar Panel · Verified Buyer",
    text: "Purchased Adani Solar Panels — excellent product and great service experience overall.",
    source: "IndiaMART",
    avatar: "S",
    color: "#8b5cf6",
  },
  {
    name: "Venkatesh",
    location: "Hyderabad, Telangana",
    meta: "07-Jan-2026 · Battery · Verified Buyer",
    text: "Bought Microtek Dura Long Inverter Battery with ADC Technology — response, quality and delivery all excellent.",
    source: "IndiaMART",
    avatar: "V",
    color: "#ef4444",
  },
  {
    name: "Roop",
    location: "Hyderabad, Telangana",
    meta: "03-Jan-2026 · SMF Battery · Verified Buyer",
    text: "Purchased Quanta SMF Battery — response, quality and delivery all excellent. Very happy with Satyajan's service.",
    source: "IndiaMART",
    avatar: "R",
    color: "#06b6d4",
  },
];

const PROJECTS = [
  {
    title: "Microtek iMAXX Online UPS with Battery Bank",
    location: "Hyderabad, Telangana",
    spec: "100 kVA Online UPS",
    category: "Online UPS",
    desc: "Installed a Microtek iMAXX 100kVA online UPS with a 32-battery Exide Powersafe SMF bank for a commercial office requiring zero-downtime power.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    title: "Home Inverter + Tall Tubular Battery",
    location: "Hyderabad, Telangana",
    spec: "1250VA / 150Ah",
    category: "Home Inverter",
    desc: "Installed a Microtek Heavy Duty inverter with tall tubular battery — providing 6+ hours backup for fans, lights, TV and essential appliances.",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
  },
  {
    title: "School Classroom Power Backup",
    location: "Hyderabad, Telangana",
    spec: "900VA / 150Ah",
    category: "Educational",
    desc: "Deployed Microtek inverter + tall tubular battery for a school classroom, ensuring uninterrupted power for fans, lights and smart board.",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
  },
  {
    title: "Solar PCU + Tall Tubular Battery System",
    location: "Hyderabad, Telangana",
    spec: "1kW Solar + 200Ah Storage",
    category: "Solar + Battery",
    desc: "Installed Microtek Solar PCU with 2× tall tubular batteries — enabling home to run on solar power during the day and stored energy at night.",
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
  },
  {
    title: "Microtek Inverter with BIG POWERR Battery",
    location: "Hyderabad, Telangana",
    spec: "1250VA / 180Ah",
    category: "Home Inverter",
    desc: "Complete home power backup with Microtek Heavy Duty inverter and BIG POWERR 180Ah tubular battery — 8+ hours backup for a 3 BHK apartment.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    title: "Microtek LUXE Inverter + Lithium-Ion Battery",
    location: "Hyderabad, Telangana",
    spec: "1100VA / 100Ah LFP",
    category: "Lithium Battery",
    desc: "Upgraded from conventional tubular battery to Microtek LFP Lithium-Ion — 3500+ cycles, maintenance-free, 5× faster charging.",
    img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80",
  },
];

const PRODUCT_CATEGORIES = [
  {
    name: "Solar Solutions",
    icon: "☀️",
    desc: "High-efficiency solar panels with 25+ year warranty. Complete on-grid and off-grid solutions.",
    features: ["25+ year panel warranty", "Govt. subsidy assistance", "On-grid & off-grid options"],
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
  },
  {
    name: "Inverter / Home UPS",
    icon: "⚡",
    desc: "Pure sine wave inverters with intelligent battery management. Capacity from 700VA to 2000VA.",
    features: ["Pure sine wave output", "700VA to 2000VA range", "Smart battery charging"],
    img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80",
  },
  {
    name: "Jumbo UPS",
    icon: "🔋",
    desc: "High capacity 2KVA to 10KVA for extended backup. Perfect for offices, shops, and large homes.",
    features: ["2KVA to 10KVA capacity", "Overload protection", "Office & commercial grade"],
    img: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80",
  },
  {
    name: "Online UPS",
    icon: "🖥️",
    desc: "Wide range from 1KVA to 120KVA. True online double conversion for zero transfer time.",
    features: ["1KVA to 120KVA range", "Zero transfer time", "For servers & data centers"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    name: "Tubular Battery",
    icon: "🔌",
    desc: "Long-lasting tubular inverter batteries from 80Ah to 220Ah. 36–60 month warranty.",
    features: ["36–60 month warranty", "80Ah to 220Ah range", "All inverter compatible"],
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
  },
  {
    name: "Lithium Batteries",
    icon: "🌱",
    desc: "Advanced lithium-ion with 10+ year lifespan, 3000+ charge cycles, maintenance-free.",
    features: ["10+ years lifespan", "3000+ charge cycles", "Built-in BMS system"],
    img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 14, letterSpacing: 1 }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  if (source === "Google") {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#4285F4" }}>
        <span style={{ fontSize: 14 }}>G</span> Google
      </span>
    );
  }
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#e8732a" }}>
      <span>IM</span> IndiaMART
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientPage({ tenant, products }: ClientPageProps) {
  const primary = tenant?.primaryColor || "#10b981";
  const scrollY = useScrollY();

  // State
  const [heroIdx, setHeroIdx] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTestimonialTab, setActiveTestimonialTab] = useState<"google" | "indiamart">("google");
  const [inquiryForm, setInquiryForm] = useState({ name: "", phone: "", email: "", quantity: "1", message: "" });
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [statsVisible, setStatsVisible] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  // Hero auto-rotate
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  // Stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const animate = (setter: (n: number) => void, target: number, duration = 2000) => {
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { setter(target); clearInterval(timer); }
        else setter(Math.floor(current));
      }, 16);
    };
    animate(setCount1, 1000);
    animate(setCount2, 15);
    animate(setCount3, 80);
  }, [statsVisible]);

  // Cart persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cart_${tenant?.slug}`);
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, [tenant?.slug]);

  useEffect(() => {
    try {
      localStorage.setItem(`cart_${tenant?.slug}`, JSON.stringify(cart));
    } catch {}
  }, [cart, tenant?.slug]);

  const addToCart = useCallback((p: Product) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === p.id);
      if (existing) return prev.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...p, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart((prev) => prev.map((x) => x.id === id ? { ...x, qty: Math.max(1, x.qty + delta) } : x).filter((x) => x.qty > 0));
  }, []);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const filteredProducts = products?.filter((p) =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const openInquiry = (p: Product) => {
    setSelectedProduct(p);
    setInquiryOpen(true);
  };

  const submitInquiry = async () => {
    if (!inquiryForm.name || !inquiryForm.phone) return;
    setInquiryStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inquiryForm,
          tenantId: tenant?.id,
          productId: selectedProduct?.id,
          message: `Product: ${selectedProduct?.name || "General Inquiry"}\nQty: ${inquiryForm.quantity}\n${inquiryForm.message}`,
        }),
      });
      if (res.ok) {
        setInquiryStatus("sent");
        setTimeout(() => { setInquiryOpen(false); setInquiryStatus("idle"); setInquiryForm({ name: "", phone: "", email: "", quantity: "1", message: "" }); }, 2500);
      } else setInquiryStatus("error");
    } catch { setInquiryStatus("error"); }
  };

  const submitContact = async () => {
    if (!contactForm.name || !contactForm.phone || !contactForm.message) return;
    setContactStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contactForm, tenantId: tenant?.id, message: contactForm.message }),
      });
      if (res.ok) {
        setContactStatus("sent");
        setTimeout(() => { setContactStatus("idle"); setContactForm({ name: "", email: "", phone: "", message: "" }); }, 3000);
      } else setContactStatus("error");
    } catch { setContactStatus("error"); }
  };

  const navbarBg = scrollY > 80;
  const slide = HERO_SLIDES[heroIdx];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: "#fff", color: "#111", overflowX: "hidden" }}>

      {/* ── CSS Animations ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        .fade-in{animation:fadeIn 0.6s ease forwards}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .slide-up{animation:slideUp 0.5s ease forwards}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .hero-slide{transition:opacity 0.8s ease}
        .card-hover{transition:transform 0.25s ease,box-shadow 0.25s ease}
        .card-hover:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.12)}
        .btn-primary{background:${primary};color:#fff;border:none;border-radius:8px;padding:12px 24px;font-size:15px;font-weight:600;cursor:pointer;transition:filter 0.2s,transform 0.15s}
        .btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px)}
        .btn-outline{background:transparent;color:${primary};border:2px solid ${primary};border-radius:8px;padding:10px 22px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s}
        .btn-outline:hover{background:${primary};color:#fff}
        .btn-white{background:#fff;color:#111;border:none;border-radius:8px;padding:12px 24px;font-size:15px;font-weight:600;cursor:pointer;transition:filter 0.2s}
        .btn-white:hover{filter:brightness(0.92)}
        .product-card:hover .product-overlay{opacity:1}
        .product-overlay{opacity:0;transition:opacity 0.25s}
        .marquee-track{display:flex;gap:40px;animation:marquee 30s linear infinite;white-space:nowrap}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .testimonial-card{background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.08);border:1px solid #f0f0f0}
        .reviews-scroll{display:flex;gap:20px;overflow-x:auto;padding-bottom:8px;scrollbar-width:thin;scroll-snap-type:x mandatory}
        .reviews-scroll::-webkit-scrollbar{height:4px}
        .reviews-scroll::-webkit-scrollbar-track{background:#f1f1f1;border-radius:10px}
        .reviews-scroll::-webkit-scrollbar-thumb{background:${primary};border-radius:10px}
        .reviews-scroll>*{scroll-snap-align:start;flex:0 0 300px}
        input,textarea{width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;transition:border-color 0.2s;font-family:inherit}
        input:focus,textarea:focus{border-color:${primary}}
        label{font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px}
        .comparison-check{color:${primary};font-weight:700;font-size:16px}
        .comparison-x{color:#9ca3af;font-size:14px}
        @media(max-width:768px){
          .hero-btns{flex-direction:column;gap:10px}
          .hero-stats{flex-direction:column;gap:16px}
          .why-grid{grid-template-columns:1fr 1fr!important}
          .products-grid{grid-template-columns:1fr 1fr!important}
          .footer-grid{grid-template-columns:1fr 1fr!important}
          .comparison-table{font-size:12px}
          .projects-grid{grid-template-columns:1fr!important}
          .categories-grid{grid-template-columns:1fr 1fr!important}
          .contact-grid{grid-template-columns:1fr!important}
        }
        @media(max-width:480px){
          .why-grid{grid-template-columns:1fr!important}
          .categories-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr!important}
          .products-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: navbarBg ? "#fff" : "transparent",
        boxShadow: navbarBg ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.3s ease",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {tenant?.logo ? (
              <img src={tenant.logo} alt={tenant.name} style={{ height: 40, objectFit: "contain" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 36, height: 36, background: primary, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚡</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: navbarBg ? "#111" : "#fff", lineHeight: 1.1 }}>{tenant?.name || "Satyajan"}</div>
                  <div style={{ fontSize: 10, color: primary, fontWeight: 600, letterSpacing: 1 }}>ENERGY SOLUTIONS</div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, fontWeight: 500 }}>
            {["Products", "Categories", "Projects", "Reviews", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color: navbarBg ? "#374151" : "rgba(255,255,255,0.9)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = navbarBg ? "#374151" : "rgba(255,255,255,0.9)")}>
                {item}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: navbarBg ? "#374151" : "#fff", padding: 6, borderRadius: 8 }}>🔍</button>
            {/* Phone */}
            <a href="tel:+918019179159" style={{ display: "flex", alignItems: "center", gap: 6, color: navbarBg ? "#374151" : "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              <span>📞</span> +91 8019179159
            </a>
            {/* Cart */}
            <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: navbarBg ? "#374151" : "#fff", padding: 6 }}>
              🛒
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: 0, right: 0, background: primary, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{cartCount}</span>
              )}
            </button>
            {/* Mobile menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: navbarBg ? "#374151" : "#fff", display: "none" }} className="mobile-menu-btn">☰</button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ background: "#fff", padding: "12px 24px", borderTop: "1px solid #f0f0f0" }}>
            <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
              <input
                autoFocus
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9ca3af" }}>✕</button>
              )}
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ background: "#fff", padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 16 }}>
            {["Products", "Categories", "Projects", "Reviews", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} style={{ color: "#374151", textDecoration: "none", fontWeight: 600, fontSize: 15 }}>{item}</a>
            ))}
            <a href="tel:+918019179159" style={{ color: primary, fontWeight: 700, textDecoration: "none" }}>📞 +91 8019179159</a>
          </div>
        )}
      </nav>

      {/* ── HERO SLIDER ── */}
      <section style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${s.bg})`, backgroundSize: "cover", backgroundPosition: "center",
            opacity: i === heroIdx ? 1 : 0,
            transition: "opacity 0.8s ease",
            zIndex: i === heroIdx ? 1 : 0,
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)" }} />
          </div>
        ))}
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", maxWidth: 1280, margin: "0 auto" }}>
          <div key={heroIdx} className="fade-in">
            <div style={{ display: "inline-block", background: primary, color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 2, padding: "6px 14px", borderRadius: 20, marginBottom: 20, textTransform: "uppercase" }}>
              {slide.eyebrow}
            </div>
            <h1 style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 20, maxWidth: 720, textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
              {slide.headline}
            </h1>
            <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "rgba(255,255,255,0.88)", maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
              {slide.sub}
            </p>
            <div className="hero-btns" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <button className="btn-primary" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "14px 32px", fontSize: 16 }}>
                {slide.cta1} →
              </button>
              <button className="btn-white" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "14px 32px", fontSize: 16 }}>
                {slide.cta2}
              </button>
            </div>
            <div ref={statsRef} className="hero-stats" style={{ display: "flex", gap: 40 }}>
              {[
                { num: `${count1}+`, label: "Happy Customers" },
                { num: `${count2}+`, label: "Years Experience" },
                { num: `${count3}%`, label: "Bill Savings" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", gap: 8 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} style={{ width: i === heroIdx ? 28 : 8, height: 8, borderRadius: 4, border: "none", background: i === heroIdx ? primary : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>

        {/* Prev/Next */}
        {["←", "→"].map((arrow, ai) => (
          <button key={arrow} onClick={() => setHeroIdx((heroIdx + (ai === 0 ? -1 : 1) + HERO_SLIDES.length) % HERO_SLIDES.length)}
            style={{ position: "absolute", top: "50%", [ai === 0 ? "left" : "right"]: 20, transform: "translateY(-50%)", zIndex: 3, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", width: 44, height: 44, borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}>
            {arrow}
          </button>
        ))}
      </section>

      {/* ── MARQUEE TRUST STRIP ── */}
      <div style={{ background: primary, padding: "12px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", overflow: "hidden" }}>
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} style={{ color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 8 }}>
                <span>⚡</span> {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── ABOUT SECTION ── */}
      <section style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: primary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>About Us</div>
            <h2 style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>About Satyajan Energy Solutions</h2>
            <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.8, marginBottom: 20 }}>
              Satyajan Energy Solutions is an authorized channel partner providing reliable power backup and solar solutions. We offer a wide range of inverters, batteries, UPS systems, and solar solutions to ensure uninterrupted power for homes and businesses.
            </p>
            <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.8, marginBottom: 32 }}>
              With years of experience and a commitment to quality, we deliver energy-efficient and future-ready solutions. Our team provides fast delivery, expert installation, and strong after-sales support. Trusted by dealers and customers across the region.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
              {[{ icon: "🎯", title: "Our Mission", desc: "Reliable, sustainable energy solutions for homes and businesses across India." },
                { icon: "👁️", title: "Our Vision", desc: "India's most trusted partner for clean energy and power backup." },
                { icon: "💎", title: "Our Values", desc: "Quality, reliability, customer satisfaction and sustainability." }].map((v) => (
                <div key={v.title} style={{ padding: 16, background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{v.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{v.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{v.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ background: "#f0fdf4", color: "#15803d", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>✓ GST: 36ABGCS0416A1ZX</span>
              <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>✓ Authorized Microtek Partner</span>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=700&q=80" alt="Solar Energy" style={{ width: "100%", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} />
            <div style={{ position: "absolute", bottom: -24, left: -24, background: primary, color: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: 28, fontWeight: 900 }}>1000+</div>
              <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.9 }}>Happy Customers</div>
            </div>
            <div style={{ position: "absolute", top: -16, right: -16, background: "#fff", borderRadius: 12, padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: primary }}>4.9 ★</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>200+ Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ── */}
      <section id="categories" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: primary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Our Products & Services</div>
            <h2 style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, marginBottom: 16 }}>Comprehensive Power Solutions</h2>
            <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 560, margin: "0 auto" }}>Backed by Microtek's quality and our expert local support in Hyderabad.</p>
          </div>
          <div className="categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PRODUCT_CATEGORIES.map((cat) => (
              <div key={cat.name} className="card-hover" style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #f0f0f0", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                  <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
                  <div style={{ position: "absolute", top: 12, left: 12, background: primary, color: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    {cat.icon} {cat.name}
                  </div>
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7, marginBottom: 16 }}>{cat.desc}</p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {cat.features.map((f) => (
                      <li key={f} style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: primary, fontWeight: 700 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-outline" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", marginTop: 20, textAlign: "center" as const }}>
                    View Products →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE PRODUCTS ── */}
      <section id="products" style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: primary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Catalog</div>
              <h2 style={{ fontSize: "clamp(24px,2.5vw,38px)", fontWeight: 800 }}>Our Products</h2>
            </div>
            <div style={{ position: "relative" }}>
              <input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: 260, paddingLeft: 36 }} />
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", color: "#9ca3af" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{searchQuery ? "No products found" : "No products available yet"}</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>{searchQuery ? "Try a different search term" : "Products will appear here once added."}</div>
            </div>
          ) : (
            <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
              {filteredProducts.map((p) => (
                <div key={p.id} className="card-hover product-card" style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "relative" }}>
                  <div style={{ position: "relative", height: 200, background: "#f3f4f6", overflow: "hidden" }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>⚡</div>
                    )}
                    {/* Quick enquiry overlay */}
                    <div className="product-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <button className="btn-primary" onClick={() => openInquiry(p)} style={{ fontSize: 14, padding: "10px 20px" }}>
                        Quick Enquiry
                      </button>
                    </div>
                    {p.category?.name && (
                      <div style={{ position: "absolute", top: 10, left: 10, background: primary, color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                        {p.category.name}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "16px 16px 20px" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{p.name}</h3>
                    {p.description && <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>}
                    {p.price && <div style={{ fontSize: 18, fontWeight: 800, color: primary, marginBottom: 14 }}>₹{p.price.toLocaleString("en-IN")}</div>}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-primary" onClick={() => addToCart(p)} style={{ flex: 1, padding: "9px 12px", fontSize: 13 }}>🛒 Add to Cart</button>
                      <button className="btn-outline" onClick={() => openInquiry(p)} style={{ flex: 1, padding: "9px 12px", fontSize: 13 }}>Enquire</button>
                    </div>
                    <a href={`/products/${p.slug}`} style={{ display: "block", textAlign: "center", marginTop: 10, fontSize: 13, color: primary, textDecoration: "none", fontWeight: 600 }}>View Details →</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: primary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Why Choose Us</div>
            <h2 style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, marginBottom: 16 }}>Why Choose Satyajan Energy?</h2>
            <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 520, margin: "0 auto" }}>Your trusted partner for reliable power solutions with unmatched service quality.</p>
          </div>
          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 64 }}>
            {WHY_CARDS.map((card) => (
              <div key={card.title} className="card-hover" style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0" }}>
                <div style={{ width: 64, height: 64, background: `${card.color}18`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#111" }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>More Than Just a Product — We're Your Energy Partner</h3>
            <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 32, fontSize: 15 }}>We go beyond selling. From recommendation to installation and warranty support — we're with you every step.</p>
            <div style={{ overflowX: "auto", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <table className="comparison-table" style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Feature", "⚡ Satyajan Energy", "🛒 Online Platforms", "🏪 Local Sellers"].map((h, i) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: i === 0 ? "left" : "center", fontSize: 14, fontWeight: 700, color: i === 1 ? primary : "#374151", borderBottom: "2px solid #e5e7eb" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={row.feature} style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <td style={{ padding: "12px 20px", fontSize: 14, color: "#374151", fontWeight: 500 }}>{row.feature}</td>
                      {[row.satyajan, row.online, row.local].map((val, vi) => (
                        <td key={vi} style={{ padding: "12px 20px", textAlign: "center", fontSize: 13 }}>
                          {val === true ? <span className="comparison-check">✓</span> :
                            val === false ? <span className="comparison-x">✗</span> :
                              <span style={{ color: vi === 0 ? primary : "#9ca3af", fontWeight: vi === 0 ? 600 : 400 }}>{val}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
              <a href="https://wa.me/918019179159?text=Hi, I want expert guidance before buying" target="_blank" rel="noreferrer">
                <button className="btn-primary" style={{ padding: "13px 28px" }}>Get Expert Advice — Free 💬</button>
              </a>
              <button className="btn-outline" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "13px 28px" }}>Browse Products</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA POWER BACKUP ── */}
      <section style={{ background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, ${primary}22 100%)`, padding: "72px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, background: `${primary}15`, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, background: `${primary}10`, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: primary, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Power Backup Solutions</div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 900, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Power Backup Solutions You Can Trust
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", marginBottom: 36, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 36px" }}>
            From homes to hospitals, we deliver uninterrupted power. Expert installation, genuine products, after-sales support — all under one roof.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => openInquiry(null as any)} style={{ padding: "14px 32px", fontSize: 16 }}>Get Free Quote</button>
            <a href="https://wa.me/918019179159" target="_blank" rel="noreferrer">
              <button style={{ background: "#25d366", color: "#fff", border: "none", borderRadius: 8, padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "filter 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}>
                💬 WhatsApp Us
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── OUR PROJECTS ── */}
      <section id="projects" style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: primary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Our Work</div>
            <h2 style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, marginBottom: 16 }}>Our Projects</h2>
            <p style={{ fontSize: 16, color: "#6b7280" }}>Delivering Reliable Power Backup & Energy Solutions Across India</p>
          </div>
          <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PROJECTS.map((proj) => (
              <div key={proj.title} className="card-hover" style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0" }}>
                <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
                  <img src={proj.img} alt={proj.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 10, left: 10, background: primary, color: "#fff", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{proj.category}</div>
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>📍 {proj.location}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{proj.title}</h3>
                  <div style={{ display: "inline-block", background: `${primary}15`, color: primary, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{proj.spec}</div>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{proj.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <a href="https://wa.me/918019179159?text=Hi! I'd like to discuss a power backup project." target="_blank" rel="noreferrer">
              <button className="btn-primary" style={{ padding: "13px 32px" }}>Discuss Your Project — Free Consultation</button>
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: primary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Reviews</div>
            <h2 style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, marginBottom: 8 }}>What Our Clients Say</h2>
            <p style={{ fontSize: 16, color: "#6b7280" }}>Real reviews from verified customers on Google & IndiaMART.</p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 36 }}>
            {(["google", "indiamart"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTestimonialTab(tab)}
                style={{ padding: "10px 28px", borderRadius: 30, border: "2px solid", borderColor: activeTestimonialTab === tab ? primary : "#e5e7eb", background: activeTestimonialTab === tab ? primary : "#fff", color: activeTestimonialTab === tab ? "#fff" : "#6b7280", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize" }}>
                {tab === "google" ? "🔍 Google" : "🏭 IndiaMART"} ({tab === "google" ? TESTIMONIALS_GOOGLE.length : TESTIMONIALS_INDIAMART.length})
              </button>
            ))}
          </div>

          <div className="reviews-scroll">
            {(activeTestimonialTab === "google" ? TESTIMONIALS_GOOGLE : TESTIMONIALS_INDIAMART).map((t, i) => (
              <div key={i} className="testimonial-card" style={{ minWidth: 300 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <StarRating />
                  <SourceBadge source={t.source} />
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{t.location} · {t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 32 }}>
            <a href="https://share.google/xEUrHKGcodkwsSfRF" target="_blank" rel="noreferrer">
              <button className="btn-outline" style={{ padding: "10px 24px", fontSize: 14 }}>View all Google Reviews →</button>
            </a>
            <a href="https://www.indiamart.com/satyajanenergysolutions/" target="_blank" rel="noreferrer">
              <button style={{ padding: "10px 24px", fontSize: 14, background: "#fff5eb", color: "#e8732a", border: "2px solid #e8732a", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>View all IndiaMART Reviews →</button>
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section id="contact" style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: primary, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Contact</div>
            <h2 style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, marginBottom: 12 }}>Get In Touch</h2>
            <p style={{ fontSize: 16, color: "#6b7280" }}>Have questions? We're here to help. Contact us for a free consultation.</p>
          </div>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            {/* Left: info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "📞", label: "Phone", value: "+91 8019179159", href: "tel:+918019179159", color: "#3b82f6" },
                { icon: "📧", label: "Email", value: "info@satyajan.com", href: "mailto:info@satyajan.com", color: "#10b981" },
                { icon: "📍", label: "Address", value: "Plot No. 47, Green Lands Colony, Karmanghat, LB Nagar, Hyderabad 500079", href: "https://maps.app.goo.gl/vtyTimUrenngkoHn9", color: "#f59e0b" },
              ].map((item) => (
                <a key={item.label} href={item.href} target={item.label === "Address" ? "_blank" : undefined} rel="noreferrer" style={{ textDecoration: "none" }}>
                  <div className="card-hover" style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
                    <div style={{ width: 48, height: 48, background: `${item.color}18`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{item.value}</div>
                    </div>
                  </div>
                </a>
              ))}
              <a href="https://wa.me/918019179159" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <button style={{ width: "100%", background: "#25d366", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "filter 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}>
                  💬 WhatsApp Now
                </button>
              </a>
              {/* Google Maps embed */}
              <div style={{ borderRadius: 12, overflow: "hidden", height: 180 }}>
                <iframe
                  title="Satyajan Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.5387496!3d17.3342621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c0c3e1ffe7:0xa6b7d4b850493ba0!2sSatyajan%20Energy%20Solutions%20Pvt.Ltd.!5e0!3m2!1sen!2sin!4v1234567890123"
                  width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                />
              </div>
            </div>

            {/* Right: form */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #f0f0f0" }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Send Us a Message</h3>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>We'll get back to you within 24 hours.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label>Name *</label>
                  <input placeholder="Your full name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                </div>
                <div>
                  <label>Email *</label>
                  <input type="email" placeholder="your.email@example.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                </div>
                <div>
                  <label>Phone *</label>
                  <div style={{ position: "relative" }}>
                    <input placeholder="10-digit mobile number" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} style={{ paddingLeft: 50 }} />
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 600, color: "#6b7280" }}>+91</span>
                  </div>
                </div>
                <div>
                  <label>Message *</label>
                  <textarea rows={4} placeholder="Tell us about your requirements (min 10 characters)" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} style={{ resize: "vertical" }} />
                </div>
                {contactStatus === "sent" ? (
                  <div style={{ background: "#f0fdf4", color: "#15803d", padding: "14px 18px", borderRadius: 8, fontWeight: 600, textAlign: "center" }}>
                    ✅ Message sent! We'll respond within 24 hours.
                  </div>
                ) : (
                  <button className="btn-primary" onClick={submitContact} disabled={contactStatus === "sending"} style={{ padding: "14px", fontSize: 16, width: "100%", opacity: contactStatus === "sending" ? 0.7 : 1 }}>
                    {contactStatus === "sending" ? "Sending..." : "Send Message →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── READY TO SWITCH CTA ── */}
      <section style={{ background: `linear-gradient(135deg, ${primary} 0%, #059669 100%)`, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px,3vw,44px)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>Ready to Switch to Clean Energy?</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.88)", marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
          Join over 1000+ happy customers who have already made the switch with Satyajan Energy Solutions.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-white" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "14px 32px", fontSize: 16 }}>Explore Products</button>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "#fff", border: "2px solid #fff", borderRadius: 8, padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            Contact Us Today
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0f172a", color: "#cbd5e1", padding: "56px 24px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: primary, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Satyajan</div>
                  <div style={{ fontSize: 10, color: primary, fontWeight: 600, letterSpacing: 1 }}>ENERGY SOLUTIONS</div>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 16, maxWidth: 280 }}>
                Your trusted partner for solar solutions, power backup systems, and battery management across India.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1e293b", padding: "6px 12px", borderRadius: 20, fontSize: 12, marginBottom: 20 }}>
                <span style={{ color: primary }}>●</span> GST: 36ABGCS0416A1ZX
              </div>
              {/* Social */}
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { icon: "📷", href: "https://www.instagram.com/satyajan.solutions/", label: "Instagram" },
                  { icon: "👔", href: "https://www.linkedin.com/company/satyajan-energy-solutions-pvt-ltd/", label: "LinkedIn" },
                  { icon: "👍", href: "https://www.facebook.com/profile.php?id=61577768371371", label: "Facebook" },
                  { icon: "⭐", href: "https://share.google/UqkYvc7zrN2PjQBi8", label: "Google" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                    style={{ width: 36, height: 36, background: "#1e293b", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 16, transition: "background 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#1e293b")}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Quick Links</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Home", "Products", "Services", "Technology", "Blogs", "Careers", "Contact Us", "Terms & Conditions"].map((link) => (
                  <li key={link}>
                    <a href="#" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Products */}
            <div>
              <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Our Products</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Solar Solutions", "Inverter / Home UPS", "Jumbo UPS", "Online UPS", "Tubular Battery", "Lithium Batteries", "Combos"].map((p) => (
                  <li key={p}>
                    <a href="#categories" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}>
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Services */}
            <div>
              <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Our Services</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {["Solar Energy", "Power Backup & UPS", "Battery Services", "Technical Support & After-Sales"].map((s) => (
                  <li key={s}>
                    <a href="#" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}>
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
              <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Contact Us</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="tel:+918019179159" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none" }}>📞 +91 8019179159</a>
                <a href="mailto:info@satyajan.com" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none" }}>📧 info@satyajan.com</a>
                <span style={{ color: "#94a3b8", fontSize: 14 }}>📍 Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ fontSize: 13, color: "#64748b" }}>© 2025 Satyajan Energy Solutions Pvt Ltd. All rights reserved.</div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Terms of Service", "Privacy Policy", "Cancellation & Refund", "Contact Us"].map((link) => (
                <a key={link} href="#" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ── */}
      <a href="https://wa.me/918019179159?text=Hi! I have a query about your products." target="_blank" rel="noreferrer"
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, width: 56, height: 56, background: "#25d366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 4px 20px rgba(37,211,102,0.4)", textDecoration: "none", transition: "transform 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
        💬
      </a>

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 400, maxWidth: "100vw", background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }} className="slide-up">
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>🛒 Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#9ca3af" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Your cart is empty</div>
                  <div style={{ fontSize: 14, marginTop: 6 }}>Add products to get started</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: "flex", gap: 14, padding: "14px", background: "#f8fafc", borderRadius: 10 }}>
                      <div style={{ width: 64, height: 64, background: "#e5e7eb", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                        {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⚡</div>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                        {item.price && <div style={{ fontSize: 14, fontWeight: 700, color: primary, marginBottom: 8 }}>₹{item.price.toLocaleString("en-IN")}</div>}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <span style={{ fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                          <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 16 }}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontWeight: 700, fontSize: 16 }}>
                  <span>Total Items:</span><span>{cartCount}</span>
                </div>
                <button className="btn-primary" onClick={() => { setCartOpen(false); openInquiry(null as any); }} style={{ width: "100%", padding: "14px", fontSize: 16, marginBottom: 10 }}>
                  Request Quote →
                </button>
                <button onClick={() => setCart([])} style={{ width: "100%", padding: "10px", fontSize: 14, background: "none", border: "1.5px solid #e5e7eb", borderRadius: 8, cursor: "pointer", color: "#6b7280", fontWeight: 600 }}>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── INQUIRY MODAL ── */}
      {inquiryOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={() => setInquiryOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 540, background: "#fff", borderRadius: "20px 20px 0 0", padding: "28px 28px 36px", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }} className="slide-up">
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 24px" }} />
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
              {selectedProduct ? `Enquire: ${selectedProduct.name}` : "Quick Enquiry"}
            </h3>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>We'll call you back within 2 hours.</p>
            {inquiryStatus === "sent" ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#15803d" }}>Enquiry Sent!</div>
                <div style={{ fontSize: 14, color: "#6b7280", marginTop: 6 }}>Our team will contact you within 2 hours.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label>Name *</label>
                    <input placeholder="Your name" value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label>Phone *</label>
                    <input placeholder="+91 XXXXXXXXXX" value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label>Email</label>
                    <input type="email" placeholder="your@email.com" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label>Quantity</label>
                    <input type="number" min="1" value={inquiryForm.quantity} onChange={(e) => setInquiryForm({ ...inquiryForm, quantity: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label>Message</label>
                  <textarea rows={3} placeholder="Tell us your requirements..." value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} style={{ resize: "none" }} />
                </div>
                {inquiryStatus === "error" && <div style={{ color: "#ef4444", fontSize: 13 }}>Something went wrong. Please try again.</div>}
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-primary" onClick={submitInquiry} disabled={inquiryStatus === "sending"} style={{ flex: 1, padding: "13px", opacity: inquiryStatus === "sending" ? 0.7 : 1 }}>
                    {inquiryStatus === "sending" ? "Sending..." : "Send Enquiry →"}
                  </button>
                  <button onClick={() => setInquiryOpen(false)} style={{ padding: "13px 20px", background: "none", border: "1.5px solid #e5e7eb", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600, color: "#6b7280" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}