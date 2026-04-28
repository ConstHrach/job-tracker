"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    jobType: "",
    location: "",
    salary: "",
    jobUrl: "",
    notes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090f] text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">JobTracker</span>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
          Back to Dashboard
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Add Application</h1>
        <p className="text-gray-400 mb-8">Log a new job application</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Company *</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Role *</label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#09090f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Job Type</label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#09090f] border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
              >
                <option value="">Select type...</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Co-op">Co-op</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Remote, New York"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500 placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Salary Range</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. $120k - $150k"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500 placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Job URL</label>
              <input
                name="jobUrl"
                value={form.jobUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500 placeholder:text-gray-600"
              />
            </div>
          </div>


          <div>
            <label className="text-sm text-gray-400 mb-1 block">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Any notes about this application..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500 placeholder:text-gray-600 resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? "Saving..." : "Save Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
