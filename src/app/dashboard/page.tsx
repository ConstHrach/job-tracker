import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  // Check if the user is logged in
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get the logged in user and their job applications
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { applications: { orderBy: { appliedAt: "desc" } } },
  });

  const applications = user?.applications || [];

  // Count applications by status
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "Applied").length,
    interviewing: applications.filter((a) => a.status === "Interviewing").length,
    offered: applications.filter((a) => a.status === "Offered").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  return (
    <div className="min-h-screen bg-[#09090f] text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">JobTracker</span>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{session.user.email}</span>
          <a
            href="/api/auth/signout"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign out
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">Track your job applications</p>
          </div>
          <a
            href="/dashboard/new"
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors"
          >
            + Add Application
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "Applied", value: stats.applied, color: "text-blue-400" },
            { label: "Interviewing", value: stats.interviewing, color: "text-yellow-400" },
            { label: "Offered", value: stats.offered, color: "text-green-400" },
            { label: "Rejected", value: stats.rejected, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-xl">
            <p className="text-gray-400 text-lg mb-4">No applications yet</p>
            <a
              href="/dashboard/new"
              className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors"
            >
              Add your first application
            </a>
          </div>
        ) : (
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-gray-400 font-medium">Company</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400 font-medium">Role</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400 font-medium">Type</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{app.company}</td>
                    <td className="px-6 py-4 text-gray-300">{app.role}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{app.jobType || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        app.status === "Applied" ? "bg-blue-500/20 text-blue-400" :
                        app.status === "Interviewing" ? "bg-yellow-500/20 text-yellow-400" :
                        app.status === "Offered" ? "bg-green-500/20 text-green-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
