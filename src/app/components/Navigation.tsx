import { Link, useLocation } from "react-router";
import { Home, Search, User, LogIn, PlusCircle } from "lucide-react";
import logo from "@/assets/logo.png";

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white border-2 border-orange-900/20 rounded-full mx-6 my-6 px-8 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 text-orange-900">
          <img
            src={logo}
            alt="Grandma's Cookbook logo"
            className="w-12 h-12"
          />
          <span className="text-xl">Grandma's Cookbook</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === "/" ? "text-orange-600" : "text-orange-900/60 hover:text-orange-600"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </Link>
          <Link 
            to="/search" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === "/search" ? "text-orange-600" : "text-orange-900/60 hover:text-orange-600"
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Browse</span>
          </Link>
          <Link 
            to="/create" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === "/create" ? "text-orange-600" : "text-orange-900/60 hover:text-orange-600"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-sm">Create</span>
          </Link>
          <Link 
            to="/profile" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === "/profile" ? "text-orange-600" : "text-orange-900/60 hover:text-orange-600"
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-sm">Profile</span>
          </Link>
          <Link 
            to="/login" 
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === "/login" ? "text-orange-600" : "text-orange-900/60 hover:text-orange-600"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span className="text-sm">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}