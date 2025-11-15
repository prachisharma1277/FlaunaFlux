import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Light Green Background (new clean theme) ---
const bgImage =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60"; // soft green forest bg

const userAvatar = "https://placehold.co/100x100/166534/FFFFFF?text=A";

// --- Inline SVG Icons (unchanged) ---
const IconReport = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.875c0-.621.504-1.125 1.125-1.125H6.75M12 2.25c-2.485 0-4.5 2.015-4.5 4.5s4.5 7.5 4.5 7.5 4.5-5.015 4.5-7.5S14.485 2.25 12 2.25z" />
  </svg>
);

const IconDonate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79c-.23.012-.46.02-.69.02a9.75 9.75 0 01-9.06-6.32 9.75 9.75 0 00-9.06 6.32c-.23-.008-.46-.016-.69-.02 1.03-.63 2.16-1 3.39-1 .85 0 1.67.11 2.45.32l.68.16-.24-.64A9.75 9.75 0 0112 4.63a9.75 9.75 0 015.42 1.66l-.24.64.68-.16c.78-.21 1.6-.32 2.45-.32 1.23 0 2.36.37 3.39 1zM12 15.75c-1.38 0-2.67-.35-3.83-.95l-.68-.36-.36.68c-.6 1.15-.95 2.44-.95 3.83 0 .85.11 1.67.32 2.45l.16.68-.64-.24a9.75 9.75 0 01-6.32-9.06c.012-.23.02-.46.02-.69 0-1.23.37-2.36 1-3.39.62-1.03 1.45-1.95 2.43-2.7A9.75 9.75 0 0112 2.63a9.75 9.75 0 019.06 1.42c.98.75 1.81 1.67 2.43 2.7.63 1.03 1 2.16 1 3.39 0 .23-.008.46-.02.69a9.75 9.75 0 01-6.32 9.06l-.64.24.16-.68c.21-.78.32-1.6.32-2.45 0-1.38-.35-2.67-.95-3.83l-.36-.68.68.36c1.16.6 2.45.95 3.83.95z" />
  </svg>
);

const IconFollowing = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632zM18.375 16.125a7.5 7.5 0 00-12.75 0" />
  </svg>
);

const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-.994h2.593c.55 0 1.02.452 1.11.994l.213 1.281c.063.374.313.686.645.87.325.196.72.257 1.075.124l1.217-.456c.476-.178 1.02.13 1.2.6.18.47.146 1.022-.084 1.443l-.86.969c-.203.23-.3.52-.3.812v.214c0 .292.097.582.3.812l.86.969c.23.421.264.973.084 1.443-.18.47-.724.778-1.2.6l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.47 6.47 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.28c-.09.543-.56 1.004-1.11.994h-2.593c-.55 0-1.02-.452-1.11-.994l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456c-.476.178-1.02-.13-1.2-.6-.18-.47-.146-1.022.084-1.443l.86-.969c.203-.23.3-.52.3-.812v-.214c0-.292-.097-.582-.3-.812l-.86-.969c-.23-.421-.264-.973-.084-1.443.18-.47.724-.778 1.2-.6l1.217.456c.355.133.75.072 1.075-.124.073-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281zM12 15a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const IconReceipt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// --- Mock Data ---
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  joinDate: "March 15, 2024",
  stats: {
    reports: 12,
    donations: 3,
    following: 8,
  },
};

const mockReports = [
  { id: 1, species: "Malabar Pied Hornbill", date: "2025-11-10", status: "Approved", img: "https://placehold.co/100x100/AFE7C3/166534?text=Hornbill" },
  { id: 2, species: "Nilgiri Tahr", date: "2025-11-02", status: "Pending", img: "https://placehold.co/100x100/E2F5E9/166534?text=Tahr" },
  { id: 3, species: "Forest Owlet", date: "2025-10-21", status: "Approved", img: "https://placehold.co/100x100/AFE7C3/166534?text=Owlet" },
];

const mockDonations = [
  { id: 1, amount: 50.0, date: "2025-10-01", cause: "Tiger Conservation Fund" },
  { id: 2, amount: 25.0, date: "2025-07-14", cause: "Wetland Restoration Project" },
  { id: 3, amount: 100.0, date: "2025-04-22", cause: "Himalayan Reforestation" },
];

const mockFollowing = [
  { id: 1, name: "Dr. Anya Sharma", title: "Lead Biologist", avatar: "https://placehold.co/60x60/166534/FFFFFF?text=AS" },
  { id: 2, name: "Rohan Gupta", title: "Photographer", avatar: "https://placehold.co/60x60/166534/FFFFFF?text=RG" },
  { id: 3, name: "Conservation Intl.", title: "Organization", avatar: "https://placehold.co/60x60/166534/FFFFFF?text=CI" },
];

