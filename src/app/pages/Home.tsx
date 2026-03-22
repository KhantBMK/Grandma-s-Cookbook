import { Clock, Users, Search as SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation";

const authorImage = "https://images.unsplash.com/photo-1545379537-5d1275c630fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXZlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwdGVhbSUyMHdvcmtpbmclMjB0b2dldGhlcnxlbnwxfHx8fDE3NzM5MTI5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

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
];

export default function Home() {
  const [recommendedRecipe, setRecommendedRecipe] = useState(allRecipes[0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Pick a random recipe on component mount
    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    setRecommendedRecipe(allRecipes[randomIndex]);
  }, []);

  const handleSearchWithFilter = () => {
    if (selectedCategories.length === 0) {
      navigate("/search");
    } else {
      const categoriesParam = selectedCategories.join(",");
      navigate(`/search?categories=${encodeURIComponent(categoriesParam)}`);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const categories = ["Italian", "Healthy", "Dinner", "Dessert", "Breakfast", "Japanese", "Comfort Food"];

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1617735605078-8a9336be0816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb29raW5nJTIwZm9vZCUyMGluZ3JlZGllbnRzJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzM4OTI3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
          alt="Cooking hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f1e8]/80 via-[#f5f1e8]/50 to-[#f5f1e8]/30 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <h1 className="text-4xl md:text-5xl text-orange-900 mb-3">
              Welcome to Our Kitchen
            </h1>
            <p className="text-lg text-orange-900/80 max-w-2xl">
              Discover other delicious recipes, save family recipes and keep plates full!
            </p>
          </div>
        </div>
      </div>

      {/* Three Large Feature Boxes */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Box */}
          <Link to="/about" className="block group">
            <div className="border-2 border-orange-900/20 rounded-3xl overflow-hidden bg-white hover:border-orange-600 transition-all h-full">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img 
                  src={authorImage} 
                  alt="About the author" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center p-6">
                  <h2 className="text-2xl text-white group-hover:text-orange-300 transition-colors">
                    Meet the Team
                  </h2>
                </div>
              </div>
            </div>
          </Link>

          {/* Recommended Recipe Box */}
          <Link to={`/recipe/${recommendedRecipe.id}`} className="block group">
            <div className="border-2 border-orange-900/20 rounded-3xl overflow-hidden bg-white hover:border-orange-600 transition-all h-full">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img 
                  src={recommendedRecipe.image} 
                  alt={recommendedRecipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-end p-6 gap-2">
                  <h2 className="text-2xl text-white group-hover:text-orange-300 transition-colors">
                    Recommendations
                  </h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{recommendedRecipe.cookTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Search Box */}
          <div className="border-2 border-orange-900/20 rounded-3xl p-6 bg-white hover:border-orange-600 transition-all flex flex-col">
            <div className="flex-1">
              <h2 className="text-2xl text-orange-900 mb-4 text-center">
                Search Recipes
              </h2>
              <div className="mb-4">
                <label className="block text-sm text-orange-900/70 mb-3">Select Categories:</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all border-2 text-left ${
                        selectedCategories.includes(category)
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-white border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedCategories.includes(category)
                            ? "border-white bg-white"
                            : "border-orange-900/30"
                        }`}>
                          {selectedCategories.includes(category) && (
                            <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="truncate">{category}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <p className="text-xs text-orange-600 mt-2">
                    {selectedCategories.length} selected
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleSearchWithFilter}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <SearchIcon className="w-5 h-5" />
              Browse Recipes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}