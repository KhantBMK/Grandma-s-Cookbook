import { Link } from "react-router";
import { Clock, Users } from "lucide-react";

interface RecipeCardProps {
    id: number;
    name: string;
    image_url: string;
    cook_time: number;
    servings: number;
    cuisine: string;
    meal_type: string;
}

export default function RecipeCard({ id, name, image_url, cook_time, servings, cuisine, meal_type }: RecipeCardProps) {
    return (
        <Link to={`/recipe/${id}`} className="group">
            <div className="bg-white border-2 border-orange-900/20 rounded-2xl overflow-hidden hover:border-orange-600 transition-all">
                <div className="aspect-square overflow-hidden">
                    <img
                        src={image_url || 'https://images.unsplash.com/photo-1617735605078-8a9336be0816?w=400'}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-4">
                    <div className="flex gap-2 mb-2 flex-wrap">
                        <span className="text-xs text-orange-600">{cuisine}</span>
                        <span className="text-xs text-orange-900/40">·</span>
                        <span className="text-xs text-orange-900/60">{meal_type}</span>
                    </div>
                    <h3 className="mb-3 line-clamp-2 text-orange-900 group-hover:text-orange-600 transition-colors">
                        {name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-orange-900/60">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{cook_time} min</span>
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
