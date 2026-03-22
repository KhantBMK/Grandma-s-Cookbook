import { Link } from "react-router";
import { Clock, Users } from "lucide-react";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  servings: number;
  category: string;
}

export default function RecipeCard({ id, title, image, cookTime, servings, category }: RecipeCardProps) {
  return (
    <Link to={`/recipe/${id}`} className="group">
      <div className="bg-white border-2 border-orange-900/20 rounded-2xl overflow-hidden hover:border-orange-600 transition-all">
        <div className="aspect-square overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="text-xs text-orange-600 mb-2">{category}</div>
          <h3 className="mb-3 line-clamp-2 text-orange-900 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-orange-900/60">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{servings} servings</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}