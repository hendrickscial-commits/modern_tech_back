import mysql from 'mysql2/promise';

//
export const pool = mysql.createPool({
  user:'root',
  host:'localhost',
  password:'Billie#1',
  database:'modern_tech',
  port: '3307'
})