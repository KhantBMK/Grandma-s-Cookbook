import { useState } from "react";
import { Navigation } from "../components/Navigation";
import RecipeCard from "../components/RecipeCard";
import { User, Settings, LogOut, Bell, Lock } from "lucide-react";

const savedRecipes = [
  {
    id: "1",
    title: "Creamy Pasta Carbonara",
    image: "https://images.unsplash.com/photo-1761315601031-f31099c14dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBwYXN0YSUyMGRpc2glMjBwbGF0ZWR8ZW58MXx8fHwxNzczODgzODM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "25 min",
    servings: 4,
    category: "Italian"
  },
  {
    id: "4",
    title: "Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1736840334919-aac2d5af73e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NzM4NTgxNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "30 min",
    servings: 6,
    category: "Dessert"
  },
  {
    id: "6",
    title: "Authentic Sushi Platter",
    image: "https://images.unsplash.com/photo-1764183122524-974ccfb709fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHBsYXR0ZXIlMjBqYXBhbmVzZXxlbnwxfHx8fDE3NzM4MTQzNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "45 min",
    servings: 3,
    category: "Japanese"
  },
];

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="border-2 border-orange-900/20 rounded-3xl p-8 bg-white">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-full border-2 border-orange-600 flex items-center justify-center bg-orange-50 flex-shrink-0">
                <User className="w-16 h-16 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-orange-900/60 text-sm mb-1">Name</label>
                    <input
                      type="text"
                      defaultValue="Jane Doe"
                      className="bg-white border-2 border-orange-900/20 rounded-lg px-4 py-2 text-orange-900 w-full max-w-md focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-orange-900/60 text-sm mb-1">Account Info</label>
                    <input
                      type="email"
                      defaultValue="example@email.com"
                      className="bg-white border-2 border-orange-900/20 rounded-lg px-4 py-2 text-orange-900 w-full max-w-md focus:outline-none focus:border-orange-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-2 border-2 border-orange-900/20 rounded-2xl p-6 bg-[#fefdfb]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-orange-900">Settings</h2>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-orange-900/20 rounded-lg p-4 bg-white hover:border-orange-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <h3 className="text-orange-900">Notifications</h3>
                      <p className="text-orange-900/60 text-sm">Manage your notification preferences</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-orange-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>

                <div className="border-2 border-orange-900/20 rounded-lg p-4 bg-white hover:border-orange-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <h3 className="text-orange-900">Privacy</h3>
                      <p className="text-orange-900/60 text-sm">Control your privacy settings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-orange-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>

                <button className="w-full border-2 border-red-400 hover:bg-red-50 rounded-lg p-4 flex items-center justify-center gap-2 text-red-600 hover:text-red-700 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Saved Recipes */}
            <div className="border-2 border-orange-900/20 rounded-2xl p-6 bg-[#fefdfb]">
              <h2 className="text-xl text-orange-900 mb-4 pb-3 border-b-2 border-orange-900/20">
                Saved Recipes
              </h2>
              <div className="space-y-4">
                {savedRecipes.map((recipe) => (
                  <a
                    key={recipe.id}
                    href={`/recipe/${recipe.id}`}
                    className="block group"
                  >
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-white transition-colors">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-orange-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-2">
                          {recipe.title}
                        </h3>
                        <p className="text-orange-900/60 text-xs mt-1">{recipe.category}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}