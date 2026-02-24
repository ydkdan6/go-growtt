import { Bell } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="w-full bg-gradient-to-r from-[#001A1A] via-[#008080] to-[#001A1A] px-4 md:px-12 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Logo and Navigation */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 14 14" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M13.3327 2.42554C13.3327 3.33827 11.9455 4.1332 9.89602 4.54677C11.9455 4.9603 13.3327 5.75524 13.3327 6.66797C13.3327 7.5807 11.9455 8.37564 9.89602 8.78917C11.9455 9.20273 13.3327 9.99767 13.3327 10.9104C13.3327 12.2493 10.3479 13.3346 6.66602 13.3346C2.98412 13.3346 -0.000651002 12.2493 -0.000651002 10.9104C-0.000651002 9.99767 1.3865 9.20273 3.43602 8.78917C1.3865 8.37564 -0.000651002 7.5807 -0.000651002 6.66797C-0.000651002 5.75524 1.3865 4.9603 3.43602 4.54677C1.3865 4.1332 -0.000651002 3.33827 -0.000651002 2.42554C-0.000651002 1.08667 2.98412 0.00130212 6.66602 0.00130212C10.3479 0.00130212 13.3327 1.08667 13.3327 2.42554Z" 
              fill="white"
            />
          </svg>
          <span className="text-white font-semibold text-sm">growtt</span>
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-white font-semibold text-sm hover:opacity-80 transition">
            Home
          </a>
          <a href="#" className="text-white text-opacity-60 text-sm hover:opacity-80 transition">
            Invest
          </a>
          <a href="#" className="text-white text-opacity-60 text-sm hover:opacity-80 transition">
            Learn
          </a>
          <a href="#" className="text-white text-opacity-60 text-sm hover:opacity-80 transition">
            Wallet
          </a>
        </nav>
      </div>

      {/* Right side - Icons and Avatar */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-full bg-[#F0F5F5] flex items-center justify-center hover:opacity-80 transition">
          <Bell className="w-6 h-6 text-[#030712]" />
        </button>

        {/* Avatar */}
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/8dccb6497d1faca6aa2fc5b006908338c39bcbb1?width=80"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </header>
  );
}
