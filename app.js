const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Car = require('./models/car');

const app = express();



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type Car {
          _id: ID!
          model: String!
          description: String!
          price: Float!
          date: String!
        }

        input CarInput {
          model: String!
          description: String!
          price: Float!
          date: String!
        }

        input UpdateCarInput {
          id: String!
          model: String!
          description: String!
          price: Float!
        }

        type RootQuery {
            cars: [Car!]!
        }

        type RootMutation {
            addCar(carInput: CarInput): Car
            removeCar(carId: ID!): Car
            updateCar(updateCarInput: UpdateCarInput): Car
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      cars: () => {
        return Car.find()
          .then(cars => {
            return cars.map(car => {
              return { ...car._doc, _id: car.id };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      addCar: args => {
        const car = new Car({
          model: args.carInput.model,
          description: args.carInput.description,
          price: +args.carInput.price,
          date: new Date(args.carInput.date)
        });
        return car
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc, _id: result._doc._id.toString() };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      removeCar: args => {
        try {
          return Car.deleteOne({ _id: args.carId });
        } catch (err) {
          throw err;
        }
      },
      updateCar: args => {
        try {
          return Car.findOneAndUpdate({_id: args.updateCarInput.id}, {model: args.updateCarInput.model, description: args.updateCarInput.description, price: args.updateCarInput.price});
        } catch (err) {
          throw err;
        }
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@maincluster-xkbq9.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });
