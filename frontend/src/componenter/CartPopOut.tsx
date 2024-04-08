
const CartPopOut = ({ products }: { products: any }) => {
   
    const totalAmount = products.reduce((acc: any, product: any) => acc + product.price * product.quantity, 0);
  
    return (
      <div >
        <h2>Kundvagn</h2>
        <ul>
          {products.map((product: any) => (
            <li key={product.id}>
              <span>{product.name}</span>
              <span>Antal: {product.quantity}</span>
              <span>Pris: {product.price}</span>
            </li>
          ))}
        </ul>
        <p>Totalt: {totalAmount}</p>
      </div>
    );
  };
  
  export default CartPopOut;