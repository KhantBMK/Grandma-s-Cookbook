import { useState } from "react";
import { useSearchParams } from "react-router";
import { Navigation } from "../components/Navigation";
import RecipeCard from "../components/RecipeCard";
import { Search as SearchIcon, Filter, X } from "lucide-react";

const allRecipes = [
  {
    id: "1",
    title: "Creamy Pasta Carbonara",
    image: "https://images.unsplash.com/photo-1761315601031-f31099c14dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBwYXN0YSUyMGRpc2glMjBwbGF0ZWR8ZW58MXx8fHwxNzczODgzODM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "25 min",
    servings: 4,
    category: "Italian"
  },
  {
    id: "2",
    title: "Fresh Garden Salad",
    image: "https://images.unsplash.com/photo-1734989175071-fedc119fb52e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwaGVhbHRoeSUyMG1lYWx8ZW58MXx8fHwxNzczODkyNzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "15 min",
    servings: 2,
    category: "Healthy"
  },
  {
    id: "3",
    title: "Grilled Ribeye Steak",
    image: "https://images.unsplash.com/photo-1666304328802-671b1e9022b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc3RlYWslMjBkaW5uZXJ8ZW58MXx8fHwxNzczODA5NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "20 min",
    servings: 2,
    category: "Dinner"
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
    id: "5",
    title: "Fluffy Buttermilk Pancakes",
    image: "https://images.unsplash.com/photo-1610015644714-60076be69b30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBwYW5jYWtlc3xlbnwxfHx8fDE3NzM4MDk3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "20 min",
    servings: 4,
    category: "Breakfast"
  },
  {
    id: "6",
    title: "Authentic Sushi Platter",
    image: "https://images.unsplash.com/photo-1764183122524-974ccfb709fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHBsYXR0ZXIlMjBqYXBhbmVzZXxlbnwxfHx8fDE3NzM4MTQzNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "45 min",
    servings: 3,
    category: "Japanese"
  },
  {
    id: "7",
    title: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1707896543317-da87bde75ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGElMjBmcmVzaHxlbnwxfHx8fDE3NzM4ODI3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "35 min",
    servings: 4,
    category: "Italian"
  },
  {
    id: "8",
    title: "Homestyle Cooking",
    image: "https://images.unsplash.com/photo-1617735605078-8a9336be0816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb29raW5nJTIwZm9vZCUyMGluZ3JlZGllbnRzJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzM4OTI3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "40 min",
    servings: 6,
    category: "Comfort Food"
  },
  {
    id: "9",
    title: "Thai Green Curry",
    image: "https://images.unsplash.com/photo-1607492796355-69ea363442d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwY3VycnklMjBkaXNoJTIwY29sb3JmdWx8ZW58MXx8fHwxNzczOTA4MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "35 min",
    servings: 4,
    category: "Dinner"
  },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const categoriesFromUrl = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoriesFromUrl.length > 0 ? categoriesFromUrl : []);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ["All", "Italian", "Healthy", "Dinner", "Dessert", "Breakfast", "Japanese", "Comfort Food"];

  const toggleCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        prev.includes(category) 
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    }
  };

  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(recipe.category);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Header */}
        <div className="border-2 border-orange-900/20 rounded-3xl p-8 bg-white mb-8">
          <h1 className="text-4xl text-orange-900 mb-6 text-center">Browse Recipes</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-900/40" />
            <input
              type="text"
              placeholder="Search for recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-orange-900/20 rounded-full px-12 py-4 text-orange-900 focus:outline-none focus:border-orange-600 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap justify-center relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isFilterOpen
                  ? "bg-orange-600 text-white"
                  : "bg-white border-2 border-orange-900/20 text-orange-900/60 hover:border-orange-600 hover:text-orange-600"
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>

            {/* Filter Popup */}
            {isFilterOpen && (
              <div className="absolute top-14 left-0 z-10 bg-white border-2 border-orange-900/20 rounded-2xl shadow-lg p-4 min-w-[300px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-orange-900 font-medium">Filter Categories</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-orange-900/60" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-2 rounded-full text-left transition-all ${
                        category === "All"
                          ? selectedCategories.length === 0
                            ? "bg-orange-600 text-white"
                            : "bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600"
                          : selectedCategories.includes(category)
                          ? "bg-orange-600 text-white"
                          : "bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Filter Buttons */}
            {selectedCategories.length === 0 ? (
              <>
                <span className="px-4 py-2 rounded-full bg-orange-600 text-white">All</span>
                <button
                  onClick={() => setSelectedCategories(["Italian", "Dessert"])}
                  className="px-4 py-2 rounded-full bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600 transition-all"
                >
                  Our Favorites
                </button>
                <button
                  onClick={() => toggleCategory("Breakfast")}
                  className="px-4 py-2 rounded-full bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600 transition-all"
                >
                  Breakfast
                </button>
                <button
                  onClick={() => toggleCategory("Healthy")}
                  className="px-4 py-2 rounded-full bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600 transition-all"
                >
                  Lunch
                </button>
                <button
                  onClick={() => toggleCategory("Dinner")}
                  className="px-4 py-2 rounded-full bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600 transition-all"
                >
                  Dinner
                </button>
                <button
                  onClick={() => toggleCategory("Japanese")}
                  className="px-4 py-2 rounded-full bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600 transition-all"
                >
                  Appetizers
                </button>
                <button
                  onClick={() => setSelectedCategories(["Breakfast", "Healthy"])}
                  className="px-4 py-2 rounded-full bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600 transition-all"
                >
                  Quick
                </button>
              </>
            ) : (
              selectedCategories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 rounded-full bg-orange-600 text-white flex items-center gap-2"
                >
                  {category}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="hover:bg-orange-700 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-orange-900/60">
            Found {filteredRecipes.length} {filteredRecipes.length === 1 ? "recipe" : "recipes"}
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="border-2 border-orange-900/20 rounded-3xl p-8 bg-white">
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <SearchIcon className="w-16 h-16 text-orange-900/20 mx-auto mb-4" />
              <p className="text-orange-900/60 text-lg">No recipes found</p>
              <p className="text-orange-900/40 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}