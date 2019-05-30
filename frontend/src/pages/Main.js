import React, { Component } from 'react';

import './Main.css';

class MainPage extends Component {
  state = {
    creating: false,
    cars: []
  };


  constructor(props) {
    super(props);

    this.modelEl = React.createRef();
    this.descriptionEl = React.createRef();
    this.priceEl = React.createRef();
  }

  componentDidMount() {
    this.fetchCars();
  }
  
  fetchCars() {
    const requestBody = {
      query: `
          query {
            cars {
              _id
              model
              description
              date
              price
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const cars = resData.data.cars;
        this.setState({ cars: cars });
      })
      .catch(err => {
        console.log(err);
      });
  }


  submitHandler = car => {
    car.preventDefault();
    const model = this.modelEl.current.value;
    const description = this.descriptionEl.current.value;
    const price = parseFloat(this.priceEl.current.value);
    const date = new Date().toISOString();

    if (model.trim().length === 0 || description.trim().length === 0 || price.length === 0 || date.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
      mutation {
        addCar(carInput: {model: "${model}", description: "${description}", price: ${price}, date: "${date}"}) {
          _id
        }
      }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        alert("Success");
        this.fetchCars();
      })
      .catch(err => {
        console.log(err);
      });
  };

  updateHandler(e, id) {
    e.preventDefault();
    const model = document.getElementById('model_' + id);
    const description = document.getElementById('description_' + id);
    const price = document.getElementById('price_' + id);

    console.log()
    let requestBody = {
      query: `
      mutation {
        updateCar(updateCarInput: {id: "${id}", model: "${model.value}", description: "${description.value}", price: ${price.value}}) {
          _id
        }
      }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        alert("Success");
        this.fetchCars();
      })
      .catch(err => {
        console.log(err);
      });
  };

  deleteCar(id) {
    let requestBody = {
      query: `
      mutation {
        removeCar(carId: "${id}") {
          _id
        }
      }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        alert("Success");
        this.fetchCars();
      })
      .catch(err => {
        console.log(err);
      });
  }

  editCar(id) {
    let div = document.getElementById(id);
    if (div.classList.contains('cars__list-hidden')){
      div.classList.remove('cars__list-hidden')
    }else{
      div.classList.add('cars__list-hidden');
    }

  }

  render() {
    const carList = this.state.cars.map(car => {
      return (
        <li key={car._id} className="cars__list-item">
          <div className="cars__list-data">
              <div>
                Model - {car.model} | Description - {car.description} | Price - {car.price}
              </div>
              <div>
                <button className="cars__list-button" onClick={() => this.editCar(car._id)}>Edit</button>
                <button className="cars__list-button" onClick={() => this.deleteCar(car._id)}>Remove</button>            
              </div>
            </div>

            <div id={car._id} className="cars__list-hidden">
                <form onSubmit={(e) => this.updateHandler(e, car._id)}>
                <div className="form-control">
                  <label htmlFor="model">Model</label>
                  <input id={"model_" + car._id} type="text" defaultValue={car.model} />
                </div>
                <div className="form-control">
                  <label htmlFor="description">description</label>
                  <input id={"description_" + car._id} type="text" defaultValue={car.description} />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input id={"price_" + car._id} type="text" defaultValue={car.price} />
                </div>
                <div className="form-actions">
                  <button type="submit">Update</button>
                </div>
              </form>
            </div>
          </li>
      );
    });


    return (
      <div className="car-form">
        <h1>Add Cars to the MarketPlace</h1>
        <form onSubmit={this.submitHandler}>
          <div className="form-control">
            <label htmlFor="model">Model</label>
            <input type="text" id="model" ref={this.modelEl} />
          </div>
          <div className="form-control">
            <label htmlFor="description">description</label>
            <input type="text" id="description" ref={this.descriptionEl} />
          </div>
          <div className="form-control">
            <label htmlFor="price">Price</label>
            <input type="text" id="price" ref={this.priceEl} />
          </div>
          <div className="form-actions">
            <button type="submit">Add Car</button>
          </div>
        </form>

        <h1>MarketPlace</h1>
        <ul className="cars__list">{carList}</ul>
      </div>
    );
  }
}

export default MainPage;
