import axios from 'axios';
import "dotenv/config";

const { 
  SHOPIFY_STORE_URL, 
  SHOPIFY_ACCESS_TOKEN 
} = process.env;

const endpoint = `${SHOPIFY_STORE_URL}admin/api/2023-01/graphql.json`;

const getProductsByName = async (name) => {
  const query = `
    {
      products(query: "title:*${name}*", first: 250) {
        nodes {
          id
          title
          variants(first: 50) {
            nodes {
              id
              title
              price
            }
          }
        }
      }
    }
  `

  try {
    const response = await axios.post(endpoint, { query }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
    });

    return response.data.data.products.nodes

  } catch (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }
};


const listVariantsByPrice = (products) => {
  let variants = [];

  products.forEach(product => {
    product.variants.nodes.forEach(variant => { // Adjusted here
      variants.push({
        product: product.title, // Adjusted here
        variant: variant.title,
        price: parseFloat(variant.price),
      });
    });
  });

  variants.sort((a, b) => a.price - b.price);

  variants.forEach(variant => {
    console.log(`${variant.product} - ${variant.variant} - price $${variant.price}`);
  });
};

const main = async () => {
  const args = process.argv.slice(2);
  let productName;

  // Check if -name flag is present and get the product name
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-name' && args[i + 1]) {
      productName = args[i + 1];
      break;
    }
  }

  if (!productName) {
    console.error('--------------------------------------------------------');
    console.error('Please provide a product name using -name <product-name>');
    console.error('--------------------------------------------------------');
    process.exit(1);
  }

  const products = await getProductsByName(productName);

  if (!products || products.length === 0) {
    console.error('-----------------------------------------------');
    console.error('Ut oh! Cannot find any products with that name.');
    console.error('-----------------------------------------------');
    process.exit(1);
  }

  // console.log("--> Products: " + JSON.stringify(products));

  listVariantsByPrice(products);
};

main();