// --- Helper Input Component ---
const FormInput = ({ label, type, placeholder, value }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      className="w-full border rounded-md p-3 bg-white border-green-300 
      focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
    />
  </div>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("reports");

  const tabVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* VERY LIGHT green overlay */}
      <div className="absolute inset-0 bg-[#EAF7EE]/70 backdrop-blur-sm"></div>

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Profile Header */}
        <div className="bg-white/95 rounded-2xl shadow-xl border border-green-200 p-8 flex flex-col md:flex-row items-center gap-6 backdrop-blur-md">
          <img src={userAvatar} className="w-28 h-28 md:w-36 md:h-36 rounded-full shadow-lg border-4 border-white" />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900">{mockUser.name}</h1>
            <p className="text-gray-600">{mockUser.email}</p>
            <p className="text-sm text-gray-500">Member since {mockUser.joinDate}</p>
          </div>

          <div className="flex gap-8 pt-4 md:pt-0 md:border-l border-green-200 md:pl-8">
            <Stat label="Reports" value={mockUser.stats.reports} />
            <Stat label="Donations" value={mockUser.stats.donations} />
            <Stat label="Following" value={mockUser.stats.following} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 mb-6 border-b border-green-300">
          <nav className="flex gap-6">
            <Tab title="My Reports" icon={<IconReport />} active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
            <Tab title="My Donations" icon={<IconDonate />} active={activeTab === "donations"} onClick={() => setActiveTab("donations")} />
            <Tab title="Following" icon={<IconFollowing />} active={activeTab === "following"} onClick={() => setActiveTab("following")} />
            <Tab title="Settings" icon={<IconSettings />} active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white/95 rounded-2xl border border-green-200 p-8 shadow-lg backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeTab === "reports" && <Reports />}
              {activeTab === "donations" && <Donations />}
              {activeTab === "following" && <Following />}
              {activeTab === "settings" && <Settings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub Components ---
const Stat = ({ label, value }) => (
  <div className="text-center">
    <h3 className="text-3xl font-bold text-green-700">{value}</h3>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const Tab = ({ title, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all ${
      active ? "text-green-700 border-b-4 border-green-700" : "text-gray-600 hover:text-green-700"
    }`}
  >
    {icon} {title}
  </button>
);

// Reports
const Reports = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-5">My Sighting Reports</h2>

    <div className="space-y-4">
      {mockReports.map((r) => (
        <div key={r.id} className="flex items-center gap-4 p-4 border border-green-200 bg-white rounded-xl shadow-sm">
          <img src={r.img} className="w-16 h-16 rounded-lg object-cover" />

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{r.species}</h3>
            <p className="text-sm text-gray-500">Reported on: {r.date}</p>
          </div>

          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
            r.status === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}>
            {r.status}
          </span>

          <IconChevronRight />
        </div>
      ))}
    </div>
  </div>
);

// Donations
const Donations = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-5">My Donations</h2>

    <table className="min-w-full text-left border-collapse">
      <thead className="bg-green-50 border-b border-green-200">
        <tr>
          <th className="py-2 px-3">Cause</th>
          <th className="py-2 px-3">Amount</th>
          <th className="py-2 px-3">Date</th>
          <th className="py-2 px-3">Receipt</th>
        </tr>
      </thead>

      <tbody>
        {mockDonations.map((d) => (
          <tr key={d.id} className="border-b border-green-200">
            <td className="p-3">{d.cause}</td>
            <td className="p-3">${d.amount}</td>
            <td className="p-3 text-gray-500">{d.date}</td>
            <td className="p-3 text-green-700 cursor-pointer">
              <IconReceipt />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Following
const Following = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-5">Following</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockFollowing.map((p) => (
        <div key={p.id} className="flex items-center gap-4 p-4 border border-green-200 bg-white rounded-xl shadow-sm">
          <img src={p.avatar} className="w-14 h-14 rounded-full" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.title}</p>
          </div>

          <button className="px-3 py-1 text-red-700 bg-red-100 rounded-md">Unfollow</button>
        </div>
      ))}
    </div>
  </div>
);

// Settings
const Settings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

    <div className="space-y-8">

      {/* Edit Profile */}
      <Section title="Edit Profile" subtitle="Update your personal information">
        <FormInput label="Full Name" type="text" value={mockUser.name} />
        <FormInput label="Email" type="email" value={mockUser.email} />
        <div>
          <label className="text-sm font-semibold text-gray-700">Bio</label>
          <textarea className="w-full mt-1 p-3 border border-green-300 rounded-md focus:border-green-600 focus:ring-1 focus:ring-green-600"></textarea>
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password" subtitle="Set a new, secure password">
        <FormInput label="Current Password" type="password" placeholder="••••••" />
        <FormInput label="New Password" type="password" placeholder="••••••" />
        <FormInput label="Confirm Password" type="password" placeholder="••••••" />
      </Section>

      {/* Notifications */}
      <Section title="Notifications" subtitle="Manage your email alerts">
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-green-200 bg-white rounded-lg">
            <input type="checkbox" defaultChecked className="w-5 h-5 text-green-700" />
            <span>Notify me about report updates</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-green-200 bg-white rounded-lg">
            <input type="checkbox" className="w-5 h-5 text-green-700" />
            <span>Send weekly wildlife highlights</span>
          </label>
        </div>
      </Section>

      <div className="text-right">
        <button className="bg-green-700 text-white px-6 py-2 rounded-lg shadow hover:bg-green-800">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

const Section = ({ title, subtitle, children }) => (
  <div className="border-t border-green-200 pt-6">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
    <div className="space-y-4">{children}</div>
  </div>
);
