import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css"; // import the CSS file here

const client = axios.create({
  baseURL: "http://localhost:8000"
});

export default function App() {
  const [winners, setWinners] = React.useState([]);

  React.useEffect(() => {
    async function getPost() {
      const response = await client.get("/winner");
      setWinners(response.data);
      console.log(response.data);
    }
    getPost();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>bundle</th>
          <th>user_id</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.name}</td>
            <td>{row.age}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
