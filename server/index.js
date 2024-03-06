const express = require('express');
const app = express();
app.use(express.json());

const { client, createTables, createCustomer, createRestaurant, fetchCustomer, fetchRestaurant, createReservation, fetchReservation, destroyReservation } = require('./db');

app.get('/api/customer', async(req, res, next) => {
    try {
        res.send(await fetchCustomer());
    } catch(ex) {
        next(ex);
    }
});

app.get('/api/restaurant', async(req, res, next) => {
    try {
        res.send(await fetchRestaurant());
    } catch(ex) {
        next(ex);
    }
});

app.get('/api/reservation', async(req, res, next) => {
    try {
        res.send(await fetchReservation());
    } catch(ex) {
        next(ex);
    }
});

app.post('/api/reservation', async(req, res, next) => {
    const { customer_id, restaurant_id, party_count, date } = req.body;
    try {
       res.send(await createReservation(customer_id, restaurant_id, party_count, date));
    } catch(ex) {
        next(ex);
    }
});

app.delete('/api/reservation/:id', async (req, res, next) => {
    try {
        await destroyReservation(req.params.id);
        res.sendStatus(204);
    } catch(ex) {
        next(ex);
    }
});

const init = async() => {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const[alex, diane, mary, phil, elefino, elefante, parmadillos] = await Promise.all([
        createCustomer('Alex'),
        createCustomer('Diane'),
        createCustomer('Mary'),
        createCustomer('Phil'),
        createRestaurant('Elefante'),
        createRestaurant('Elefino'),
        createRestaurant('Parmadillos')
    ]);
    console.log(await fetchCustomer());
    console.log(await fetchRestaurant());
    const [reservation1, reservation2, reservation3] = await Promise.all([
        createReservation(alex.id, elefante.id, '4', '2024-02-26'),
        createReservation(diane.id, elefino.id, '3', '2024-04-25'),
        createReservation(phil.id, parmadillos.id, '2', '2024-10-03')
    ]);
    await destroyReservation(reservation1.id);
    console.log(await fetchReservation());
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};

init();