import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@/lib/types';
import { PlusCircle, Trash2 } from 'lucide-react';

const initialProducts: Product[] = [
    { id: '1', name: 'Rice', quantity: '25kg Bag' },
    { id: '2', name: 'Dal', quantity: '10kg Bag' },
    { id: '3', name: 'Cooking Oil', quantity: '5L Can' },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('productName') as string;
        const quantity = formData.get('quantity') as string;

        if (name && quantity) {
            const newProduct: Product = {
                id: new Date().toISOString(),
                name,
                quantity,
            };
            setProducts(prev => [newProduct, ...prev]);
            form.reset();
        }
    };
    
    const handleDelete = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    }

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Product</CardTitle>
                        <CardDescription>Add a new item to the inventory list.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <Label htmlFor="productName">Product Name</Label>
                                <Input name="productName" id="productName" placeholder="e.g., Rice" required className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="quantity">Quantity / Unit</Label>
                                <Input name="quantity" id="quantity" placeholder="e.g., 25kg Bag" required className="mt-1" />
                            </div>
                            <Button type="submit" className="w-full">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Product List</CardTitle>
                        <CardDescription>List of all available products.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {products.map(product => (
                                <li key={product.id} className="flex items-center justify-between p-3 transition-colors rounded-lg bg-secondary hover:bg-accent">
                                    <div>
                                        <p className="font-semibold text-secondary-foreground">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">{product.quantity}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                        <Trash2 className="w-5 h-5 text-destructive" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
