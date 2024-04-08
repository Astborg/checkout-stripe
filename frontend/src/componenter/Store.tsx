import { useEffect, useState } from "react";
import CartPopOut from "./CartPopOut";

export default function Store(){
    interface Product {
        id: string;
        priceID: string
        name: string;
        description: string;
        Images: string;
        quantity: number;
        price: string
    }
    
    interface ProductWithSelection extends Product {
        
        selected: boolean;
        quantity: number;
    }
    
    interface StoreProps {
        products: Product[];
    }
    const [products, setProducts] = useState<ProductWithSelection[]>([]);
    const [showCart, setShowCart] = useState(false);
    
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('http://localhost:3001/api/products');
                const data = await response.json();
                setProducts(data.products.map((product: Product) => ({
                    ...product,
                    selected: false,
                    quantity: 0
                })));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, []);

    useEffect(() => {
        const storedProducts = localStorage.getItem('selectedProducts')
        console.log(storedProducts)
        if(storedProducts){
            setProducts(JSON.parse(storedProducts))
        }
    }, [])
    const handleQuantity = (productId: string) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId
                ? {...product, quantity:product.quantity + 1}
                :product))
    }
    const handleProductSelection = (productId: string) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId
                    ? { ...product, selected: product.selected = true } 
                    : product
            )
        );
    };
    const handlePayment = async () => {
        try {
            const selectedProducts = products.filter(product => product.selected)
            localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts))
            
            const lineItems = selectedProducts.map(product => ({
            
                price: product.priceID, 
                quantity: product.quantity
            }));
            console.log(lineItems)
            const response = await fetch('http://localhost:3001/payments/create-checkout-session', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ lineItems })
            });
    
            // Hantera svaret från backenden
            const data = await response.json();
            localStorage.setItem('sessionId', JSON.stringify(data.sessionId))
            window.location = data.url;
        } catch (error) {
            console.error('Error initiating payment:', error);
        }
    };
  return (
    <><div>STORE</div>
      <button onClick={() => setShowCart(!showCart)}>Visa Kundvagn</button>
      {showCart && <CartPopOut products={products.filter((product) => product.selected)} />}

         {products.map((product:any) => (
                <div key={product.id} onClick={() => handleProductSelection(product.id)}>
                    <h1>{product.name}</h1>
                    <img src={product.images} style={{ width: '200px', height: '200px', borderRadius: '50%' }}></img>
                    <p>{product.description}</p>
                    <p>Pris: {product.price}</p>
                    <p>Antal: {product.quantity}</p>
                    <button onClick={() =>handleQuantity(product.id)}>Köp</button>
                </div>
            ))}
  
                
            <button onClick={handlePayment}>Checkout</button>
                
         
    
    </>
    
  )
}
