"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string; name: string; slug: string;
  description?: string; price?: number; images?: string[];
  specifications?: Record<string, string>;
  category?: { name: string };
}
interface Tenant { id: string; name: string; slug: string; primaryColor?: string; logo?: string; }
interface CartItem extends Product { qty: number; }
interface ClientPageProps { tenant: Tenant; products: Product[]; }

// ─── Constants ────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  { bg: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80", eyebrow: "Secunderabad's Trusted Battery Shop", headline: "Reliable Inverter & Battery Solutions for Your Home", sub: "Get the right battery for your inverter — expert advice, genuine products, fast installation. Serving Secunderabad & Hyderabad.", cta1: "Explore Products", cta2: "Call Us Now" },
  { bg: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=80", eyebrow: "Never Face a Powercut Again", headline: "Quality Inverter Batteries at Wholesale Prices", sub: "From 80Ah flat plate to 220Ah tall tubular — all leading brands available. Expert staff guides you to the right choice every time.", cta1: "View Batteries", cta2: "Get Expert Advice" },
  { bg: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1600&q=80", eyebrow: "Tubular & Lithium Batteries", headline: "Long-Lasting Backup You Can Count On", sub: "Tubular batteries with 36–60 month warranty. Compatible with all inverter brands. Convenient location in Annojiguda, Secunderabad.", cta1: "Shop Batteries", cta2: "Talk to Expert" },
  { bg: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1600&q=80", eyebrow: "Expert Battery Service", headline: "Trusted by Homes & Businesses in Secunderabad", sub: "From Annojiguda to all of Hyderabad — your one-stop shop for inverters, batteries, UPS systems and expert service.", cta1: "Our Products", cta2: "Get Directions" },
];

const MARQUEE_ITEMS = ["Tubular Battery Sales","Battery Replacement","Inverter Setup & Repair","Free Expert Guidance","⚡ Same Day Installation","Cash & UPI Accepted","Parking Available","Battery Testing Free","All Leading Brands","Lithium Battery Upgrade","Online UPS Solutions","Warranty Support","⚡ Delivery Within 24 Hours","⚡ Warranty Registration Included"];

const WHY_CARDS = [
  { icon: "📍", title: "Prime Location", desc: "Annojiguda, Secunderabad — easy access from all parts of the city.", color: "#10b981" },
  { icon: "🧑‍🔧", title: "Expert Staff", desc: "Knowledgeable team committed to giving you the best guidance for your power needs.", color: "#3b82f6" },
  { icon: "⚡", title: "Same-Day Installation", desc: "Battery installed on the same day you order — no waiting, no hassle.", color: "#f59e0b" },
  { icon: "💰", title: "Best Price Guarantee", desc: "Wholesale and competitive pricing. Cash & UPI accepted. Bulk discounts available.", color: "#8b5cf6" },
  { icon: "🅿️", title: "Parking Available", desc: "Convenient parking space for all customers visiting our store.", color: "#ef4444" },
  { icon: "🔧", title: "Free Installation", desc: "Complimentary battery installation with every purchase. Warranty registration included.", color: "#06b6d4" },
];

const COMPARISON_ROWS = [
  { feature: "Product Availability", us: true, online: true, local: true },
  { feature: "Expert Guidance", us: "Experienced Team", online: "Limited", local: "Depends" },
  { feature: "Same-Day Installation", us: true, online: false, local: "Depends" },
  { feature: "Warranty Registration", us: true, online: false, local: false },
  { feature: "After-Sales Service", us: true, online: "Limited", local: "Limited" },
  { feature: "Battery Health Check", us: "Free", online: false, local: "Charged" },
  { feature: "Warranty Claim Help", us: true, online: false, local: false },
  { feature: "Call/WhatsApp Support", us: true, online: false, local: "Limited" },
];

const TESTIMONIALS = [
  { name: "Mallikarjun M", loc: "Secunderabad", meta: "32 reviews", text: "Very reliable and responsive service, from inspection to installation done in matter of hours. Pricing is reasonable.", source: "Google", av: "M", color: "#3b82f6" },
  { name: "Akshay C.", loc: "Hyderabad", meta: "4 reviews", text: "Purchased battery — very good service, installation done by them same day. Highly recommend!", source: "Google", av: "A", color: "#10b981" },
  { name: "Karthik S.", loc: "Secunderabad", meta: "2 reviews", text: "Purchased inverter 3 years back, it's working great and after sales service is very good.", source: "Google", av: "K", color: "#f59e0b" },
  { name: "Akhil R.", loc: "Hyderabad", meta: "Verified Buyer", text: "Always provided us with the lowest prices and the best quality. Friendly and helpful staff.", source: "IndiaMART", av: "A", color: "#8b5cf6" },
  { name: "Venkatesh", loc: "Hyderabad", meta: "Battery · Verified Buyer", text: "Bought inverter battery — response, quality and delivery all excellent.", source: "IndiaMART", av: "V", color: "#ef4444" },
];

const PROJECTS = [
  { title: "Home Inverter + Tall Tubular Battery", loc: "Annojiguda, Secunderabad", spec: "1250VA / 150Ah", cat: "Home Inverter", desc: "6+ hours backup for fans, lights, TV and essential appliances.", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80" },
  { title: "Office UPS + SMF Battery Bank", loc: "Secunderabad", spec: "5kVA / 150Ah x4", cat: "Online UPS", desc: "Online UPS with 4-battery SMF bank for zero-downtime commercial power backup.", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { title: "Flat Plate Battery Replacement", loc: "Hyderabad", spec: "150Ah / 24-month", cat: "Battery Replacement", desc: "Same-day battery replacement — old battery tested, new one installed and inverter checked.", img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80" },
  { title: "Tall Tubular Upgrade", loc: "Secunderabad", spec: "1250VA / 180Ah", cat: "Battery Upgrade", desc: "Upgraded from flat plate to tall tubular — backup time increased from 3 to 7+ hours.", img: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80" },
  { title: "School Classroom Backup", loc: "Secunderabad", spec: "900VA / 150Ah", cat: "Educational", desc: "Inverter + tall tubular battery for classroom — fans, lights, smart board uninterrupted.", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
  { title: "Lithium Battery Upgrade", loc: "Hyderabad", spec: "1100VA / 100Ah LFP", cat: "Lithium Battery", desc: "Upgraded to Lithium-Ion — 3500+ cycles, maintenance-free, 5× faster charging.", img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80" },
];

const PRODUCT_CATEGORIES_STATIC = [
  { name: "Tubular Batteries", icon: "🔋", desc: "Long-lasting tubular inverter batteries 80Ah–220Ah. 36–60 month warranty.", features: ["36–60 month warranty","80Ah to 220Ah","All inverter compatible"], mrp: "₹8,500", price: "₹7,200", warranty: "48 months", backup: "5–8 hours", suitable: "Medium to large homes", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80", stock: true },
  { name: "Flat Plate Batteries", icon: "⚡", desc: "Budget-friendly flat plate batteries for light backup needs.", features: ["Budget-friendly","Low maintenance","Compact & lightweight"], mrp: "₹6,000", price: "₹5,200", warranty: "24 months", backup: "3–4 hours", suitable: "Small homes & apartments", img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80", stock: true },
  { name: "Inverter / Home UPS", icon: "🏠", desc: "Pure sine wave inverters 700VA to 2000VA with intelligent battery management.", features: ["Pure sine wave","700VA–2000VA","Smart charging"], mrp: "₹5,500", price: "₹4,800", warranty: "24 months", backup: "Depends on battery", suitable: "All homes", img: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80", stock: true },
  { name: "Lithium Batteries", icon: "🌱", desc: "Advanced lithium-ion with 10+ year lifespan, 3000+ charge cycles, maintenance-free.", features: ["10+ years lifespan","3000+ cycles","Built-in BMS"], mrp: "₹18,000", price: "₹15,500", warranty: "60 months", backup: "6–10 hours", suitable: "Tech-savvy homes & offices", img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80", stock: true },
  { name: "Online UPS", icon: "🖥️", desc: "For offices, shops and businesses requiring zero transfer time.", features: ["Zero transfer time","For offices & shops","Wide range"], mrp: "₹12,000", price: "₹10,500", warranty: "12 months", backup: "2–4 hours", suitable: "Offices, shops, data centers", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", stock: true },
  { name: "Battery Service & Repair", icon: "🔧", desc: "Professional battery testing, servicing, water topping, and repair.", features: ["Expert diagnosis","Quick turnaround","Genuine parts"], mrp: "₹500", price: "₹350", warranty: "Service warranty", backup: "—", suitable: "Existing battery owners", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80", stock: true },
];

const RECOMMENDATION_MATRIX = [
  { req: "Small Apartment (1–2 rooms)", product: "900VA Inverter + 150Ah Flat Plate", price: "~₹10,000", backup: "3–4 hrs" },
  { req: "Medium Home (3 BHK)", product: "1100VA Inverter + 150Ah Tubular", price: "~₹13,000", backup: "5–6 hrs" },
  { req: "Large Home / Villa", product: "1500VA Inverter + 220Ah Tubular", price: "~₹18,000", backup: "7–9 hrs" },
  { req: "Small Office / Shop", product: "2KVA Online UPS + SMF Battery", price: "~₹22,000", backup: "4–6 hrs" },
  { req: "Long Backup Needed", product: "1250VA Inverter + 180Ah Tubular", price: "~₹16,000", backup: "8–10 hrs" },
  { req: "Maintenance-Free", product: "1100VA Inverter + 100Ah Lithium", price: "~₹22,000", backup: "6–8 hrs" },
];

const APPLIANCE_WATTS: Record<string, number> = { fan: 75, tv: 100, fridge: 150, light: 15, ac: 1500, computer: 200, router: 20 };

const FAQS = [
  { q: "Which battery should I buy for my home?", a: "For a medium home (2–3 rooms), a 150Ah tall tubular battery with a 1100VA inverter is ideal. It gives 5–6 hours backup for fans, lights and TV. Visit our store for a free load assessment." },
  { q: "How much backup time will I get?", a: "Backup depends on your load. A 150Ah battery with 300W load gives ~4 hours. Use our Battery Calculator above for a precise estimate based on your appliances." },
  { q: "What are the installation charges?", a: "Installation is FREE with every battery or inverter purchase from our store. Our technician will visit your home and complete the setup." },
  { q: "How does the warranty claim process work?", a: "Bring the battery to our store or call us. We inspect it, raise a claim with the manufacturer, and you get a replacement within 7–10 working days. We handle all paperwork for you." },
  { q: "How fast is delivery?", a: "We offer same-day delivery and installation within Secunderabad, ECIL, Kapra, Sainikpuri, and surrounding areas. Call us before 12 PM for guaranteed same-day service." },
  { q: "Do you sell genuine products?", a: "Yes, 100%. We are an authorized dealer for all major brands including Microtek, Exide, Livguard, Luminous, and Amaron. All products come with original manufacturer warranty." },
  { q: "Can I trade in my old battery?", a: "Yes! We accept old batteries and offer exchange discounts. Bring your old battery when purchasing a new one for the best deal." },
  { q: "What's the difference between flat plate and tubular batteries?", a: "Flat plate batteries are cheaper but last 3–4 years. Tubular batteries cost more but last 5–7 years with better performance. For regular use, tubular is always the better investment." },
];

const SERVICE_AREAS = ["Secunderabad", "Annojiguda", "ECIL", "Kapra", "Sainikpuri", "Malkajgiri", "AS Rao Nagar", "Uppal", "Kushaiguda", "Nacharam", "Habsiguda", "Tarnaka", "Bowenpally", "Trimulgherry"];

const WARRANTY_INFO = [
  { icon: "✅", title: "What's Covered", items: ["Manufacturing defects", "Premature capacity loss", "Plate failures", "Terminal issues"] },
  { icon: "❌", title: "What's Not Covered", items: ["Physical damage", "Water contamination", "Overcharging damage", "Misuse or neglect"] },
  { icon: "📋", title: "Claim Process", items: ["Call us or visit store", "We inspect the battery", "Manufacturer claim raised", "Replacement in 7–10 days"] },
];

const MISTAKES_CONTENT = [
  { title: "Buying the Cheapest Battery", desc: "Cheap batteries use thin plates that wear out in 1–2 years. A quality 150Ah tubular battery lasts 6+ years — saving you money long-term." },
  { title: "Wrong Capacity for Your Load", desc: "Undersized battery = poor backup. Always calculate your total load (watts) before buying. Our free load calculator above helps you get it right." },
  { title: "Ignoring Installation Quality", desc: "Poor wiring and connections reduce battery life by 30%. Always get professional installation — we do it free with every purchase." },
  { title: "Not Registering Warranty", desc: "Many customers forget to register their warranty. We handle registration for you at the time of installation — zero hassle." },
  { title: "Skipping Battery Maintenance", desc: "Tubular batteries need distilled water top-ups every 2–3 months. Ignoring this kills the battery. We offer free maintenance checks." },
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientPage({ tenant, products }: ClientPageProps) {
  const primary = tenant?.primaryColor || "#f97316";
  const scrollY = useScrollY();

  // State
  const [heroIdx, setHeroIdx] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", phone: "", email: "", quantity: "1", message: "" });
  const [inquiryStatus, setInquiryStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");
  const [statsVisible, setStatsVisible] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  // New feature states
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "", time: "15 mins" });
  const [callbackStatus, setCallbackStatus] = useState<"idle"|"sending"|"sent">("idle");
  const [exitPopupShown, setExitPopupShown] = useState(false);
  const [exitPopupOpen, setExitPopupOpen] = useState(false);
  const [exitPhone, setExitPhone] = useState("");
  const [exitStatus, setExitStatus] = useState<"idle"|"sent">("idle");
  const [leadCaptureOpen, setLeadCaptureOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "" });
  const [leadStatus, setLeadStatus] = useState<"idle"|"sent">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonialTab, setActiveTestimonialTab] = useState<"google"|"indiamart">("google");
  const [activeCatTab, setActiveCatTab] = useState(0);

  // Battery calculator state
  const [calc, setCalc] = useState({ fans: 2, tv: 1, fridge: 0, lights: 4, ac: 0, computer: 0, hours: 6 });
  const [calcResult, setCalcResult] = useState<{ battery: string; backup: string; price: string; inverter: string } | null>(null);

  const runCalculator = () => {
    const totalWatts =
      calc.fans * APPLIANCE_WATTS.fan +
      calc.tv * APPLIANCE_WATTS.tv +
      calc.fridge * APPLIANCE_WATTS.fridge +
      calc.lights * APPLIANCE_WATTS.light +
      calc.ac * APPLIANCE_WATTS.ac +
      calc.computer * APPLIANCE_WATTS.computer;
    const whNeeded = totalWatts * calc.hours * 1.25; // 25% buffer
    const ah = Math.ceil(whNeeded / 12 / 0.8); // 12V system, 80% DoD
    let battery = "", price = "", inverter = "";
    if (ah <= 100) { battery = "100Ah Flat Plate Battery"; price = "~₹5,200"; inverter = "900VA Inverter"; }
    else if (ah <= 150) { battery = "150Ah Tall Tubular Battery"; price = "~₹7,200"; inverter = "1100VA Inverter"; }
    else if (ah <= 180) { battery = "180Ah Tall Tubular Battery"; price = "~₹9,000"; inverter = "1250VA Inverter"; }
    else { battery = "220Ah Tall Tubular Battery"; price = "~₹11,500"; inverter = "1500VA Inverter"; }
    const estBackup = Math.round((ah * 12 * 0.8) / totalWatts * 10) / 10;
    setCalcResult({ battery, backup: `~${estBackup} hours`, price, inverter });
  };

  // Hero auto-rotate
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  // Stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!statsVisible) return;
    const animate = (setter: (n: number) => void, target: number) => {
      const step = target / 80;
      let cur = 0;
      const t = setInterval(() => { cur += step; if (cur >= target) { setter(target); clearInterval(t); } else setter(Math.floor(cur)); }, 25);
    };
    animate(setCount1, 500); animate(setCount2, 10); animate(setCount3, 90);
  }, [statsVisible]);

  // Lead capture popup after 8 seconds
  useEffect(() => {
    const t = setTimeout(() => setLeadCaptureOpen(true), 8000);
    return () => clearTimeout(t);
  }, []);

  // Exit intent
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY < 10 && !exitPopupShown) { setExitPopupShown(true); setExitPopupOpen(true); }
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [exitPopupShown]);

  // Cart persistence
  useEffect(() => {
    try { const s = localStorage.getItem(`cart_${tenant?.slug}`); if (s) setCart(JSON.parse(s)); } catch {}
  }, [tenant?.slug]);
  useEffect(() => {
    try { localStorage.setItem(`cart_${tenant?.slug}`, JSON.stringify(cart)); } catch {}
  }, [cart, tenant?.slug]);

  const addToCart = useCallback((p: Product) => {
    setCart(prev => {
      const ex = prev.find(x => x.id === p.id);
      if (ex) return prev.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...p, qty: 1 }];
    });
  }, []);
  const removeFromCart = useCallback((id: string) => setCart(prev => prev.filter(x => x.id !== id)), []);
  const updateQty = useCallback((id: string, d: number) => {
    setCart(prev => prev.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x).filter(x => x.qty > 0));
  }, []);
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const filteredProducts = products?.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const openInquiry = (p: any) => { setSelectedProduct(p); setInquiryOpen(true); };

  const submitInquiry = async () => {
    if (!inquiryForm.name || !inquiryForm.phone) return;
    setInquiryStatus("sending");
    try {
      const res = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...inquiryForm, tenantId: tenant?.id, productId: selectedProduct?.id, message: `Product: ${selectedProduct?.name || "General"}\nQty: ${inquiryForm.quantity}\n${inquiryForm.message}` }) });
      if (res.ok) { setInquiryStatus("sent"); setTimeout(() => { setInquiryOpen(false); setInquiryStatus("idle"); setInquiryForm({ name:"", phone:"", email:"", quantity:"1", message:"" }); }, 2500); }
      else setInquiryStatus("error");
    } catch { setInquiryStatus("error"); }
  };

  const submitContact = async () => {
    if (!contactForm.name || !contactForm.phone) return;
    setContactStatus("sending");
    try {
      const res = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...contactForm, tenantId: tenant?.id }) });
      if (res.ok) { setContactStatus("sent"); setTimeout(() => { setContactStatus("idle"); setContactForm({ name:"", email:"", phone:"", message:"" }); }, 3000); }
      else setContactStatus("error");
    } catch { setContactStatus("error"); }
  };

  const submitCallback = async () => {
    if (!callbackForm.name || !callbackForm.phone) return;
    setCallbackStatus("sending");
    try {
      await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: callbackForm.name, phone: callbackForm.phone, message: `Callback requested in: ${callbackForm.time}`, tenantId: tenant?.id }) });
      setCallbackStatus("sent");
      setTimeout(() => { setCallbackOpen(false); setCallbackStatus("idle"); setCallbackForm({ name:"", phone:"", time:"15 mins" }); }, 2500);
    } catch { setCallbackStatus("sent"); }
  };

  const submitLead = async () => {
    if (!leadForm.name || !leadForm.phone) return;
    try { await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: leadForm.name, phone: leadForm.phone, message: "Website lead capture", tenantId: tenant?.id }) }); } catch {}
    setLeadStatus("sent");
    setTimeout(() => setLeadCaptureOpen(false), 2000);
  };

  const navbarBg = scrollY > 80;
  const slide = HERO_SLIDES[heroIdx];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", background: "#fff", color: "#111", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        .fade-in{animation:fadeIn 0.6s ease forwards}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .slide-up{animation:slideUp 0.4s ease forwards}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
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
        .marquee-track{display:flex;gap:40px;animation:marquee 35s linear infinite;white-space:nowrap}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .reviews-scroll{display:flex;gap:20px;overflow-x:auto;padding-bottom:8px;scrollbar-width:thin;scroll-snap-type:x mandatory}
        .reviews-scroll::-webkit-scrollbar{height:4px}
        .reviews-scroll::-webkit-scrollbar-thumb{background:${primary};border-radius:10px}
        .reviews-scroll>*{scroll-snap-align:start;flex:0 0 300px}
        input,textarea,select{width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;transition:border-color 0.2s;font-family:inherit;background:#fff}
        input:focus,textarea:focus,select:focus{border-color:${primary}}
        label{font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px}
        .calc-input{display:flex;align-items:center;gap:12px;background:#f8fafc;border-radius:10px;padding:14px 16px}
        .qty-btn{width:32px;height:32px;border-radius:6px;border:2px solid ${primary};background:#fff;color:${primary};font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .urgency-badge{background:${primary}15;color:${primary};border:1px solid ${primary}40;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:6px}
        .faq-item{border-bottom:1px solid #f0f0f0;padding:16px 0}
        /* Sticky CTA — sits at bottom, above safe area */
        .sticky-cta{position:fixed;bottom:0;left:0;right:0;z-index:900;background:#fff;border-top:2px solid #f0f0f0;padding:8px 8px;padding-bottom:max(8px,env(safe-area-inset-bottom));display:flex;gap:6px;justify-content:center}
        .sticky-cta button{font-size:12px!important;padding:10px 6px!important;border-radius:8px}
        /* Floating buttons sit ABOVE sticky CTA */
        .float-wa{position:fixed;bottom:72px;right:16px;z-index:800}
        .float-cb{position:fixed;bottom:130px;right:16px;z-index:800}
        .desktop-nav{display:flex}
        .desktop-phone{display:flex}
        .mobile-menu-btn{display:none!important}
        /* ── Tablet ── */
        @media(max-width:900px){
          .desktop-nav{display:none!important}
          .desktop-phone{display:none!important}
          .mobile-menu-btn{display:flex!important}
          .why-grid{grid-template-columns:1fr 1fr!important}
          .products-grid{grid-template-columns:1fr 1fr!important}
          .footer-grid{grid-template-columns:1fr 1fr!important}
          .projects-grid{grid-template-columns:1fr 1fr!important}
          .categories-grid{grid-template-columns:1fr 1fr!important}
          .contact-grid{grid-template-columns:1fr!important}
          .about-grid{grid-template-columns:1fr!important}
          .matrix-grid{grid-template-columns:1fr!important}
          .warranty-grid{grid-template-columns:1fr!important}
          .mistakes-grid{grid-template-columns:1fr!important}
        }
        /* ── Mobile ── */
        @media(max-width:600px){
          .desktop-nav{display:none!important}
          .desktop-phone{display:none!important}
          .mobile-menu-btn{display:flex!important}
          .why-grid{grid-template-columns:1fr 1fr!important}
          .products-grid{grid-template-columns:1fr 1fr!important}
          .footer-grid{grid-template-columns:1fr 1fr!important}
          .projects-grid{grid-template-columns:1fr!important}
          .about-grid{grid-template-columns:1fr!important}
          .warranty-grid{grid-template-columns:1fr!important}
          .mistakes-grid{grid-template-columns:1fr!important}
          /* Hero */
          .hero-btns{flex-direction:column!important;width:100%}
          .hero-btns button,.hero-btns a{width:100%!important}
          .hero-stats{gap:16px!important;flex-wrap:nowrap!important}
          .hero-stat-num{font-size:20px!important}
          .hero-stat-label{font-size:10px!important}
          .urgency-row{flex-direction:column!important;gap:6px!important}
          /* About */
          .about-image{display:none!important}
          /* Nav logo */
          .nav-logo-text{font-size:12px!important;max-width:140px!important}
          .nav-logo-sub{display:none!important}
          /* Floating buttons — smaller on mobile */
          .float-wa{bottom:68px;right:12px}
          .float-wa button,.float-wa a>div{width:46px!important;height:46px!important;font-size:22px!important}
          .float-cb{display:none!important}
        }
        @media(max-width:400px){
          .why-grid{grid-template-columns:1fr!important}
          .products-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr!important}
          .hero-stats{gap:12px!important}
        }
        .modal-overlay{position:fixed;inset:0;z-index:3000;display:flex;align-items:flex-end;justify-content:center}
        .modal-box{position:relative;width:100%;max-width:520px;background:#fff;border-radius:20px 20px 0 0;padding:28px 28px 36px;box-shadow:0 -8px 40px rgba(0,0,0,0.15)}
        .modal-drag{width:40px;height:4px;background:#e5e7eb;border-radius:2px;margin:0 auto 20px}
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, background: navbarBg ? "#fff" : "transparent", boxShadow: navbarBg ? "0 2px 20px rgba(0,0,0,0.08)" : "none", transition:"all 0.3s ease", padding:"0 16px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, minWidth:0, maxWidth:"50%" }}>
            {tenant?.logo ? <img src={tenant.logo} alt={tenant.name} style={{ height:36, objectFit:"contain" }} /> : (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:32, height:32, background:primary, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>⚡</div>
                <div style={{ minWidth:0 }}>
                  <div className="nav-logo-text" style={{ fontSize:14, fontWeight:800, color: navbarBg?"#111":"#fff", lineHeight:1.2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:180 }}>{tenant?.name}</div>
                  <div className="nav-logo-sub" style={{ fontSize:9, color:primary, fontWeight:600, letterSpacing:1, whiteSpace:"nowrap" }}>BATTERY SERVICE</div>
                </div>
              </div>
            )}
          </div>
          <div className="desktop-nav" style={{ alignItems:"center", gap:24, fontSize:14, fontWeight:500 }}>
            {["Products","Categories","Calculator","Reviews","Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color: navbarBg?"#374151":"rgba(255,255,255,0.9)", textDecoration:"none", transition:"color 0.2s", whiteSpace:"nowrap" }}
                onMouseEnter={e => (e.currentTarget.style.color=primary)}
                onMouseLeave={e => (e.currentTarget.style.color= navbarBg?"#374151":"rgba(255,255,255,0.9)")}>
                {item}
              </a>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color: navbarBg?"#374151":"#fff", padding:6 }}>🔍</button>
            <a className="desktop-phone" href="tel:+918143455418" style={{ alignItems:"center", gap:6, color: navbarBg?"#374151":"#fff", textDecoration:"none", fontSize:13, fontWeight:600, whiteSpace:"nowrap" }}>📞 +91 8143455418</a>
            <button onClick={() => setCartOpen(true)} style={{ position:"relative", background:"none", border:"none", cursor:"pointer", fontSize:20, color: navbarBg?"#374151":"#fff", padding:6 }}>
              🛒
              {cartCount > 0 && <span style={{ position:"absolute", top:0, right:0, background:primary, color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{cartCount}</span>}
            </button>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:24, color: navbarBg?"#374151":"#fff", padding:"4px 6px" }}>
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div style={{ background:"#fff", padding:"12px 16px", borderTop:"1px solid #f0f0f0" }}>
            <div style={{ maxWidth:600, margin:"0 auto", position:"relative" }}>
              <input autoFocus placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft:40 }} />
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
            </div>
          </div>
        )}
        {mobileMenuOpen && (
          <div style={{ background:"#fff", borderTop:"1px solid #f0f0f0", boxShadow:"0 8px 24px rgba(0,0,0,0.1)" }}>
            {["Products","Categories","Calculator","Reviews","Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                style={{ color:"#374151", textDecoration:"none", fontWeight:600, fontSize:15, padding:"14px 16px", borderBottom:"1px solid #f3f4f6", display:"block" }}>{item}</a>
            ))}
            <a href="tel:+918143455418" style={{ color:primary, fontWeight:700, textDecoration:"none", padding:"14px 16px", fontSize:15, display:"flex", alignItems:"center", gap:8 }}>📞 +91 8143455418</a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ position:"relative", height:"100vh", minHeight:560, overflow:"hidden" }}>
        {HERO_SLIDES.map((s,i) => (
          <div key={i} style={{ position:"absolute", inset:0, backgroundImage:`url(${s.bg})`, backgroundSize:"cover", backgroundPosition:"center", opacity: i===heroIdx?1:0, transition:"opacity 0.8s ease", zIndex: i===heroIdx?1:0 }}>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.55) 60%,rgba(0,0,0,0.3) 100%)" }} />
          </div>
        ))}
        <div style={{ position:"relative", zIndex:2, height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", padding:"72px 16px 80px", maxWidth:1280, margin:"0 auto", width:"100%" }}>
          <div key={heroIdx} className="fade-in">
            {/* Urgency badges */}
            <div className="urgency-row" style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
              <span className="urgency-badge" style={{ fontSize:11 }}>⚡ Same Day Installation</span>
              <span className="urgency-badge" style={{ fontSize:11 }}>⚡ Free Warranty Registration</span>
            </div>
            <div style={{ display:"inline-block", background:primary, color:"#fff", fontSize:10, fontWeight:700, letterSpacing:1.5, padding:"4px 10px", borderRadius:20, marginBottom:12, textTransform:"uppercase" }}>{slide.eyebrow}</div>
            <h1 style={{ fontSize:"clamp(22px,4.5vw,58px)", fontWeight:900, color:"#fff", lineHeight:1.18, marginBottom:12, maxWidth:680, textShadow:"0 2px 20px rgba(0,0,0,0.4)" }}>{slide.headline}</h1>
            <p style={{ fontSize:"clamp(13px,1.8vw,16px)", color:"rgba(255,255,255,0.85)", maxWidth:500, lineHeight:1.65, marginBottom:22 }}>{slide.sub}</p>
            <div className="hero-btns" style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:28 }}>
              <button className="btn-primary" onClick={() => document.getElementById("products")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"12px 24px", fontSize:14 }}>{slide.cta1} →</button>
              <button className="btn-white" onClick={() => document.getElementById("calculator")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"12px 24px", fontSize:14 }}>🔋 Battery Calculator</button>
            </div>
            <div ref={statsRef} className="hero-stats" style={{ display:"flex", gap:24, flexWrap:"nowrap" }}>
              {[{num:`${count1}+`,label:"Happy Customers"},{num:`${count2}+`,label:"Brands Stocked"},{num:`${count3}%`,label:"Repeat Customers"}].map(s => (
                <div key={s.label} style={{ flexShrink:0 }}>
                  <div className="hero-stat-num" style={{ fontSize:26, fontWeight:900, color:"#fff", lineHeight:1 }}>{s.num}</div>
                  <div className="hero-stat-label" style={{ fontSize:11, color:"rgba(255,255,255,0.75)", fontWeight:500, marginTop:4, whiteSpace:"nowrap" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:80, left:"50%", transform:"translateX(-50%)", zIndex:3, display:"flex", gap:8 }}>
          {HERO_SLIDES.map((_,i) => <button key={i} onClick={() => setHeroIdx(i)} style={{ width: i===heroIdx?28:8, height:8, borderRadius:4, border:"none", background: i===heroIdx?primary:"rgba(255,255,255,0.5)", cursor:"pointer", transition:"all 0.3s" }} />)}
        </div>
        {["←","→"].map((a,ai) => (
          <button key={a} onClick={() => setHeroIdx((heroIdx+(ai===0?-1:1)+HERO_SLIDES.length)%HERO_SLIDES.length)}
            style={{ position:"absolute", top:"50%", [ai===0?"left":"right"]:16, transform:"translateY(-50%)", zIndex:3, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(4px)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", width:44, height:44, borderRadius:"50%", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {a}
          </button>
        ))}
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background:primary, padding:"12px 0", overflow:"hidden" }}>
        <div style={{ display:"flex", overflow:"hidden" }}>
          <div className="marquee-track">
            {[...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i) => (
              <span key={i} style={{ color:"#fff", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>⚡ {item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── AUTHORIZED DEALER BADGES ── */}
      <section style={{ padding:"32px 24px", background:"#fff", borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <span style={{ fontSize:13, fontWeight:700, color:"#6b7280", letterSpacing:2, textTransform:"uppercase" }}>Authorized Dealer For</span>
          </div>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            {[
              {name:"Microtek",color:"#1e40af",bg:"#eff6ff"},
              {name:"Exide",color:"#15803d",bg:"#f0fdf4"},
              {name:"Livguard",color:"#7c3aed",bg:"#f5f3ff"},
              {name:"Luminous",color:"#b45309",bg:"#fffbeb"},
              {name:"Amaron",color:"#be123c",bg:"#fff1f2"},
            ].map(b => (
              <div key={b.name} style={{ background:b.bg, border:`2px solid ${b.color}30`, borderRadius:10, padding:"10px 20px", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:16 }}>🛡️</span>
                <span style={{ fontSize:14, fontWeight:700, color:b.color }}>{b.name}</span>
                <span style={{ fontSize:10, background:b.color, color:"#fff", borderRadius:4, padding:"2px 6px", fontWeight:700 }}>AUTHORIZED</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BATTERY CALCULATOR ── */}
      <section id="calculator" style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Free Tool</div>
            <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:800, marginBottom:12 }}>🔋 Find the Right Battery</h2>
            <p style={{ fontSize:16, color:"#6b7280" }}>Tell us your appliances and desired backup — we'll recommend the perfect battery.</p>
          </div>
          <div style={{ background:"#fff", borderRadius:20, padding:"32px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", border:"1px solid #f0f0f0" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16, marginBottom:24 }}>
              {[
                {key:"fans",label:"🌀 Fans",icon:"fan"},
                {key:"tv",label:"📺 TVs",icon:"tv"},
                {key:"lights",label:"💡 Lights",icon:"light"},
                {key:"fridge",label:"🧊 Fridge",icon:"fridge"},
                {key:"computer",label:"💻 Computers",icon:"computer"},
                {key:"ac",label:"❄️ ACs (1.5 ton)",icon:"ac"},
              ].map(item => (
                <div key={item.key} className="calc-input">
                  <span style={{ fontSize:14, fontWeight:600, flex:1 }}>{item.label}</span>
                  <button className="qty-btn" onClick={() => setCalc(c => ({...c,[item.key]:Math.max(0,c[item.key as keyof typeof c]-1)}))}>−</button>
                  <span style={{ fontSize:18, fontWeight:800, minWidth:24, textAlign:"center" }}>{calc[item.key as keyof typeof calc]}</span>
                  <button className="qty-btn" onClick={() => setCalc(c => ({...c,[item.key]:c[item.key as keyof typeof c]+1}))}>+</button>
                </div>
              ))}
            </div>
            <div className="calc-input" style={{ marginBottom:24 }}>
              <span style={{ fontSize:14, fontWeight:600, flex:1 }}>⏱️ Desired Backup Hours</span>
              <button className="qty-btn" onClick={() => setCalc(c => ({...c,hours:Math.max(1,c.hours-1)}))}>−</button>
              <span style={{ fontSize:18, fontWeight:800, minWidth:32, textAlign:"center" }}>{calc.hours}h</span>
              <button className="qty-btn" onClick={() => setCalc(c => ({...c,hours:Math.min(12,c.hours+1)}))}>+</button>
            </div>
            <button className="btn-primary" onClick={runCalculator} style={{ width:"100%", padding:"14px", fontSize:16 }}>
              Calculate My Battery →
            </button>
            {calcResult && (
              <div style={{ marginTop:24, background:`${primary}08`, border:`2px solid ${primary}30`, borderRadius:14, padding:24 }} className="slide-up">
                <div style={{ fontSize:14, fontWeight:700, color:primary, marginBottom:16, textTransform:"uppercase", letterSpacing:1 }}>✅ Recommended for You</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                  {[
                    {label:"Battery",val:calcResult.battery},
                    {label:"Inverter",val:calcResult.inverter},
                    {label:"Estimated Backup",val:calcResult.backup},
                    {label:"Approx. Price",val:calcResult.price},
                  ].map(r => (
                    <div key={r.label} style={{ background:"#fff", borderRadius:10, padding:"12px 16px" }}>
                      <div style={{ fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", marginBottom:4 }}>{r.label}</div>
                      <div style={{ fontSize:15, fontWeight:700, color:"#111" }}>{r.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <button className="btn-primary" onClick={() => openInquiry({name:`${calcResult.battery} + ${calcResult.inverter}`,id:"calc"})} style={{ flex:1, padding:"12px", fontSize:15 }}>Get Quote for This →</button>
                  <a href="https://wa.me/918143455418" target="_blank" rel="noreferrer" style={{ flex:1 }}>
                    <button style={{ width:"100%", background:"#25d366", color:"#fff", border:"none", borderRadius:8, padding:"12px", fontSize:15, fontWeight:600, cursor:"pointer" }}>💬 WhatsApp Result</button>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PRODUCT RECOMMENDATION MATRIX ── */}
      <section style={{ padding:"60px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Quick Guide</div>
            <h2 style={{ fontSize:"clamp(24px,2.5vw,38px)", fontWeight:800, marginBottom:8 }}>Product Recommendation Matrix</h2>
            <p style={{ fontSize:15, color:"#6b7280" }}>Find the right product for your requirement in seconds.</p>
          </div>
          <div style={{ overflowX:"auto", borderRadius:14, boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", background:"#fff" }}>
              <thead>
                <tr style={{ background:primary }}>
                  {["Your Requirement","Recommended Product","Backup Time","Approx. Price"].map(h => (
                    <th key={h} style={{ padding:"14px 18px", textAlign:"left", fontSize:13, fontWeight:700, color:"#fff" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECOMMENDATION_MATRIX.map((row,i) => (
                  <tr key={row.req} style={{ background: i%2===0?"#fff":"#fafafa", borderBottom:"1px solid #f0f0f0" }}>
                    <td style={{ padding:"14px 18px", fontSize:14, fontWeight:600 }}>{row.req}</td>
                    <td style={{ padding:"14px 18px", fontSize:14, color:primary, fontWeight:700 }}>{row.product}</td>
                    <td style={{ padding:"14px 18px", fontSize:14 }}>{row.backup}</td>
                    <td style={{ padding:"14px 18px", fontSize:14, fontWeight:700 }}>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign:"center", marginTop:24 }}>
            <button className="btn-primary" onClick={() => openInquiry({name:"Product Recommendation",id:"matrix"})} style={{ padding:"12px 28px" }}>Get Expert Recommendation →</button>
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES (Static + Live) ── */}
      <section id="categories" style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>What We Sell</div>
            <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:800, marginBottom:12 }}>Our Product Categories</h2>
            <p style={{ fontSize:15, color:"#6b7280" }}>All leading brands. Genuine products. Same-day installation.</p>
          </div>
          {/* Category tabs */}
          <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:32, paddingBottom:4 }}>
            {PRODUCT_CATEGORIES_STATIC.map((cat,i) => (
              <button key={cat.name} onClick={() => setActiveCatTab(i)}
                style={{ padding:"8px 18px", borderRadius:20, border:"2px solid", borderColor: activeCatTab===i?primary:"#e5e7eb", background: activeCatTab===i?primary:"#fff", color: activeCatTab===i?"#fff":"#374151", fontWeight:600, fontSize:13, cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap", flexShrink:0 }}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          {/* Selected category detail */}
          {(() => {
            const cat = PRODUCT_CATEGORIES_STATIC[activeCatTab];
            return (
              <div style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", border:"1px solid #f0f0f0", display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }} className="about-grid">
                <div style={{ height:280, overflow:"hidden" }}>
                  <img src={cat.img} alt={cat.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
                <div style={{ padding:"32px" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{cat.icon}</div>
                  <h3 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>{cat.name}</h3>
                  <p style={{ fontSize:14, color:"#6b7280", lineHeight:1.7, marginBottom:20 }}>{cat.desc}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                    {[{l:"MRP",v:cat.mrp},{l:"Our Price",v:cat.price},{l:"Warranty",v:cat.warranty},{l:"Est. Backup",v:cat.backup}].map(r => (
                      <div key={r.l} style={{ background:"#f8fafc", borderRadius:8, padding:"10px 14px" }}>
                        <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{r.l}</div>
                        <div style={{ fontSize:15, fontWeight:700, color: r.l==="Our Price"?primary:"#111" }}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#6b7280", marginBottom:8 }}>SUITABLE FOR</div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{cat.suitable}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                    {cat.stock && <span style={{ background:"#f0fdf4", color:"#15803d", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>✅ Available for Same-Day Delivery</span>}
                    <span style={{ background:"#f0fdf4", color:"#15803d", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>✅ Free Installation</span>
                  </div>
                  <button className="btn-primary" onClick={() => openInquiry({name:cat.name,id:"cat"})} style={{ width:"100%", padding:"13px", fontSize:15 }}>Get Best Price →</button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── LIVE PRODUCTS ── */}
      <section id="products" style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:40, flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Live Catalog</div>
              <h2 style={{ fontSize:"clamp(22px,2.5vw,36px)", fontWeight:800 }}>Our Products</h2>
            </div>
            <div style={{ position:"relative" }}>
              <input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width:240, paddingLeft:36 }} />
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}>🔍</span>
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div style={{ background:"#f8fafc", borderRadius:16, padding:"48px 24px", textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
              <div style={{ fontSize:20, fontWeight:700, marginBottom:12 }}>Products Coming Soon!</div>
              <p style={{ fontSize:15, color:"#6b7280", marginBottom:24 }}>Browse our categories above or contact us directly for pricing.</p>
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                <button className="btn-primary" onClick={() => document.getElementById("categories")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"12px 24px" }}>Browse Categories</button>
                <button className="btn-outline" onClick={() => openInquiry({name:"General Enquiry",id:"general"})} style={{ padding:"12px 24px" }}>Get a Quote</button>
              </div>
            </div>
          ) : (
            <div className="products-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:24 }}>
              {filteredProducts.map(p => (
                <div key={p.id} className="card-hover product-card" style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:"1px solid #f0f0f0", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", position:"relative" }}>
                  <div style={{ position:"relative", height:200, background:"#f3f4f6", overflow:"hidden" }}>
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:48 }}>⚡</div>}
                    <div className="product-overlay" style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <button className="btn-primary" onClick={() => openInquiry(p)} style={{ fontSize:14, padding:"10px 20px" }}>Quick Enquiry</button>
                    </div>
                    {p.category?.name && <div style={{ position:"absolute", top:10, left:10, background:primary, color:"#fff", borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{p.category.name}</div>}
                    <div style={{ position:"absolute", top:10, right:10, background:"#f0fdf4", color:"#15803d", borderRadius:6, padding:"3px 8px", fontSize:10, fontWeight:700 }}>✅ In Stock</div>
                  </div>
                  <div style={{ padding:"16px 16px 20px" }}>
                    <h3 style={{ fontSize:15, fontWeight:700, marginBottom:6, lineHeight:1.3 }}>{p.name}</h3>
                    {p.description && <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.6, marginBottom:10, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.description}</p>}
                    {p.price && (
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                        <span style={{ fontSize:18, fontWeight:800, color:primary }}>₹{p.price.toLocaleString("en-IN")}</span>
                        <span style={{ fontSize:12, color:"#9ca3af", textDecoration:"line-through" }}>₹{Math.round(p.price*1.15).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="btn-primary" onClick={() => openInquiry(p)} style={{ flex:1, padding:"9px 12px", fontSize:13 }}>Get Best Price</button>
                      <button style={{ padding:"9px 12px", fontSize:20, background:"#25d366", border:"none", borderRadius:8, cursor:"pointer" }}>
                        <a href={`https://wa.me/918143455418?text=Hi, I'm interested in ${p.name}`} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>💬</a>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SERVICE AREAS ── */}
      <section style={{ padding:"60px 24px", background:`linear-gradient(135deg,${primary}08,${primary}15)`, borderTop:`3px solid ${primary}20` }}>
        <div style={{ maxWidth:1000, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Local Service</div>
          <h2 style={{ fontSize:"clamp(24px,2.5vw,36px)", fontWeight:800, marginBottom:8 }}>📍 Areas We Serve</h2>
          <p style={{ fontSize:15, color:"#6b7280", marginBottom:32 }}>Same-day delivery and installation available in these areas.</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
            {SERVICE_AREAS.map(area => (
              <span key={area} style={{ background:"#fff", border:`2px solid ${primary}30`, color:"#374151", borderRadius:20, padding:"8px 18px", fontSize:14, fontWeight:600, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>📍 {area}</span>
            ))}
          </div>
          <div style={{ marginTop:28 }}>
            <span style={{ fontSize:14, color:"#6b7280" }}>Not in the list? </span>
            <a href="tel:+918143455418" style={{ color:primary, fontWeight:700, textDecoration:"none", fontSize:14 }}>Call us — we may still cover your area!</a>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Why Choose Us</div>
            <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:800, marginBottom:12 }}>Why Choose {tenant.name}?</h2>
            <p style={{ fontSize:15, color:"#6b7280" }}>Your neighbourhood inverter battery shop — genuine products, expert advice, fast service.</p>
          </div>
          <div className="why-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, marginBottom:56 }}>
            {WHY_CARDS.map(card => (
              <div key={card.title} className="card-hover" style={{ background:"#fff", borderRadius:16, padding:"28px 24px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", border:"1px solid #f0f0f0" }}>
                <div style={{ width:60, height:60, background:`${card.color}18`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:26 }}>{card.icon}</div>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>{card.title}</h3>
                <p style={{ fontSize:14, color:"#6b7280", lineHeight:1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>
          {/* Comparison table */}
          <div>
            <h3 style={{ fontSize:20, fontWeight:800, textAlign:"center", marginBottom:8 }}>We vs Online Platforms vs Local Shops</h3>
            <p style={{ textAlign:"center", color:"#6b7280", marginBottom:28, fontSize:14 }}>Why we're the smarter choice</p>
            <div style={{ overflowX:"auto", borderRadius:12, boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", background:"#fff" }}>
                <thead>
                  <tr style={{ background:"#f8fafc" }}>
                    {["Feature",`⚡ ${tenant.name}`,"🛒 Online","🏪 Local Shop"].map((h,i) => (
                      <th key={h} style={{ padding:"12px 16px", textAlign: i===0?"left":"center", fontSize:13, fontWeight:700, color: i===1?primary:"#374151", borderBottom:"2px solid #e5e7eb" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row,i) => (
                    <tr key={row.feature} style={{ background: i%2===0?"#fff":"#f9fafb" }}>
                      <td style={{ padding:"11px 16px", fontSize:13, fontWeight:500 }}>{row.feature}</td>
                      {[row.us,row.online,row.local].map((val,vi) => (
                        <td key={vi} style={{ padding:"11px 16px", textAlign:"center", fontSize:13 }}>
                          {val===true?<span style={{ color:primary, fontWeight:700 }}>✓</span>:val===false?<span style={{ color:"#9ca3af" }}>✗</span>:<span style={{ color: vi===0?primary:"#9ca3af", fontWeight: vi===0?600:400 }}>{val}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISTAKES TO AVOID ── */}
      <section style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#ef4444", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Must Read</div>
            <h2 style={{ fontSize:"clamp(24px,2.5vw,38px)", fontWeight:800, marginBottom:8 }}>5 Mistakes to Avoid When Buying an Inverter Battery</h2>
            <p style={{ fontSize:15, color:"#6b7280" }}>Most people regret these decisions later. Read this before buying.</p>
          </div>
          <div className="mistakes-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {MISTAKES_CONTENT.map((m,i) => (
              <div key={m.title} className="card-hover" style={{ background:"#fff", borderRadius:14, padding:"24px", border:"1px solid #f0f0f0", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ width:36, height:36, background:"#fef2f2", border:"2px solid #fecaca", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#ef4444", flexShrink:0 }}>{i+1}</div>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, marginBottom:8, color:"#111" }}>{m.title}</div>
                    <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.7 }}>{m.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:28 }}>
            <button className="btn-primary" onClick={() => openInquiry({name:"Expert Battery Advice",id:"advice"})} style={{ padding:"12px 28px" }}>Get Free Expert Advice →</button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background:`linear-gradient(135deg,#0f172a,#1e293b,${primary}22)`, padding:"64px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, background:`${primary}15`, borderRadius:"50%", pointerEvents:"none" }} />
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap", marginBottom:20 }}>
            <span className="urgency-badge" style={{ background:"rgba(255,255,255,0.1)", color:"#fff", borderColor:"rgba(255,255,255,0.3)" }}>⚡ Same Day Installation Available</span>
            <span className="urgency-badge" style={{ background:"rgba(255,255,255,0.1)", color:"#fff", borderColor:"rgba(255,255,255,0.3)" }}>⚡ Delivery Within 24 Hours</span>
            <span className="urgency-badge" style={{ background:"rgba(255,255,255,0.1)", color:"#fff", borderColor:"rgba(255,255,255,0.3)" }}>⚡ Warranty Registration Included</span>
          </div>
          <h2 style={{ fontSize:"clamp(26px,3.5vw,44px)", fontWeight:900, color:"#fff", marginBottom:16, lineHeight:1.15 }}>Inverter Battery Solutions You Can Trust</h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.75)", marginBottom:32, maxWidth:560, margin:"0 auto 32px", lineHeight:1.7 }}>Expert installation, genuine products, after-sales support — right here in Secunderabad.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-primary" onClick={() => openInquiry({name:"Get Free Quote",id:"cta"})} style={{ padding:"13px 28px", fontSize:16 }}>Get Free Quote</button>
            <button onClick={() => setCallbackOpen(true)} style={{ background:"rgba(255,255,255,0.15)", color:"#fff", border:"2px solid rgba(255,255,255,0.4)", borderRadius:8, padding:"13px 28px", fontSize:16, fontWeight:600, cursor:"pointer" }}>☎ Request Callback</button>
            <a href="https://wa.me/918143455418" target="_blank" rel="noreferrer">
              <button style={{ background:"#25d366", color:"#fff", border:"none", borderRadius:8, padding:"13px 28px", fontSize:16, fontWeight:600, cursor:"pointer" }}>💬 WhatsApp Us</button>
            </a>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Our Work</div>
            <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:800, marginBottom:8 }}>Recent Installations</h2>
            <p style={{ fontSize:15, color:"#6b7280" }}>Real projects, real customers, real results across Secunderabad & Hyderabad.</p>
          </div>
          <div className="projects-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {PROJECTS.map(proj => (
              <div key={proj.title} className="card-hover" style={{ background:"#fff", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", border:"1px solid #f0f0f0" }}>
                <div style={{ height:180, overflow:"hidden", position:"relative" }}>
                  <img src={proj.img} alt={proj.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  <div style={{ position:"absolute", top:10, left:10, background:primary, color:"#fff", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:700 }}>{proj.cat}</div>
                </div>
                <div style={{ padding:"16px 18px 20px" }}>
                  <div style={{ fontSize:12, color:"#9ca3af", marginBottom:4 }}>📍 {proj.loc}</div>
                  <h3 style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>{proj.title}</h3>
                  <div style={{ display:"inline-block", background:`${primary}15`, color:primary, borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:600, marginBottom:8 }}>{proj.spec}</div>
                  <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.6 }}>{proj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Reviews</div>
            <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:800, marginBottom:8 }}>What Our Customers Say</h2>
            <p style={{ fontSize:15, color:"#6b7280" }}>Real reviews from verified customers on Google & IndiaMART.</p>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:32 }}>
            {(["google","indiamart"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTestimonialTab(tab)}
                style={{ padding:"9px 24px", borderRadius:30, border:"2px solid", borderColor: activeTestimonialTab===tab?primary:"#e5e7eb", background: activeTestimonialTab===tab?primary:"#fff", color: activeTestimonialTab===tab?"#fff":"#6b7280", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.2s" }}>
                {tab==="google"?"🔍 Google":"🏭 IndiaMART"}
              </button>
            ))}
          </div>
          <div className="reviews-scroll">
            {TESTIMONIALS.filter(t => activeTestimonialTab==="google"?t.source==="Google":t.source==="IndiaMART").map((t,i) => (
              <div key={i} style={{ background:"#fff", borderRadius:12, padding:"22px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", border:"1px solid #f0f0f0", minWidth:300 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ color:"#f59e0b", fontSize:14 }}>★★★★★</span>
                  <span style={{ fontSize:11, fontWeight:700, color: t.source==="Google"?"#4285F4":"#e8732a" }}>{t.source==="Google"?"G Google":"IM IndiaMART"}</span>
                </div>
                <p style={{ fontSize:13, color:"#374151", lineHeight:1.7, marginBottom:14, fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:t.color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:14 }}>{t.av}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{t.loc} · {t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WARRANTY TRANSPARENCY ── */}
      <section style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Transparency</div>
            <h2 style={{ fontSize:"clamp(24px,2.5vw,38px)", fontWeight:800, marginBottom:8 }}>Warranty — Everything You Need to Know</h2>
            <p style={{ fontSize:15, color:"#6b7280" }}>No hidden terms. Full transparency on what's covered and what's not.</p>
          </div>
          <div className="warranty-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {WARRANTY_INFO.map(w => (
              <div key={w.title} className="card-hover" style={{ background:"#fff", borderRadius:14, padding:"24px", border:"1px solid #f0f0f0", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:28, marginBottom:14 }}>{w.icon}</div>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>{w.title}</h3>
                <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
                  {w.items.map(item => (
                    <li key={item} style={{ fontSize:13, color:"#4b5563", display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ color: w.icon==="✅"?primary:w.icon==="❌"?"#ef4444":"#3b82f6", fontWeight:700 }}>{w.icon==="✅"?"✓":w.icon==="❌"?"✗":"→"}</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ background:"#fff", borderRadius:14, padding:"20px 24px", marginTop:24, border:`2px solid ${primary}30`, textAlign:"center" }}>
            <span style={{ fontSize:14, fontWeight:600 }}>🕐 Expected claim timeline: </span>
            <span style={{ fontSize:14, color:primary, fontWeight:700 }}>7–10 working days from inspection. We handle all paperwork.</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>FAQs</div>
            <h2 style={{ fontSize:"clamp(24px,2.5vw,38px)", fontWeight:800, marginBottom:8 }}>Frequently Asked Questions</h2>
            <p style={{ fontSize:15, color:"#6b7280" }}>Everything you need to know before buying.</p>
          </div>
          <div style={{ background:"#f8fafc", borderRadius:16, overflow:"hidden", border:"1px solid #f0f0f0" }}>
            {FAQS.map((faq,i) => (
              <div key={i} className="faq-item" style={{ padding:"20px 24px", borderBottom: i<FAQS.length-1?"1px solid #f0f0f0":"none", cursor:"pointer" }} onClick={() => setOpenFaq(openFaq===i?null:i)}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                  <div style={{ fontSize:15, fontWeight:700, color: openFaq===i?primary:"#111" }}>{faq.q}</div>
                  <div style={{ fontSize:20, color:primary, flexShrink:0, transition:"transform 0.2s", transform: openFaq===i?"rotate(180deg)":"none" }}>▾</div>
                </div>
                {openFaq===i && (
                  <div style={{ fontSize:14, color:"#4b5563", lineHeight:1.8, marginTop:14, paddingTop:14, borderTop:"1px solid #f0f0f0" }} className="fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>About Us</div>
              <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:800, lineHeight:1.15, marginBottom:18 }}>About {tenant.name}</h2>
              <p style={{ fontSize:15, color:"#4b5563", lineHeight:1.8, marginBottom:16 }}>{tenant.name} is a trusted inverter battery shop located in Annojiguda, Secunderabad. We offer a wide range of inverter batteries, UPS systems, and power backup solutions for homes and businesses.</p>
              <p style={{ fontSize:15, color:"#4b5563", lineHeight:1.8, marginBottom:28 }}>With years of experience and a commitment to quality, we stock all leading brands and provide expert guidance to help you choose the right battery. Fast same-day service, proper installation, and dedicated after-sales support.</p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <span style={{ background:"#f0fdf4", color:"#15803d", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:600 }}>✓ Open from 10 AM daily</span>
                <span style={{ background:"#eff6ff", color:"#1d4ed8", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:600 }}>✓ Cash & UPI Accepted</span>
                <span style={{ background:"#fff7ed", color:"#c2410c", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:600 }}>✓ Parking Available</span>
              </div>
            </div>
            <div className="about-image" style={{ position:"relative" }}>
              <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=700&q=80" alt="Battery Service" style={{ width:"100%", borderRadius:16, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} />
              <div style={{ position:"absolute", bottom:-24, left:-24, background:primary, color:"#fff", borderRadius:12, padding:"14px 18px", boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
                <div style={{ fontSize:24, fontWeight:900 }}>500+</div>
                <div style={{ fontSize:11, fontWeight:600, opacity:0.9 }}>Happy Customers</div>
              </div>
              <div style={{ position:"absolute", top:-16, right:-16, background:"#fff", borderRadius:12, padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize:18, fontWeight:900, color:primary }}>4.9 ★</div>
                <div style={{ fontSize:10, color:"#6b7280" }}>Google Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:13, fontWeight:700, color:primary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Contact</div>
            <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:800, marginBottom:8 }}>Get In Touch</h2>
            <p style={{ fontSize:15, color:"#6b7280" }}>Have questions? We're here to help. Free consultation available.</p>
          </div>
          <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                {icon:"📞",label:"Phone",value:"+91 8143455418",href:"tel:+918143455418",color:"#3b82f6"},
                {icon:"📧",label:"Email",value:"info@srimallibattery.com",href:"mailto:info@srimallibattery.com",color:"#10b981"},
                {icon:"📍",label:"Address",value:"Annojiguda, Hyderabad, Secunderabad - 501301, Telangana",href:"https://maps.google.com/?q=Annojiguda+Secunderabad",color:"#f59e0b"},
                {icon:"🕐",label:"Working Hours",value:"Open from 10 AM — Working Days",href:"tel:+918143455418",color:"#8b5cf6"},
              ].map(item => (
                <a key={item.label} href={item.href} target={item.label==="Address"?"_blank":undefined} rel="noreferrer" style={{ textDecoration:"none" }}>
                  <div className="card-hover" style={{ background:"#f8fafc", borderRadius:12, padding:"18px 20px", display:"flex", alignItems:"center", gap:14, border:"1px solid #f0f0f0" }}>
                    <div style={{ width:44, height:44, background:`${item.color}18`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>{item.label}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>{item.value}</div>
                    </div>
                  </div>
                </a>
              ))}
              <a href="https://wa.me/918143455418" target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
                <button style={{ width:"100%", background:"#25d366", color:"#fff", border:"none", borderRadius:12, padding:"14px", fontSize:16, fontWeight:700, cursor:"pointer" }}>💬 WhatsApp Now</button>
              </a>
              <button onClick={() => setCallbackOpen(true)} style={{ width:"100%", background:primary, color:"#fff", border:"none", borderRadius:12, padding:"14px", fontSize:16, fontWeight:700, cursor:"pointer" }}>☎ Request Callback</button>
            </div>
            <div style={{ background:"#f8fafc", borderRadius:16, padding:"32px", border:"1px solid #f0f0f0" }}>
              <h3 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Send Us a Message</h3>
              <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>We'll get back to you within 2 hours.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div><label>Name *</label><input placeholder="Your full name" value={contactForm.name} onChange={e => setContactForm({...contactForm,name:e.target.value})} /></div>
                <div><label>Phone *</label><input placeholder="+91 XXXXXXXXXX" value={contactForm.phone} onChange={e => setContactForm({...contactForm,phone:e.target.value})} /></div>
                <div><label>Email</label><input type="email" placeholder="your@email.com" value={contactForm.email} onChange={e => setContactForm({...contactForm,email:e.target.value})} /></div>
                <div><label>Message</label><textarea rows={3} placeholder="Tell us about your requirements..." value={contactForm.message} onChange={e => setContactForm({...contactForm,message:e.target.value})} style={{ resize:"vertical" }} /></div>
                {contactStatus==="sent" ? (
                  <div style={{ background:"#f0fdf4", color:"#15803d", padding:"13px", borderRadius:8, fontWeight:600, textAlign:"center" }}>✅ Message sent! We'll respond within 2 hours.</div>
                ) : (
                  <button className="btn-primary" onClick={submitContact} disabled={contactStatus==="sending"} style={{ padding:"13px", fontSize:16, width:"100%", opacity: contactStatus==="sending"?0.7:1 }}>
                    {contactStatus==="sending"?"Sending...":"Send Message →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── READY CTA ── */}
      <section style={{ background:`linear-gradient(135deg,${primary},#ea580c)`, padding:"64px 24px", textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          <span className="urgency-badge" style={{ background:"rgba(255,255,255,0.2)", color:"#fff", borderColor:"rgba(255,255,255,0.4)" }}>⚡ Same Day Installation</span>
          <span className="urgency-badge" style={{ background:"rgba(255,255,255,0.2)", color:"#fff", borderColor:"rgba(255,255,255,0.4)" }}>⚡ 24hr Delivery</span>
        </div>
        <h2 style={{ fontSize:"clamp(26px,3vw,42px)", fontWeight:900, color:"#fff", marginBottom:14 }}>Ready to Get the Right Battery?</h2>
        <p style={{ fontSize:17, color:"rgba(255,255,255,0.88)", marginBottom:32, maxWidth:500, margin:"0 auto 32px", lineHeight:1.7 }}>Visit us at Annojiguda, Secunderabad — or call for expert advice and same-day installation.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-white" onClick={() => openInquiry({name:"Get Quote",id:"final-cta"})} style={{ padding:"13px 28px", fontSize:16 }}>Get Free Quote</button>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} style={{ background:"transparent", color:"#fff", border:"2px solid #fff", borderRadius:8, padding:"13px 28px", fontSize:16, fontWeight:600, cursor:"pointer" }}>Contact Us Today</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#0f172a", color:"#cbd5e1", padding:"48px 24px 100px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:40 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:32, height:32, background:primary, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚡</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>{tenant.name}</div>
                  <div style={{ fontSize:9, color:primary, fontWeight:600, letterSpacing:1 }}>BATTERY SERVICE</div>
                </div>
              </div>
              <p style={{ fontSize:13, lineHeight:1.8, marginBottom:14, maxWidth:260 }}>Your trusted neighbourhood inverter battery shop in Secunderabad — genuine products, expert advice, fast service.</p>
              <div style={{ fontSize:12, background:"#1e293b", padding:"6px 12px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:6, marginBottom:16 }}>
                <span style={{ color:primary }}>●</span> Open 10 AM · Working Days
              </div>
            </div>
            <div>
              <h4 style={{ color:"#fff", fontSize:14, fontWeight:700, marginBottom:16 }}>Quick Links</h4>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
                {["Home","Products","Categories","Calculator","Reviews","Contact Us"].map(link => (
                  <li key={link}><a href="#" style={{ color:"#94a3b8", fontSize:13, textDecoration:"none" }}>{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color:"#fff", fontSize:14, fontWeight:700, marginBottom:16 }}>Our Products</h4>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
                {["Tubular Batteries","Flat Plate Batteries","Lithium Batteries","Inverter / Home UPS","Online UPS","Battery Service"].map(p => (
                  <li key={p}><a href="#categories" style={{ color:"#94a3b8", fontSize:13, textDecoration:"none" }}>{p}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color:"#fff", fontSize:14, fontWeight:700, marginBottom:16 }}>Contact</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
                <a href="tel:+918143455418" style={{ color:"#94a3b8", fontSize:13, textDecoration:"none" }}>📞 +91 8143455418</a>
                <a href="mailto:info@srimallibattery.com" style={{ color:"#94a3b8", fontSize:13, textDecoration:"none" }}>📧 info@srimallibattery.com</a>
                <span style={{ color:"#94a3b8", fontSize:13 }}>📍 Annojiguda, Secunderabad - 501301</span>
              </div>
              <h4 style={{ color:"#fff", fontSize:14, fontWeight:700, marginBottom:12 }}>Our Services</h4>
              {["Battery Testing & Diagnosis","Battery Installation","Battery Replacement","Inverter Service & Repair"].map(s => (
                <div key={s} style={{ color:"#94a3b8", fontSize:12, marginBottom:8 }}>{s}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid #1e293b", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ fontSize:12, color:"#64748b" }}>© 2025 {tenant.name}. All rights reserved.</div>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {["Terms of Service","Privacy Policy","Contact Us"].map(link => (
                <a key={link} href="#" style={{ fontSize:12, color:"#64748b", textDecoration:"none" }}>{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── STICKY CTA BAR ── */}
      <div className="sticky-cta" style={{ paddingBottom:"max(10px, env(safe-area-inset-bottom))" }}>
        <a href="tel:+918143455418" style={{ textDecoration:"none", flex:1 }}>
          <button style={{ width:"100%", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, padding:"11px 8px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>📞 Call Now</button>
        </a>
        <a href="https://wa.me/918143455418" target="_blank" rel="noreferrer" style={{ textDecoration:"none", flex:1 }}>
          <button style={{ width:"100%", background:"#25d366", color:"#fff", border:"none", borderRadius:8, padding:"11px 8px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>💬 WhatsApp</button>
        </a>
        <button onClick={() => openInquiry({name:"Get Quote",id:"sticky"})} style={{ flex:1, background:primary, color:"#fff", border:"none", borderRadius:8, padding:"11px 8px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>🏷️ Get Quote</button>
        <button onClick={() => setCallbackOpen(true)} style={{ flex:1, background:"#0f172a", color:"#fff", border:"none", borderRadius:8, padding:"11px 8px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>☎ Callback</button>
      </div>

      {/* ── FLOATING WHATSAPP ── */}
      <div className="float-wa">
        <a href="https://wa.me/918143455418" target="_blank" rel="noreferrer"
          style={{ display:"flex", width:52, height:52, background:"#25d366", borderRadius:"50%", alignItems:"center", justifyContent:"center", fontSize:26, boxShadow:"0 4px 20px rgba(37,211,102,0.4)", textDecoration:"none" }}>
          💬
        </a>
      </div>

      {/* ── FLOATING CALLBACK — hidden on mobile via CSS ── */}
      <div className="float-cb">
        <button onClick={() => setCallbackOpen(true)}
          style={{ background:primary, color:"#fff", border:"none", borderRadius:24, padding:"9px 14px", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 20px ${primary}60`, display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
          ☎ Callback
        </button>
      </div>

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:2000 }}>
          <div onClick={() => setCartOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} />
          <div style={{ position:"absolute", top:0, right:0, bottom:0, width:380, maxWidth:"100vw", background:"#fff", boxShadow:"-8px 0 40px rgba(0,0,0,0.15)", display:"flex", flexDirection:"column" }} className="slide-up">
            <div style={{ padding:"18px 20px", borderBottom:"1px solid #f0f0f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ fontSize:17, fontWeight:800 }}>🛒 Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, color:"#9ca3af" }}>✕</button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
              {cart.length===0 ? (
                <div style={{ textAlign:"center", padding:"48px 0", color:"#9ca3af" }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🛒</div>
                  <div style={{ fontWeight:600 }}>Cart is empty</div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:"flex", gap:12, padding:"12px", background:"#f8fafc", borderRadius:10 }}>
                      <div style={{ width:56, height:56, background:"#e5e7eb", borderRadius:8, overflow:"hidden", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                        {item.images?.[0]?<img src={item.images[0]} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />:"⚡"}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, marginBottom:6 }}>{item.name}</div>
                        {item.price && <div style={{ fontSize:13, fontWeight:700, color:primary, marginBottom:8 }}>₹{item.price.toLocaleString("en-IN")}</div>}
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <button onClick={() => updateQty(item.id,-1)} style={{ width:26, height:26, borderRadius:6, border:"1.5px solid #e5e7eb", background:"#fff", cursor:"pointer", fontSize:15, fontWeight:700 }}>−</button>
                          <span style={{ fontSize:14, fontWeight:700 }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id,1)} style={{ width:26, height:26, borderRadius:6, border:"1.5px solid #e5e7eb", background:"#fff", cursor:"pointer", fontSize:15, fontWeight:700 }}>+</button>
                          <button onClick={() => removeFromCart(item.id)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#ef4444", fontSize:15 }}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length>0 && (
              <div style={{ padding:"16px 20px", borderTop:"1px solid #f0f0f0" }}>
                <button className="btn-primary" onClick={() => { setCartOpen(false); openInquiry({name:"Cart Quote",id:"cart"}); }} style={{ width:"100%", padding:"13px", fontSize:15, marginBottom:8 }}>Request Quote →</button>
                <button onClick={() => setCart([])} style={{ width:"100%", padding:"9px", fontSize:13, background:"none", border:"1.5px solid #e5e7eb", borderRadius:8, cursor:"pointer", color:"#6b7280", fontWeight:600 }}>Clear Cart</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── INQUIRY MODAL ── */}
      {inquiryOpen && (
        <div className="modal-overlay">
          <div onClick={() => setInquiryOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)" }} />
          <div className="modal-box slide-up">
            <div className="modal-drag" />
            <h3 style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>{selectedProduct?.name?`Enquire: ${selectedProduct.name}`:"Quick Enquiry"}</h3>
            <p style={{ fontSize:13, color:"#6b7280", marginBottom:20 }}>We'll call you back within 2 hours.</p>
            {inquiryStatus==="sent" ? (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ fontSize:40, marginBottom:10 }}>✅</div>
                <div style={{ fontSize:17, fontWeight:700, color:"#15803d" }}>Enquiry Sent!</div>
                <div style={{ fontSize:13, color:"#6b7280", marginTop:6 }}>Our team will contact you within 2 hours.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div><label>Name *</label><input placeholder="Your name" value={inquiryForm.name} onChange={e => setInquiryForm({...inquiryForm,name:e.target.value})} /></div>
                  <div><label>Phone *</label><input placeholder="+91 XXXXXXXXXX" value={inquiryForm.phone} onChange={e => setInquiryForm({...inquiryForm,phone:e.target.value})} /></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div><label>Email</label><input type="email" placeholder="your@email.com" value={inquiryForm.email} onChange={e => setInquiryForm({...inquiryForm,email:e.target.value})} /></div>
                  <div><label>Quantity</label><input type="number" min="1" value={inquiryForm.quantity} onChange={e => setInquiryForm({...inquiryForm,quantity:e.target.value})} /></div>
                </div>
                <div><label>Message</label><textarea rows={2} placeholder="Your requirements..." value={inquiryForm.message} onChange={e => setInquiryForm({...inquiryForm,message:e.target.value})} style={{ resize:"none" }} /></div>
                {inquiryStatus==="error" && <div style={{ color:"#ef4444", fontSize:12 }}>Something went wrong. Please try again.</div>}
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn-primary" onClick={submitInquiry} disabled={inquiryStatus==="sending"} style={{ flex:1, padding:"12px", opacity: inquiryStatus==="sending"?0.7:1 }}>
                    {inquiryStatus==="sending"?"Sending...":"Send Enquiry →"}
                  </button>
                  <button onClick={() => setInquiryOpen(false)} style={{ padding:"12px 16px", background:"none", border:"1.5px solid #e5e7eb", borderRadius:8, cursor:"pointer", fontWeight:600, color:"#6b7280" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── REQUEST CALLBACK MODAL ── */}
      {callbackOpen && (
        <div className="modal-overlay">
          <div onClick={() => setCallbackOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)" }} />
          <div className="modal-box slide-up">
            <div className="modal-drag" />
            <div style={{ fontSize:28, marginBottom:8 }}>☎️</div>
            <h3 style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>Request a Callback</h3>
            <p style={{ fontSize:13, color:"#6b7280", marginBottom:20 }}>We'll call you at your preferred time.</p>
            {callbackStatus==="sent" ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>✅</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#15803d" }}>Callback Scheduled!</div>
                <div style={{ fontSize:13, color:"#6b7280", marginTop:6 }}>We'll call you in {callbackForm.time}.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div><label>Name *</label><input placeholder="Your name" value={callbackForm.name} onChange={e => setCallbackForm({...callbackForm,name:e.target.value})} /></div>
                <div><label>Phone *</label><input placeholder="+91 XXXXXXXXXX" value={callbackForm.phone} onChange={e => setCallbackForm({...callbackForm,phone:e.target.value})} /></div>
                <div>
                  <label>Call Me In</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {["15 mins","1 hour","Today"].map(opt => (
                      <button key={opt} onClick={() => setCallbackForm({...callbackForm,time:opt})}
                        style={{ flex:1, padding:"10px 8px", borderRadius:8, border:"2px solid", borderColor: callbackForm.time===opt?primary:"#e5e7eb", background: callbackForm.time===opt?`${primary}15`:"#fff", color: callbackForm.time===opt?primary:"#374151", fontWeight:600, fontSize:13, cursor:"pointer", transition:"all 0.2s" }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="btn-primary" onClick={submitCallback} disabled={callbackStatus==="sending"} style={{ padding:"13px", opacity: callbackStatus==="sending"?0.7:1 }}>
                  {callbackStatus==="sending"?"Scheduling...":"Schedule Callback →"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LEAD CAPTURE POPUP (after 8s) ── */}
      {leadCaptureOpen && leadStatus==="idle" && (
        <div style={{ position:"fixed", inset:0, zIndex:4000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
          <div onClick={() => setLeadCaptureOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)" }} />
          <div style={{ position:"relative", width:"100%", maxWidth:420, background:"#fff", borderRadius:20, padding:"32px 28px", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }} className="slide-up">
            <button onClick={() => setLeadCaptureOpen(false)} style={{ position:"absolute", top:14, right:14, background:"none", border:"none", cursor:"pointer", fontSize:22, color:"#9ca3af" }}>✕</button>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:36, marginBottom:10 }}>🔋</div>
              <h3 style={{ fontSize:20, fontWeight:800, marginBottom:8 }}>Get Free Battery Advice!</h3>
              <p style={{ fontSize:14, color:"#6b7280", lineHeight:1.7 }}>Tell us your name and phone. Our expert will call you with the right battery recommendation — FREE.</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div><label>Name *</label><input placeholder="Your full name" value={leadForm.name} onChange={e => setLeadForm({...leadForm,name:e.target.value})} /></div>
              <div><label>Mobile Number *</label><input placeholder="+91 XXXXXXXXXX" value={leadForm.phone} onChange={e => setLeadForm({...leadForm,phone:e.target.value})} /></div>
              <button className="btn-primary" onClick={submitLead} style={{ padding:"13px", fontSize:15, marginTop:4 }}>Get Free Advice →</button>
              <button onClick={() => setLeadCaptureOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#9ca3af", textDecoration:"underline" }}>No thanks, I'll figure it out myself</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXIT INTENT POPUP ── */}
      {exitPopupOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:4000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
          <div onClick={() => setExitPopupOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)" }} />
          <div style={{ position:"relative", width:"100%", maxWidth:400, background:"#fff", borderRadius:20, padding:"32px 28px", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }} className="slide-up">
            <button onClick={() => setExitPopupOpen(false)} style={{ position:"absolute", top:14, right:14, background:"none", border:"none", cursor:"pointer", fontSize:22, color:"#9ca3af" }}>✕</button>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:36, marginBottom:10 }}>⚡</div>
              <h3 style={{ fontSize:20, fontWeight:800, marginBottom:8, color:primary }}>Wait! Before You Go...</h3>
              <p style={{ fontSize:14, color:"#374151", lineHeight:1.7, fontWeight:600 }}>Get a <span style={{ color:primary }}>FREE Battery Health Check</span> worth ₹500 — absolutely free for new customers!</p>
            </div>
            {exitStatus==="sent" ? (
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#15803d" }}>Great! We'll call you soon.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div><label>Your Mobile Number</label><input placeholder="+91 XXXXXXXXXX" value={exitPhone} onChange={e => setExitPhone(e.target.value)} /></div>
                <button className="btn-primary" onClick={async () => {
                  if (!exitPhone) return;
                  try { await fetch("/api/inquiries", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name:"Exit Intent Lead", phone:exitPhone, message:"Free battery health check request", tenantId:tenant?.id }) }); } catch {}
                  setExitStatus("sent");
                  setTimeout(() => setExitPopupOpen(false), 2000);
                }} style={{ padding:"13px", fontSize:15 }}>Claim Free Health Check →</button>
                <button onClick={() => setExitPopupOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#9ca3af", textDecoration:"underline" }}>No thanks</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}