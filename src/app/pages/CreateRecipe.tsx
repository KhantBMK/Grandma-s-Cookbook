import { Navigation } from "../components/Navigation";
import { useState, useRef } from "react";
import { Clock, Users, Upload, Plus, X, Save } from "lucide-react";

export default function CreateRecipe() {
  const [recipeName, setRecipeName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ingredients, setIngredients] = useState([
    "2 cups of love",
    "1 same recipe",
    "Countless memories"
  ]);
  const [newIngredient, setNewIngredient] = useState("");
  const [editingIngredient, setEditingIngredient] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const [directions, setDirections] = useState([
    "Bring the Family",
    "Cook delicious meal",
    "Serve with Love!"
  ]);
  const [newDirection, setNewDirection] = useState("");
  const [editingDirection, setEditingDirection] = useState<number | null>(null);
  const [editDirectionValue, setEditDirectionValue] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const startEditingIngredient = (index: number) => {
    setEditingIngredient(index);
    setEditValue(ingredients[index]);
  };

  const saveIngredient = (index: number) => {
    const updated = [...ingredients];
    updated[index] = editValue;
    setIngredients(updated);
    setEditingIngredient(null);
    setEditValue("");
  };

  const addDirection = () => {
    if (newDirection.trim()) {
      setDirections([...directions, newDirection]);
      setNewDirection("");
    }
  };

  const removeDirection = (index: number) => {
    setDirections(directions.filter((_, i) => i !== index));
  };

  const startEditingDirection = (index: number) => {
    setEditingDirection(index);
    setEditDirectionValue(directions[index]);
  };

  const saveDirection = (index: number) => {
    const updated = [...directions];
    updated[index] = editDirectionValue;
    setDirections(updated);
    setEditingDirection(null);
    setEditDirectionValue("");
  };

  const handleSaveRecipe = () => {
    alert("Recipe saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="border-2 border-orange-900/20 rounded-3xl p-8 md:p-12 bg-white">
          <h1 className="text-4xl text-orange-900 mb-8 text-center">Create New Recipe</h1>

          {/* Recipe Name */}
          <div className="mb-6">
            <label className="block text-orange-900 mb-2">Recipe Name</label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="Enter recipe name..."
              className="w-full border-2 border-orange-900/20 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-600"
            />
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <label className="block text-orange-900 mb-2">Recipe Image</label>
            <div 
              className="border-2 border-dashed border-orange-900/20 rounded-2xl overflow-hidden bg-orange-50 hover:border-orange-600 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Recipe preview" 
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 flex flex-col items-center justify-center text-orange-900/40">
                  <Upload className="w-16 h-16 mb-4" />
                  <p className="text-lg">Click to upload image</p>
                  <p className="text-sm mt-2">or drag and drop</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Recipe Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-orange-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Prep Time
              </label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="e.g., 15 minutes"
                className="w-full border-2 border-orange-900/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
              />
            </div>
            <div>
              <label className="block text-orange-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Cook Time
              </label>
              <input
                type="text"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="e.g., 30 minutes"
                className="w-full border-2 border-orange-900/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
              />
            </div>
            <div>
              <label className="block text-orange-900 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Servings
              </label>
              <input
                type="text"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="e.g., 4 servings"
                className="w-full border-2 border-orange-900/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-orange-900 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about this recipe..."
              rows={4}
              className="w-full border-2 border-orange-900/20 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-600"
            />
          </div>

          {/* Ingredients Section */}
          <div className="mb-8">
            <h2 className="text-2xl text-orange-900 mb-4">Ingredients</h2>
            <div className="space-y-2 mb-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-orange-600">•</span>
                  {editingIngredient === index ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 border-2 border-orange-900/20 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-600"
                      />
                      <button
                        onClick={() => saveIngredient(index)}
                        className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingIngredient(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span 
                        className="flex-1 text-orange-900/70 cursor-pointer hover:text-orange-900"
                        onClick={() => startEditingIngredient(index)}
                      >
                        {ingredient}
                      </span>
                      <button
                        onClick={() => removeIngredient(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add new ingredient..."
                className="flex-1 border-2 border-orange-900/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              />
              <button
                onClick={addIngredient}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Directions Section */}
          <div className="mb-8">
            <h2 className="text-2xl text-orange-900 mb-4">Directions</h2>
            <div className="space-y-3 mb-4">
              {directions.map((direction, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-orange-600 mt-1">{index + 1}.</span>
                  {editingDirection === index ? (
                    <div className="flex-1 flex gap-2">
                      <textarea
                        value={editDirectionValue}
                        onChange={(e) => setEditDirectionValue(e.target.value)}
                        rows={2}
                        className="flex-1 border-2 border-orange-900/20 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-600"
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => saveDirection(index)}
                          className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingDirection(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p 
                        className="flex-1 text-orange-900/70 cursor-pointer hover:text-orange-900"
                        onClick={() => startEditingDirection(index)}
                      >
                        {direction}
                      </p>
                      <button
                        onClick={() => removeDirection(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={newDirection}
                onChange={(e) => setNewDirection(e.target.value)}
                placeholder="Add new step..."
                rows={2}
                className="flex-1 border-2 border-orange-900/20 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
              />
              <button
                onClick={addDirection}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSaveRecipe}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors text-lg"
            >
              <Save className="w-5 h-5" />
              Save Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}