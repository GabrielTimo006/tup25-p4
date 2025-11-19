"use client";

import { Producto } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface ProductoCardProps {
    producto: Producto;
    onProductUpdate: () => void; // Función para notificar una actualización
}

export default function ProductoCard({ producto, onProductUpdate }: ProductoCardProps) {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        try {
            await addToCart(producto.id, 1);
            onProductUpdate(); // Llama a la función para recargar los productos
        } catch (error) {
            // En lugar de una alerta, mostramos el error en la consola para no interrumpir.
            let errorMessage = "Ocurrió un error desconocido";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error al agregar al carrito:", errorMessage);
        }
    };

    return (
        <div className="border rounded-lg p-4 flex flex-col">
            <div className="relative w-full h-48 mb-4">
                <Image 
                    src={producto.imagen} 
                    alt={producto.titulo} 
                    fill 
                    style={{ objectFit: 'contain' }}
                    unoptimized={true}
                />
            </div>
            <h2 className="text-lg font-bold flex-grow">{producto.titulo}</h2>
            <p className="text-sm text-gray-500 mb-2">{producto.categoria}</p>
            <p className="text-gray-700 mb-4 line-clamp-2 flex-grow">{producto.descripcion}</p>
            <div className="flex justify-between items-center mt-auto">
                <p className="text-xl font-semibold">${producto.precio.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Disponibles: {producto.existencia}</p>
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                disabled={producto.existencia === 0}
                onClick={handleAddToCart}
            >
                {producto.existencia > 0 ? 'Agregar al carrito' : 'Agotado'}
            </button>
        </div>
    );
}