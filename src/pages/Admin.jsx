import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { motion } from "framer-motion";
import bgVideo from "../assets/bg.webm";

const API = (import.meta?.env?.VITE_API_BASE) || "http://localhost:5000/api";

export default function Admin() {
  const { token, user } = useAuth();
  const authed = useMemo(() => Boolean(token && user?.role === "ADMIN"), [token, user]);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [catName, setCatName] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "", price: "", imageURL: "", description: "", rating: "5", freshness: "fresh", categoryId: "", stock: "100"
  });

  useEffect(() => {
    fetch(`${API}/categories`).then(r=>r.json()).then(setCategories).catch(()=>{});
  }, []);

  const loadProducts = async (p=1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (query) qs.set("q", query);
      qs.set("page", p); qs.set("limit", 24);
      const res = await fetch(`${API}/products?${qs.toString()}`);
      const data = await res.json();
      setProducts(data.items || []);
      setPages(data.pages || 1);
      setPage(data.page || p);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadProducts(1); }, [query]);

  if (!authed) {
    return (
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <video className="pointer-events-none fixed inset-0 w-full h-full object-cover -z-10" autoPlay muted loop playsInline preload="metadata" src={bgVideo}/>
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
        <div className="relative z-10 max-w-3xl mx-auto p-6 text-white">
          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl p-6">
            Admin only. Please sign in as ADMIN.
          </div>
        </div>
      </div>
    );
  }

  const createCategory = async () => {
    if (!catName.trim()) return;
    const res = await fetch(`${API}/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: catName.trim() })
    });
    if (res.ok) {
      const c = await res.json();
      setCategories(prev => [...prev, c]);
      setCatName("");
      window.dispatchEvent(new CustomEvent("db:changed"));
    } else {
      alert(await res.text().catch(()=> "Add category failed"));
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name:"", price:"", imageURL:"", description:"", rating:"5", freshness:"fresh", categoryId:"", stock:"100" });
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    if (!form.categoryId) {
      alert("Please select a category.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price) || 0,
      imageURL: form.imageURL.trim(),         // must be imageURL
      description: form.description.trim(),
      rating: Number(form.rating) || 0,
      freshness: form.freshness,
      stock: Number(form.stock) || 0,
      categoryId: form.categoryId
    };

    const url = editing ? `${API}/admin/products/${editing}` : `${API}/admin/products`;
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert(await res.text().catch(()=> "Request failed"));
      return;
    }

    resetForm();
    await loadProducts(page);
    window.dispatchEvent(new CustomEvent("db:changed"));
  };

  const editProduct = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name || "",
      price: String(p.price ?? ""),
      imageURL: p.imageURL || "",
      description: p.description || "",
      rating: String(p.rating ?? "5"),
      freshness: p.freshness || "fresh",
      categoryId: p.categoryId || "",
      stock: String(p.stock ?? "100")
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`${API}/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      alert(await res.text().catch(()=> "Delete failed"));
      return;
    }
    await loadProducts(page);
    window.dispatchEvent(new CustomEvent("db:changed"));
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black">
      {/* Background */}
      <video className="pointer-events-none fixed inset-0 w-full h-full object-cover -z-10" autoPlay muted loop playsInline preload="metadata" src={bgVideo}/>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Category Creator */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl p-5 mb-6">
          <h2 className="font-semibold mb-3">Add Category</h2>
          <div className="flex gap-2">
            <input className="flex-1 px-3 py-2 rounded-xl bg-white/15 border border-white/25" value={catName} placeholder="Category name" onChange={(e)=>setCatName(e.target.value)} />
            <button onClick={createCategory} className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600">Add</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map(c => <span key={c._id} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm">{c.name}</span>)}
          </div>
        </div>

        {/* Product Form */}
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl p-5 mb-6">
          <h2 className="font-semibold mb-3">{editing ? "Edit Product" : "Add Product"}</h2>
          <form onSubmit={submitProduct} className="grid md:grid-cols-2 gap-3">
            <input className="px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
            <input className="px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Price" type="number" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})}/>
            <input className="md:col-span-2 px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Image URL" value={form.imageURL} onChange={(e)=>setForm({...form, imageURL:e.target.value})}/>
            <textarea className="md:col-span-2 px-3 py-2 rounded-xl bg-white/15 border border-white/25" rows={3} placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})}/>
            <div className="grid grid-cols-3 gap-3 md:col-span-2">
              <select className="px-3 py-2 rounded-xl bg-white/15 border border-white/25 col-span-3 md:col-span-1" value={form.categoryId} onChange={(e)=>setForm({...form, categoryId:e.target.value})}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input className="px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Rating (0-5)" type="number" step="0.1" value={form.rating} onChange={(e)=>setForm({...form, rating:e.target.value})}/>
              <select className="px-3 py-2 rounded-xl bg-white/15 border border-white/25" value={form.freshness} onChange={(e)=>setForm({...form, freshness:e.target.value})}>
                <option value="fresh">fresh</option>
                <option value="hot">hot</option>
                <option value="cold">cold</option>
              </select>
              <input className="px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Stock" type="number" value={form.stock} onChange={(e)=>setForm({...form, stock:e.target.value})}/>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                disabled={!form.name.trim() || !form.categoryId}
                className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60"
              >
                {editing ? "Update" : "Create"}
              </button>
              {editing && <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl bg-white/15 border border-white/25">Cancel</button>}
            </div>
          </form>
        </motion.div>

        {/* Search + List */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <input className="flex-1 px-3 py-2 rounded-xl bg-white/15 border border-white/25" placeholder="Search products..." value={query} onChange={(e)=>setQuery(e.target.value)} />
            <button onClick={()=>loadProducts(1)} className="px-3 py-2 rounded-xl bg-white/15 border border-white/25">Search</button>
          </div>

          {loading ? (
            <div className="text-white/80">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {products.map((p)=>(
                <div key={p._id} className="rounded-xl bg-white/10 border border-white/20 p-3">
                  <img src={p.imageURL} alt={p.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-white/80 truncate">{p.description}</div>
                  <div className="mt-1 text-pink-300 font-bold">${Number(p.price).toFixed(2)}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={()=>editProduct(p)} className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white">Edit</button>
                    <button onClick={()=>deleteProduct(p._id)} className="px-3 py-1.5 rounded-lg bg-rose-500 text-white">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button disabled={page<=1} onClick={()=>loadProducts(page-1)} className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/25 disabled:opacity-50">Prev</button>
            <span className="px-2 py-1">{page} / {pages}</span>
            <button disabled={page>=pages} onClick={()=>loadProducts(page+1)} className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/25 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
