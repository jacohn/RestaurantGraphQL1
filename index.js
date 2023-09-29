const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const restaurants = [
 {
    "id": 1,
    "name": "WoodsHill",
    "description":
      "American cuisine, farm to table, with fresh produce every day",
      "dishes": [
      {
        "name": "Swordfish Grill",
        "price": 27,
      },
      {
        "name": "Roasted Broccoli",
        "price": 11,
      },
    ],
  },
  {
    "id": 2,
    "name": "Fiorellas",
    "description":
      "Italian-American home cooked food with fresh pasta and sauces",
    "dishes": [
      {
        "name": "Flatbread",
        "price": 14,
      },
      {
        "name": "Carbonara",
        "price": 18,
      },
      {
        "name": "Spaghetti",
        "price": 19,
      },
    ],
  },
  {
    "id": 3,
    "name": "Karma",
    "description":
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    "dishes": [
      {
        "name": "Dragon Roll",
        "price": 12,
      },
      {
        "name": "Pancake Roll ",
        "price": 11,
      },
      {
        "name": "Cod Cakes",
        "price": 13,
      },
    ],
  },
];

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    restaurant(id: Int!): Restaurant
    restaurants: [Restaurant]
  }

  type Restaurant {
    id: Int
    name: String
    description: String
    dishes: [Dish!]
  }

  type Dish {
    name: String
    price: Int
  }

  input RestaurantInput {
    name: String
    description: String
  }

  type DeleteResponse {
    ok: Boolean!
  }

  type Mutation {
    setRestaurant(input: RestaurantInput): Restaurant
    deleteRestaurant(id: Int!): DeleteResponse
    editRestaurant(id: Int!, name: String!): Restaurant
  }
`);

const root = {
  restaurant: ({ id }) => restaurants.find(restaurant => restaurant.id === id),
  restaurants: () => restaurants,
  setRestaurant: ({ input }) => {
    const newRestaurant = {
      id: restaurants.length + 1, // Assigning a new ID
      name: input.name,
      description: input.description,
      dishes: []
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleteRestaurant: ({ id }) => {
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index !== -1) {
      restaurants.splice(index, 1);
      return { ok: true };
    }
    return { ok: false };
  },
  editRestaurant: ({ id, name }) => {
    const restaurant = restaurants.find(restaurant => restaurant.id === id);
    if (!restaurant) {
      throw new Error("Restaurant doesn't exist");
    }
    restaurant.name = name;
    return restaurant;
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = 5500;
app.listen(port, () => console.log("Running GraphQL on Port:" + port));

module.exports = root; // Changed 'export default' to 'module.exports' for CommonJS syntax.