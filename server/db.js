const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgress://localhost/acme_reservation_planner_db');
const uuid = require('uuid');

const createTables = async() => {
    const SQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurant;
        
        CREATE TABLE customer(
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );

        CREATE TABLE restaurant(
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );

        CREATE TABLE reservation(
            id UUID PRIMARY KEY,
            customer_id UUID REFERENCES customer(id) NOT NULL,
            restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
            party_count INTEGER NOT NULL,
            date DATE NOT NULL
        );
        `;
    await client.query(SQL);
};

const createCustomer = async(name) => {
    const SQL = `
        INSERT INTO customer(id, name) VALUES($1, $2)
        RETURNING *
        `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const createRestaurant = async(name) => {
    const SQL = `
        INSERT INTO restaurant(id, name) VALUES($1, $2)
        RETURNING *
        `;
    const response = await client.query(SQL, [uuid.v4(), name]);
};

const createReservation = async(customer_id, restaurant_id, party_count, date) => {
    const SQL = `
        INSERT INTO reservation(id, customer_id, restaurant_id, party_count, date)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
        `;
    const response = await client.query(SQL, [uuid.v4(), customer_id, restaurant_id, party_count, date]);
    return response.rows[0];
};

const fetchCustomer = async() => {
    const SQL = `
        SELECT *
        FROM customer
        `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchRestaurant = async() => {
    const SQL = `
        SELECT *
        FROM restaurant
        `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchReservation = async() => {
    const SQL = `
        SELECT *
        FROM reservation
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const destroyReservation = async(id) => {
    const SQL = `
        DELETE FROM reservation
        WHERE id=$1
        `;
    await client.query(SQL, [id]);
};

module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomer,
    fetchRestaurant,
    createReservation,
    fetchReservation,
    destroyReservation
};