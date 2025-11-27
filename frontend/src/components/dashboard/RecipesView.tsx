import { ChefHat, Package } from 'lucide-react';

interface RecipesViewProps {
    products: any[];
    refetch: () => void;
}

export default function RecipesView({ products, refetch }: RecipesViewProps) {
    const productsWithRecipes = products.filter(p => p.recipe && p.recipe.length > 0);

    if (productsWithRecipes.length === 0) {
        return (
            <div className="card p-12 text-center">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recetas definidas</h3>
                <p className="text-gray-500">Añade recetas a tus productos desde el formulario de edición</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {productsWithRecipes.map(product => (
                <div key={product.id} className="card hover:shadow-lg transition-shadow">
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-verde-100 flex items-center justify-center">
                                <Package className="w-6 h-6 text-verde-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                                <p className="text-sm text-gray-500">{product.sku}</p>
                            </div>
                        </div>
                    </div>

                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <ChefHat className="w-4 h-4" />
                        Ingredientes
                    </h4>

                    <div className="space-y-2">
                        {product.recipe.map((ingredient: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-verde-50 transition-colors">
                                <span className="text-sm font-medium text-gray-700">
                                    {ingredient.ingredient?.name || 'Ingrediente desconocido'}
                                </span>
                                <span className="text-sm text-gray-600 font-mono">
                                    {ingredient.quantity} {ingredient.ingredient?.unit || 'unidades'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
