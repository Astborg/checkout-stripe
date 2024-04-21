const initStripe = require('../stripe')
const fs = require("fs").promises
const bcrypt = require('bcrypt')

const products = async (req, res) => {
  const stripe = initStripe();
  try {
  
    const productsData = await stripe.products.list();
    
    // Retrieve Price IDs and update product data
    const updatedProducts = await updateProductPrices(productsData.data, stripe);

   
    res.json({ products: updatedProducts });

  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'Failed to retrieve products from Stripe' });
  }
}

async function updateProductPrices(productsData, stripe) {
  try {
   
    const prices = await stripe.prices.list();
  
    // Iterate over products and update price IDs
    const updatedProducts = await Promise.all(productsData.map(async product => {
      try {
        // Find the corresponding price in Stripe
        const price = prices.data.find(price => price.product === product.id);
        
       
        if (price) {
         
          const priceAmount = price.unit_amount / 100;
          
          return { ...product, price: priceAmount, priceID: price.id };
        } else {
          console.log(`No price found for product ${product.name}`);
         
          return { ...product, price: 0, priceID: null }; 
        }
      } catch (error) {
        console.error('Error updating product prices:', error);
        
        return { ...product, price: 0, priceID: null }; 
      }
    }));
  
    console.log('Product prices updated successfully');
    return updatedProducts;
  } catch (error) {
    console.error('Error retrieving prices from Stripe:', error);
    throw new Error('Failed to retrieve prices from Stripe');
  }
}

const createCheckoutSession = async (req, res) => {
  
  const { lineItems, emailStorage} = req.body;
 
  const stripe = initStripe()
  
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: lineItems,

    success_url: "http://localhost:5174/confirmation",
    cancel_url: "http://localhost:5174",
    customer_email: emailStorage
  })

res.status(200).json({url: session.url, sessionId: session.id})
}

const verifySession = async (req,res) => {
  const stripe = initStripe()
  

  console.log('Nu kommer jag hit')

  const sessionId = req.body.sessionId

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if(session.payment_status === "paid"){
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId)
  

  const order = {
    orderNummer: Math.floor(Math.random() * 1000000),
    customerName: session.customer_details.name,
    products: lineItems.data,
    total: session.amount_total,
    date: new Date()

  }

  let orders = []

  try {
    const data = await fs.readFile('./orders.json')
    JSON.parse(data)
  } catch (error) {
    
  }
  const existingOrder = orders.find(existingOrder => existingOrder.orderNummer === order.orderNummer);
  
  if(existingOrder){
    console.log('already excists')
  }else{
    orders.push(order)
    await fs.writeFile('./orders.json', JSON.stringify(orders, null, 4))
    console.log('new order is written to file')
  }


  res.status(200).json({verified:true})
}
}


const register = async (req, res) => {
  const stripe = initStripe()
  const { email, password} = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
    const registerCustomer = {
      email: email,
      password: hashedPassword
    }

  try {
     
      

      // Skapa en ny kund i Stripe
      const customer = await stripe.customers.create({
          email: email,
          
      });

      
      res.status(200).json({ success: true, customer: customer });
  } catch (error) {
      console.error('Fel vid registrering av ny kund:', error);
      res.status(500).json({ success: false, error: 'Registreringen misslyckades' });
  }

    
    let customers = [];
    try {
        const data = fs.readFile('customers.json');
        customers = JSON.parse(data);
    } catch (error) {
       
    }

   
    customers.push(registerCustomer);

   
    fs.writeFile('customers.json', JSON.stringify(customers, null, 2));
}


module.exports = {createCheckoutSession, products, verifySession, register}


