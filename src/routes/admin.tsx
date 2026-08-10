import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchImages();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchImages();
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
        <h1 className="text-3xl font-bold font-display mb-8">Gallery Management</h1>

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
      </div>
    </div>
  );
}
