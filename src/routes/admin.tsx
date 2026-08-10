import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "VISO | Admin Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Gallery state
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Core Values state
  const [coreValues, setCoreValues] = useState<any[]>([]);
  const [cvTitle, setCvTitle] = useState("");
  const [cvDesc, setCvDesc] = useState("");
  const [cvPoints, setCvPoints] = useState("");
  const [cvImageUrl, setCvImageUrl] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const seedAttempted = useRef(false);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<"gallery" | "core_values" | "homepage">("gallery");

  // CMS State
  const [cmsSection, setCmsSection] = useState<"hero" | "about" | "areas" | "services" | "framework" | "showcase" | "clients">("hero");
  const [heroData, setHeroData] = useState({ title1: "DESIGNING", title2: "THE FUTURE", subtitle: "We are an elite firm...", desc: "Integrating security...", images: ["", "", ""] });
  const [aboutData, setAboutData] = useState({ title1: "THE ARCHITECTURE", title2: "OF SECURITY", desc: "Our methodology..." });
  const [areasData, setAreasData] = useState<{ title: string, subtitle: string, items: any[] }>({ title: "AREAS WE SERVE", subtitle: "Strategic geographic deployment...", items: [] });
  const [servicesData, setServicesData] = useState<{ title1: string, title2: string, desc: string, items: any[] }>({ title1: "Architectural", title2: "Precision.", desc: "Our approach favors...", items: [] });
  const [frameworkData, setFrameworkData] = useState<{ titleMono: string, title1: string, title2: string, desc: string, items: any[] }>({ titleMono: "OUR METHODOLOGY", title1: "The Architecture", title2: "Of Security", desc: "A phased approach...", items: [] });
  const [showcaseData, setShowcaseData] = useState<{ imageUrl: string }>({ imageUrl: "" });
  const [clientsData, setClientsData] = useState<{ titleMono: string, title1: string, title2: string, items: any[] }>({ titleMono: "Trusted By", title1: "Industry", title2: "Titans.", items: [] });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        fetchImages();
        fetchCoreValues();
        fetchCmsData();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchImages();
        fetchCoreValues();
        fetchCmsData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setLoginError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) console.error("Error fetching images:", error);
    else setImages(data || []);
  };

  const fetchCoreValues = async () => {
    const { data, error } = await supabase
      .from("core_values")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Error fetching core values:", error);
    } else {
      if (data && data.length === 0 && !seedAttempted.current) {
        seedAttempted.current = true;
        handleSeedCoreValues();
      } else {
        setCoreValues(data || []);
      }
    }
  };

  const fetchCmsData = async () => {
    const { data, error } = await supabase.from('cms_content').select('*');
    if (!error && data) {
      data.forEach(row => {
        if (row.section_key === 'hero') setHeroData(row.content);
        if (row.section_key === 'about') setAboutData(row.content);
        if (row.section_key === 'areas') setAreasData(row.content);
        if (row.section_key === 'services') setServicesData(row.content);
        if (row.section_key === 'framework') setFrameworkData(row.content);
        if (row.section_key === 'showcase') setShowcaseData(row.content);
        if (row.section_key === 'clients') setClientsData(row.content);
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    
    // 1. Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Error uploading file.");
      setUploading(false);
      return;
    }

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    // 3. Save to database
    const { error: dbError } = await supabase
      .from('gallery_images')
      .insert([{ image_url: publicUrl }]);

    if (dbError) {
      console.error("Database error:", dbError);
      alert("Error saving image to database.");
    } else {
      fetchImages(); // Refresh list
    }
    
    setUploading(false);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    // 1. Delete from database
    await supabase.from('gallery_images').delete().eq('id', id);

    // 2. Extract filename from URL and delete from storage
    try {
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('gallery').remove([fileName]);
    } catch (err) {
      console.error("Could not delete from storage", err);
    }

    fetchImages(); // Refresh list
  };

  const handleCoreValueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = (e.currentTarget.elements.namedItem("cvImage") as HTMLInputElement);
    let publicUrl = cvImageUrl;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      setCvUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `cv_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Error uploading file.");
        setCvUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      publicUrl = data.publicUrl;
    }

    if (!publicUrl) {
      alert("Please provide an image URL or upload a file.");
      return;
    }

    setCvUploading(true);
    const pointsArray = cvPoints.split(",").map(p => p.trim()).filter(p => p !== "");
    
    if (editingId) {
      const { error: dbError } = await supabase
        .from('core_values')
        .update({ 
          title: cvTitle, 
          description: cvDesc, 
          points: pointsArray, 
          image_url: publicUrl 
        })
        .eq('id', editingId);

      if (dbError) {
        console.error("Database error:", dbError);
        alert("Error updating core value.");
      } else {
        handleCancelEdit();
        if (fileInput) fileInput.value = "";
        fetchCoreValues();
      }
    } else {
      const { error: dbError } = await supabase
        .from('core_values')
        .insert([{ 
          title: cvTitle, 
          description: cvDesc, 
          points: pointsArray, 
          image_url: publicUrl 
        }]);

      if (dbError) {
        console.error("Database error:", dbError);
        alert("Error saving core value to database.");
      } else {
        handleCancelEdit();
        if (fileInput) fileInput.value = "";
        fetchCoreValues();
      }
    }
    
    setCvUploading(false);
  };

  const handleEdit = (cv: any) => {
    setEditingId(cv.id);
    setCvTitle(cv.title);
    setCvDesc(cv.description);
    setCvPoints(cv.points ? cv.points.join(", ") : "");
    setCvImageUrl(cv.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCvTitle("");
    setCvDesc("");
    setCvPoints("");
    setCvImageUrl("");
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...coreValues];
    const temp = newArr[index];
    newArr[index] = newArr[index - 1];
    newArr[index - 1] = temp;
    setCoreValues(newArr);
    setOrderChanged(true);
  };

  const handleMoveDown = (index: number) => {
    if (index === coreValues.length - 1) return;
    const newArr = [...coreValues];
    const temp = newArr[index];
    newArr[index] = newArr[index + 1];
    newArr[index + 1] = temp;
    setCoreValues(newArr);
    setOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    const now = Date.now();
    // Rewrite created_at to strictly increasing dates based on current visual order
    const promises = coreValues.map((cv, index) => {
      // Each item gets a date 1 second later than the previous
      const newDate = new Date(now + index * 1000).toISOString();
      return supabase.from('core_values').update({ created_at: newDate }).eq('id', cv.id);
    });

    try {
      await Promise.all(promises);
      setOrderChanged(false);
      fetchCoreValues();
    } catch (err) {
      console.error("Failed to save order", err);
      alert("Failed to save order.");
    }
  };

  const handleCancelOrder = () => {
    setOrderChanged(false);
    fetchCoreValues();
  };

  const handleDeleteCoreValue = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this core value?")) return;

    // 1. Delete from database
    await supabase.from('core_values').delete().eq('id', id);

    // 2. Extract filename from URL and delete from storage
    try {
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('gallery').remove([fileName]);
    } catch (err) {
      console.error("Could not delete from storage", err);
    }

    fetchCoreValues(); // Refresh list
  };

  const handleSeedCoreValues = async () => {
    const seedData = [
      { 
        title: "Honesty & Integrity", 
        description: "Our guiding philosophy revolves around transparency and professionalism. We remain prudent and fair in dealing with all stakeholders.", 
        points: ["Transparent Communication", "Uncompromising Ethics", "Fair Stakeholder Practices"], 
        image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80" 
      },
      { 
        title: "Customer Excellence", 
        description: "We strive to fully understand our clients' needs to deliver tailored, premium security solutions that exceed expectations.", 
        points: ["Tailored Security Solutions", "Proactive Client Support", "Exceeding Expectations"], 
        image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" 
      },
      { 
        title: "Leadership & Prudence", 
        description: "As we build a robust security culture, we optimize resources and lead by example in setting industry standards.", 
        points: ["Robust Security Culture", "Resource Optimization", "Setting Industry Standards"], 
        image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" 
      },
      { 
        title: "Innovation & Change", 
        description: "We are an organization in constant progress, continuously adapting to new threats and integrating cutting-edge technologies.", 
        points: ["Continuous Progress", "Threat Adaptation", "Cutting-Edge Technologies"], 
        image_url: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=400&q=80" 
      }
    ];

    const { error } = await supabase.from('core_values').insert(seedData);
    if (error) {
      console.error("Seed error:", error);
      alert("Failed to seed core values. Did you create the table?");
    } else {
      fetchCoreValues();
    }
  };

  const handleSaveCmsSection = async (section: string, data: any) => {
    try {
      const { data: existing } = await supabase
        .from('cms_content')
        .select('id')
        .eq('section_key', section)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('cms_content')
          .update({ content: data })
          .eq('section_key', section);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cms_content')
          .insert([{ section_key: section, content: data }]);
        if (error) throw error;
      }
      alert(`${section} section saved successfully!`);
    } catch (error: any) {
      console.error("Error saving CMS section:", error);
      alert(`Failed to save ${section} section: ` + error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
        <div className="absolute top-6 right-8">
          <ThemeToggle />
        </div>
        <div className="max-w-md w-full bg-foreground/5 p-8 rounded-xl border border-foreground/10 text-center">
          <div className="flex justify-center mb-6">
            <img src="https://res.cloudinary.com/dcefror3c/image/upload/v1782911668/Luxurious_black_and_gold_logo_design_kjv4np.png" alt="VISO Logo" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-bold mb-6 font-display">Admin Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded bg-background border border-foreground/20 focus:outline-none focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors mt-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Nav */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-foreground/5 bg-foreground/5">
        <div className="flex items-center gap-4">
          <img src="https://res.cloudinary.com/dcefror3c/image/upload/v1782911668/Luxurious_black_and_gold_logo_design_kjv4np.png" alt="VISO Logo" className="h-8 w-auto object-contain" />
          <span className="font-bold text-lg hidden sm:block">Admin Console</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8 mt-8">
        <div className="flex gap-6 border-b border-foreground/10 mb-8 pb-2">
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === 'gallery' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
            >
              Gallery Management
            </button>
            <button
              onClick={() => setActiveTab("core_values")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === 'core_values' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
            >
              Core Values
            </button>
            <button
              onClick={() => setActiveTab("homepage")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === 'homepage' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
            >
              Homepage CMS
            </button>
        </div>

        {activeTab === 'gallery' && (
          <>
            <div className="bg-foreground/5 p-6 rounded-xl border border-foreground/10 mb-8">
              <h2 className="text-xl mb-4">Upload New Image</h2>
              <label className="cursor-pointer inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                {uploading ? 'Uploading...' : 'Select File'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            <h2 className="text-xl mb-4">Current Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-foreground/10 aspect-square">
                  <img src={img.image_url} alt="Gallery item" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(img.id, img.image_url)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {images.length === 0 && (
                <p className="text-foreground/60 col-span-full">No images in the gallery yet.</p>
              )}
            </div>
          </>
        )}

        {activeTab === 'core_values' && (
          <>
            <div className="bg-foreground/5 p-6 rounded-xl border border-foreground/10 mb-8">
              <h2 className="text-xl mb-4">{editingId ? 'Edit Core Value' : 'Add New Core Value'}</h2>
              <form onSubmit={handleCoreValueSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={cvTitle}
                    onChange={(e) => setCvTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={cvDesc}
                    onChange={(e) => setCvDesc(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:outline-none focus:border-primary h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Points (Comma separated)</label>
                  <input
                    type="text"
                    value={cvPoints}
                    placeholder="e.g. Transparent Communication, Uncompromising Ethics"
                    onChange={(e) => setCvPoints(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={cvImageUrl}
                    placeholder="https://example.com/image.jpg"
                    onChange={(e) => setCvImageUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground/70 text-xs text-center my-2">OR UPLOAD IMAGE</label>
                  <input
                    type="file"
                    name="cvImage"
                    accept="image/*"
                    className="w-full px-4 py-2 rounded bg-background border border-foreground/20"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={cvUploading}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                  >
                    {cvUploading ? 'Saving...' : editingId ? 'Update Core Value' : 'Add Core Value'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-foreground/10 text-foreground px-4 py-2 rounded hover:bg-foreground/20 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Current Core Values</h2>
              {orderChanged && (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelOrder}
                    className="bg-foreground/10 text-foreground px-4 py-2 rounded hover:bg-foreground/20 transition-colors text-sm"
                  >
                    Cancel Reorder
                  </button>
                  <button
                    onClick={handleSaveOrder}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors text-sm shadow-lg shadow-primary/20"
                  >
                    Save New Order
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {coreValues.map((cv, i) => (
                <div key={cv.id} className="flex gap-6 bg-surface p-6 rounded-xl border border-foreground/10 items-center">
                  <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden border border-foreground/10">
                    <img src={cv.image_url} alt={cv.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-display mb-2">{cv.title}</h3>
                    <p className="text-sm text-foreground/70 mb-2">{cv.description}</p>
                    {cv.points && cv.points.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-foreground/50">
                        {cv.points.map((p: string, idx: number) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => handleMoveUp(i)}
                        disabled={i === 0}
                        className="bg-foreground/5 text-foreground border border-foreground/10 px-3 py-1 rounded hover:bg-foreground/10 transition-colors text-xs flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ▲ Up
                      </button>
                      <button
                        onClick={() => handleMoveDown(i)}
                        disabled={i === coreValues.length - 1}
                        className="bg-foreground/5 text-foreground border border-foreground/10 px-3 py-1 rounded hover:bg-foreground/10 transition-colors text-xs flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ▼ Down
                      </button>
                    </div>
                    <button
                      onClick={() => handleEdit(cv)}
                      className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCoreValue(cv.id, cv.image_url)}
                      className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {coreValues.length === 0 && (
                <p className="text-foreground/60 p-6 bg-foreground/5 rounded-xl border border-foreground/10 text-center">
                  No core values added yet. The system is attempting to auto-seed them.
                </p>
              )}
            </div>
          </>
        )}

        {activeTab === 'homepage' && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* CMS Sidebar */}
            <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
              <h3 className="font-bold text-foreground/60 mb-2 uppercase tracking-widest text-xs">Sections</h3>
              <button
                onClick={() => setCmsSection('hero')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'hero' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Hero Section
              </button>
              <button
                onClick={() => setCmsSection('about')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'about' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                About Section
              </button>
              <button
                onClick={() => setCmsSection('areas')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'areas' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Areas We Serve
              </button>
              <button
                onClick={() => setCmsSection('services')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'services' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Services
              </button>
              <button
                onClick={() => setCmsSection('framework')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'framework' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Framework
              </button>
              <button
                onClick={() => setCmsSection('showcase')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'showcase' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Showcase
              </button>
              <button
                onClick={() => setCmsSection('clients')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'clients' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Clients
              </button>
            </div>

            {/* CMS Editor Area */}
            <div className="flex-1 bg-surface p-6 rounded-xl border border-foreground/10">
              {cmsSection === 'hero' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-display mb-4">Edit Hero Section</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title Part 1</label>
                    <input
                      type="text"
                      value={heroData.title1}
                      onChange={(e) => setHeroData({ ...heroData, title1: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title Part 2 (Italicized)</label>
                    <input
                      type="text"
                      value={heroData.title2}
                      onChange={(e) => setHeroData({ ...heroData, title2: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <textarea
                      value={heroData.subtitle}
                      onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={heroData.desc}
                      onChange={(e) => setHeroData({ ...heroData, desc: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-24"
                    />
                  </div>
                  <div className="pt-4 mt-4 border-t border-foreground/10">
                    <label className="block text-sm font-medium mb-3">Hero Background Images (3 URLs)</label>
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="mb-3">
                        <input
                          type="url"
                          placeholder={`Image URL ${idx + 1}`}
                          value={heroData.images[idx] || ""}
                          onChange={(e) => {
                            const newImages = [...heroData.images];
                            newImages[idx] = e.target.value;
                            setHeroData({ ...heroData, images: newImages });
                          }}
                          className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('hero', heroData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Hero Section
                  </button>
                </div>
              )}

              {cmsSection === 'about' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-display mb-4">Edit About Section</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title Part 1</label>
                    <input
                      type="text"
                      value={aboutData.title1}
                      onChange={(e) => setAboutData({ ...aboutData, title1: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title Part 2 (Italicized)</label>
                    <input
                      type="text"
                      value={aboutData.title2}
                      onChange={(e) => setAboutData({ ...aboutData, title2: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description Paragraph</label>
                    <textarea
                      value={aboutData.desc}
                      onChange={(e) => setAboutData({ ...aboutData, desc: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-40"
                    />
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('about', aboutData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save About Section
                  </button>
                </div>
              )}
              {cmsSection === 'areas' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-display mb-4">Edit Areas We Serve</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Title</label>
                      <input
                        type="text"
                        value={areasData.title}
                        onChange={(e) => setAreasData({ ...areasData, title: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Subtitle</label>
                      <input
                        type="text"
                        value={areasData.subtitle}
                        onChange={(e) => setAreasData({ ...areasData, subtitle: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Area Cards</h3>
                      <button
                        onClick={() => setAreasData({ ...areasData, items: [...areasData.items, { title: "", desc: "", image_url: "" }] })}
                        className="bg-primary/20 text-primary px-4 py-2 rounded text-sm hover:bg-primary/30 transition-colors"
                      >
                        + Add Area
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {areasData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative">
                          <button
                            onClick={() => {
                              const newItems = [...areasData.items];
                              newItems.splice(idx, 1);
                              setAreasData({ ...areasData, items: newItems });
                            }}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold"
                          >
                            Remove
                          </button>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-bold mb-1 opacity-70">Area Title</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const newItems = [...areasData.items];
                                  newItems[idx].title = e.target.value;
                                  setAreasData({ ...areasData, items: newItems });
                                }}
                                className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold mb-1 opacity-70">Icon Image URL</label>
                              <input
                                type="text"
                                value={item.image_url}
                                placeholder="Leave blank to use default SVG"
                                onChange={(e) => {
                                  const newItems = [...areasData.items];
                                  newItems[idx].image_url = e.target.value;
                                  setAreasData({ ...areasData, items: newItems });
                                }}
                                className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1 opacity-70">Description</label>
                            <textarea
                              value={item.desc}
                              onChange={(e) => {
                                const newItems = [...areasData.items];
                                newItems[idx].desc = e.target.value;
                                setAreasData({ ...areasData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-20"
                            />
                          </div>
                        </div>
                      ))}
                      {areasData.items.length === 0 && (
                        <div className="text-center p-8 text-foreground/50 border border-dashed border-foreground/20 rounded">
                          No area cards added yet. The default SVGs will be used on the homepage.
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveCmsSection('areas', areasData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Areas We Serve
                  </button>
                </div>
              )}

              {/* SERVICES CMS */}
              {cmsSection === 'services' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-display mb-4">Edit Services</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 1</label>
                      <input
                        type="text"
                        value={servicesData.title1}
                        onChange={(e) => setServicesData({ ...servicesData, title1: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 2 (Italic)</label>
                      <input
                        type="text"
                        value={servicesData.title2}
                        onChange={(e) => setServicesData({ ...servicesData, title2: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={servicesData.desc}
                      onChange={(e) => setServicesData({ ...servicesData, desc: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-20"
                    />
                  </div>
                  
                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Service Items</h3>
                      <button
                        onClick={() => setServicesData({ ...servicesData, items: [...servicesData.items, { num: "0" + (servicesData.items.length + 1), title: "", desc: "" }] })}
                        className="bg-primary/20 text-primary px-4 py-2 rounded text-sm hover:bg-primary/30 transition-colors"
                      >
                        + Add Service
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {servicesData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative grid grid-cols-12 gap-4">
                          <button
                            onClick={() => {
                              const newItems = [...servicesData.items];
                              newItems.splice(idx, 1);
                              setServicesData({ ...servicesData, items: newItems });
                            }}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold"
                          >
                            Remove
                          </button>
                          <div className="col-span-2">
                            <label className="block text-xs font-bold mb-1 opacity-70">Num</label>
                            <input
                              type="text"
                              value={item.num}
                              onChange={(e) => {
                                const newItems = [...servicesData.items];
                                newItems[idx].num = e.target.value;
                                setServicesData({ ...servicesData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div className="col-span-10">
                            <label className="block text-xs font-bold mb-1 opacity-70">Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...servicesData.items];
                                newItems[idx].title = e.target.value;
                                setServicesData({ ...servicesData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none mb-2"
                            />
                            <label className="block text-xs font-bold mb-1 opacity-70">Description</label>
                            <textarea
                              value={item.desc}
                              onChange={(e) => {
                                const newItems = [...servicesData.items];
                                newItems[idx].desc = e.target.value;
                                setServicesData({ ...servicesData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-16"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('services', servicesData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Services
                  </button>
                </div>
              )}

              {/* FRAMEWORK CMS */}
              {cmsSection === 'framework' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-display mb-4">Edit Framework Section</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Small Top Title</label>
                    <input
                      type="text"
                      value={frameworkData.titleMono}
                      onChange={(e) => setFrameworkData({ ...frameworkData, titleMono: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 1</label>
                      <input
                        type="text"
                        value={frameworkData.title1}
                        onChange={(e) => setFrameworkData({ ...frameworkData, title1: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 2 (Italic)</label>
                      <input
                        type="text"
                        value={frameworkData.title2}
                        onChange={(e) => setFrameworkData({ ...frameworkData, title2: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={frameworkData.desc}
                      onChange={(e) => setFrameworkData({ ...frameworkData, desc: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-20"
                    />
                  </div>

                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Framework Stages</h3>
                      <button
                        onClick={() => setFrameworkData({ ...frameworkData, items: [...frameworkData.items, { id: Date.now(), num: "0" + (frameworkData.items.length + 1), title: "", subtitle: "" }] })}
                        className="bg-primary/20 text-primary px-4 py-2 rounded text-sm hover:bg-primary/30 transition-colors"
                      >
                        + Add Stage
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {frameworkData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative grid grid-cols-12 gap-4">
                          <button
                            onClick={() => {
                              const newItems = [...frameworkData.items];
                              newItems.splice(idx, 1);
                              setFrameworkData({ ...frameworkData, items: newItems });
                            }}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold"
                          >
                            Remove
                          </button>
                          <div className="col-span-2">
                            <label className="block text-xs font-bold mb-1 opacity-70">Num</label>
                            <input
                              type="text"
                              value={item.num}
                              onChange={(e) => {
                                const newItems = [...frameworkData.items];
                                newItems[idx].num = e.target.value;
                                setFrameworkData({ ...frameworkData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div className="col-span-10">
                            <label className="block text-xs font-bold mb-1 opacity-70">Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...frameworkData.items];
                                newItems[idx].title = e.target.value;
                                setFrameworkData({ ...frameworkData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none mb-2"
                            />
                            <label className="block text-xs font-bold mb-1 opacity-70">Subtitle</label>
                            <textarea
                              value={item.subtitle}
                              onChange={(e) => {
                                const newItems = [...frameworkData.items];
                                newItems[idx].subtitle = e.target.value;
                                setFrameworkData({ ...frameworkData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-16"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('framework', frameworkData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Framework
                  </button>
                </div>
              )}

              {/* SHOWCASE CMS */}
              {cmsSection === 'showcase' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-display mb-4">Edit Showcase Section</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Background Image URL</label>
                    <input
                      type="url"
                      value={showcaseData.imageUrl}
                      placeholder="https://images.unsplash.com/..."
                      onChange={(e) => setShowcaseData({ imageUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                    {showcaseData.imageUrl && (
                       <img src={showcaseData.imageUrl} alt="Showcase Preview" className="mt-4 w-full h-48 object-cover rounded" />
                    )}
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('showcase', showcaseData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Showcase
                  </button>
                </div>
              )}

              {/* CLIENTS CMS */}
              {cmsSection === 'clients' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-display mb-4">Edit Clients Section</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Small Top Title</label>
                    <input
                      type="text"
                      value={clientsData.titleMono}
                      onChange={(e) => setClientsData({ ...clientsData, titleMono: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 1</label>
                      <input
                        type="text"
                        value={clientsData.title1}
                        onChange={(e) => setClientsData({ ...clientsData, title1: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 2 (Italic)</label>
                      <input
                        type="text"
                        value={clientsData.title2}
                        onChange={(e) => setClientsData({ ...clientsData, title2: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Clients</h3>
                      <button
                        onClick={() => setClientsData({ ...clientsData, items: [...clientsData.items, { name: "", sector: "", icon: "🏢" }] })}
                        className="bg-primary/20 text-primary px-4 py-2 rounded text-sm hover:bg-primary/30 transition-colors"
                      >
                        + Add Client
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientsData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative">
                          <button
                            onClick={() => {
                              const newItems = [...clientsData.items];
                              newItems.splice(idx, 1);
                              setClientsData({ ...clientsData, items: newItems });
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
                          >
                            X
                          </button>
                          
                          <div className="grid grid-cols-[3rem_1fr] gap-3">
                            <div>
                              <label className="block text-xs font-bold mb-1 opacity-70">Icon</label>
                              <input
                                type="text"
                                value={item.icon}
                                onChange={(e) => {
                                  const newItems = [...clientsData.items];
                                  newItems[idx].icon = e.target.value;
                                  setClientsData({ ...clientsData, items: newItems });
                                }}
                                className="w-full px-2 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold mb-1 opacity-70">Name</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const newItems = [...clientsData.items];
                                  newItems[idx].name = e.target.value;
                                  setClientsData({ ...clientsData, items: newItems });
                                }}
                                className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none mb-2"
                              />
                              <label className="block text-xs font-bold mb-1 opacity-70">Sector</label>
                              <input
                                type="text"
                                value={item.sector}
                                onChange={(e) => {
                                  const newItems = [...clientsData.items];
                                  newItems[idx].sector = e.target.value;
                                  setClientsData({ ...clientsData, items: newItems });
                                }}
                                className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('clients', clientsData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Clients
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
