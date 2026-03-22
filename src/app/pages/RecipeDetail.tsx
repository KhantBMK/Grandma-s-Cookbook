import { useState } from "react";
import { useParams } from "react-router";
import { Navigation } from "../components/Navigation";
import { Clock, Users, Bookmark, Share2, ChefHat } from "lucide-react";

// Mock recipe data
const recipeData: Record<string, any> = {
  "1": {
    title: "Creamy Pasta Carbonara",
    image: "https://images.unsplash.com/photo-1761315601031-f31099c14dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBwYXN0YSUyMGRpc2glMjBwbGF0ZWR8ZW58MXx8fHwxNzczODgzODM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "25 min",
    servings: 4,
    category: "Italian",
    description: "A classic Roman pasta dish made with eggs, cheese, pancetta, and black pepper. Simple ingredients come together to create a rich and creamy sauce that coats every strand of pasta.",
    tags: ["Italian", "Pasta", "Quick", "Easy"],
    ingredients: [
      "400g spaghetti",
      "200g pancetta or guanciale, diced",
      "4 large eggs",
      "100g Pecorino Romano cheese, grated",
      "Black pepper to taste",
      "Salt for pasta water"
    ],
    directions: [
      "Bring a large pot of salted water to boil. Add spaghetti and cook according to package directions until al dente.",
      "While pasta cooks, fry the pancetta in a large skillet over medium heat until crispy, about 5-7 minutes.",
      "In a bowl, whisk together eggs, grated cheese, and a generous amount of black pepper.",
      "Reserve 1 cup of pasta water, then drain the pasta.",
      "Remove skillet from heat. Add hot pasta to the pancetta and toss to combine.",
      "Quickly pour in the egg mixture, tossing constantly. Add pasta water a little at a time until you reach desired creaminess.",
      "Serve immediately with extra cheese and black pepper on top."
    ]
  },
  "2": {
    title: "Fresh Garden Salad",
    image: "https://images.unsplash.com/photo-1734989175071-fedc119fb52e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwaGVhbHRoeSUyMG1lYWx8ZW58MXx8fHwxNzczODkyNzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: "15 min",
    servings: 2,
    category: "Healthy",
    description: "A vibrant and refreshing salad packed with nutrients and flavor. Perfect as a light lunch or as a side dish for any meal.",
    tags: ["Healthy", "Vegetarian", "Fresh", "Quick"],
    ingredients: [
      "4 cups mixed greens",
      "1 cucumber, sliced",
      "2 tomatoes, diced",
      "1 avocado, sliced",
      "1/4 red onion, thinly sliced",
      "1/4 cup feta cheese",
      "2 tbsp olive oil",
      "1 tbsp lemon juice"
    ],
    directions: [
      "Wash and dry all the greens thoroughly.",
      "In a large bowl, combine mixed greens, cucumber, tomatoes, and red onion.",
      "Top with avocado slices and crumbled feta cheese.",
      "In a small bowl, whisk together olive oil and lemon juice.",
      "Drizzle dressing over salad just before serving and toss gently."
    ]
  }
};

export default function RecipeDetail() {
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  
  const recipe = recipeData[id || "1"] || recipeData["1"];

  // Function to scale ingredient quantities
  const scaleIngredient = (ingredient: string, scale: number): string => {
    if (scale === 1) return ingredient;
    
    // Match numbers (including decimals and fractions)
    const numberMatch = ingredient.match(/^(\d+(?:\/\d+)?(?:\.\d+)?)\s*(.+)$/);
    
    if (numberMatch) {
      const [, amount, rest] = numberMatch;
      
      // Handle fractions
      if (amount.includes('/')) {
        const [num, denom] = amount.split('/').map(Number);
        const scaledValue = (num / denom) * scale;
        
        // Try to convert back to fraction if it's a simple one
        if (scaledValue % 1 === 0) {
          return `${scaledValue} ${rest}`;
        } else if (scaledValue === 0.5) {
          return `1/2 ${rest}`;
        } else if (scaledValue === 0.25) {
          return `1/4 ${rest}`;
        } else if (scaledValue === 0.75) {
          return `3/4 ${rest}`;
        } else {
          return `${scaledValue.toFixed(1)} ${rest}`;
        }
      } else {
        const scaledAmount = parseFloat(amount) * scale;
        return `${scaledAmount % 1 === 0 ? scaledAmount : scaledAmount.toFixed(1)} ${rest}`;
      }
    }
    
    return ingredient;
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="border-2 border-orange-900/20 rounded-3xl overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full aspect-square object-cover"
            />
          </div>

          {/* Recipe Info */}
          <div className="border-2 border-orange-900/20 rounded-3xl p-8 bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="text-orange-600 text-sm mb-2">{recipe.category}</div>
                <h1 className="text-4xl text-orange-900 mb-2">{recipe.title}</h1>
              </div>
              <button
                onClick={() => setSaved(!saved)}
                className={`p-3 rounded-full border-2 transition-all ${
                  saved 
                    ? "bg-orange-600 border-orange-600 text-white" 
                    : "border-orange-900/20 text-orange-900/60 hover:border-orange-600 hover:text-orange-600"
                }`}
              >
                <Bookmark className="w-6 h-6" fill={saved ? "currentColor" : "none"} />
              </button>
            </div>

            <p className="text-orange-900/60 mb-6">{recipe.description}</p>

            <div className="flex items-center gap-6 mb-6 pb-6 border-b-2 border-orange-900/20">
              <div className="flex items-center gap-2 text-orange-900">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center gap-2 text-orange-900">
                <Users className="w-5 h-5 text-orange-600" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-2 text-orange-900">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <span>Easy</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-orange-50 border-2 border-orange-900/20 text-orange-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Recipe
            </button>
          </div>
        </div>

        {/* Ingredients and Directions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="border-2 border-orange-900/20 rounded-3xl p-8 bg-white">
            <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-orange-900/20">
              <h2 className="text-2xl text-orange-900">
                Ingredients
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMultiplier(1)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    multiplier === 1
                      ? "bg-orange-600 text-white"
                      : "bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600"
                  }`}
                >
                  1x
                </button>
                <button
                  onClick={() => setMultiplier(2)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    multiplier === 2
                      ? "bg-orange-600 text-white"
                      : "bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600"
                  }`}
                >
                  2x
                </button>
                <button
                  onClick={() => setMultiplier(4)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    multiplier === 4
                      ? "bg-orange-600 text-white"
                      : "bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600"
                  }`}
                >
                  4x
                </button>
                <button
                  onClick={() => setMultiplier(8)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    multiplier === 8
                      ? "bg-orange-600 text-white"
                      : "bg-white border-2 border-orange-900/20 text-orange-900/70 hover:border-orange-600 hover:text-orange-600"
                  }`}
                >
                  8x
                </button>
              </div>
            </div>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-orange-900/80">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>{scaleIngredient(ingredient, multiplier)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Directions */}
          <div className="border-2 border-orange-900/20 rounded-3xl p-8 bg-white">
            <h2 className="text-2xl text-orange-900 mb-6 pb-3 border-b-2 border-orange-900/20">
              Directions
            </h2>
            <ol className="space-y-4">
              {recipe.directions.map((step: string, index: number) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white">
                    {index + 1}
                  </span>
                  <p className="text-orange-900/80 flex-1 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}