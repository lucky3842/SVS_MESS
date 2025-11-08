import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    quantity: string;
}

export default function ProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select('id, name, quantity')
            .order('created_at', { ascending: false });

        if (data) {
            setProducts(data);
        }
    };

    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('productName') as string;
        const quantity = formData.get('quantity') as string;

        if (name && quantity) {
            setLoading(true);
            const { error } = await supabase
                .from('products')
                .insert({
                    name,
                    quantity,
                    created_by: user.id,
                });

            setLoading(false);

            if (!error) {
                form.reset();
                fetchProducts();
            }
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchProducts();
        }
    };

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
                            <Button type="submit" className="w-full" disabled={loading}>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                {loading ? 'Adding...' : 'Add Product'}
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
                        {products.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">No products added yet.</div>
                        ) : (
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
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
