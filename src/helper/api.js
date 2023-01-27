import React from "react";
import axios from "axios";


const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

// export const postProduct = () => {
//   return axios
//     .post("/product",)
//     .then((response) => response.data)
//     .catch((error) => console.log(error));
// };

// export const getProduct = () => {
//   return axios
//     .get("https://jsonplaceholder.typicode.com/todos/1")
//     .then((response) => response.data)
//     .catch((error) => console.log(error));
// };

// export const putProduct = () => {
//   return axios
//     .put("https://jsonplaceholder.typicode.com/todos/1")
//     .then((response) => response.data)
//     .catch((error) => console.log(error));
// };

// export const deleteProduct = () => {
//   return axios
//     .delete("https://jsonplaceholder.typicode.com/todos/1")
//     .then((response) => response.data)
//     .catch((error) => console.log(error));
// };

// export const postCategory = () => {
//   return axios
//     .post("https://jsonplaceholder.typicode.com/todos/1")
//     .then((response) => response.data)
//     .catch((error) => console.log(error));
// };

export default api;


