"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Admin access");

  async function login(event: React.FormEvent) {
    event.preventDefault();

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setStatus(error.message);
    else router.push("/admin");
  }

  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#f8fafc] px-4 py-16">
      <form onSubmit={login} className="glass w-full max-w-md rounded-[8px] p-8">
        <div className="brand-gradient mb-5 inline-flex rounded-full p-3 text-white"><Lock size={22} /></div>
        <h1 className="text-4xl text-[#21183d]">Admin Login</h1>
        <p className="mt-2 text-sm text-[#6b6680]">{status}</p>
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="focus-ring mt-6 min-h-12 w-full rounded-[8px] border border-[#4b328b]/10 px-4" />
        <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="focus-ring mt-3 min-h-12 w-full rounded-[8px] border border-[#4b328b]/10 px-4" />
        <Button className="mt-5 w-full" type="submit">Sign in</Button>
      </form>
    </main>
  );
}
