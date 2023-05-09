import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css"; // import the CSS file here

const client = axios.create({
  baseURL: "http://localhost:8000"
});

const ITEMS_PER_PAGE = 2;

export default function App() {
  const [customers, setCustomers] = React.useState([]);
  const [user, setUser] = React.useState("");
  const [bundle, setBundle] = React.useState("");
  const [bid1, setBid1] = React.useState("");
  const [bid2, setBid2] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(2);
  const [paginatedData, setPaginatedData] = React.useState([])
  const [checkLastRow, setcheckLastRow] = React.useState([true])

  React.useEffect(() => {
    async function getPost() {
      const response = await client.get("/bundles");
      setCustomers(response.data);
    }
    getPost();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await client.post("/bundles", {
      user: user,
      bundle: bundle,
      bid1: bid1,
      bid2: checkLastRow?bid2: 0
    });
    console.log(response.user, response.bundle, response.bid1, response.bid2);

    setCustomers([...customers, response.data]);
    setUser("");
    setBundle("");
    setBid1("");
    setBid2("");
  }


  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE); // 3

  useEffect(() => {
    setStart((currentPage - 1) * ITEMS_PER_PAGE)
    setEnd(((currentPage - 1) * ITEMS_PER_PAGE) + ITEMS_PER_PAGE)
  }, [currentPage])

  useEffect(() => {
    setPaginatedData(customers.slice(start, end))
  }, [start, end, customers])

  useEffect(()=>{
    console.log("page",paginatedData)
  },[paginatedData])

  const handleNextPage = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages));
  };



  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>bundle_id</th>
            <th>bundle</th>
            <th>request_id</th>
            <th>WEEKP</th>
            <th>CROP</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((customer) => (
            <tr key={customer.request_id}>
              <td>{customer.bundle_id}</td>
              <td>{customer.bundle}</td>
              <td>{customer.request_id}</td>
              <td>{customer.WEEKP}</td>
              <td>{customer.CROP}</td>
              <td>{customer.Value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => {
          setCurrentPage(currentPage + 1)
          if (currentPage + 1 == totalPages && customers.length % 2 == 1 ) {setcheckLastRow(false); }
          }
        } disabled={end >= customers.length}>
          Next
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="user">Enter user_id:</label>
          <input type="text" id="user" value={user} onChange={(event) => setUser(event.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="bundle">Enter bundle:</label>
          <input type="text" id="bundle" value={bundle} onChange={(event) => setBundle(event.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="bid1">Enter bid for 1st Crop:</label>
          <input type="number" id="bid1" value={bid1} onChange={(event) => setBid1(event.target.value)} required />
        </div>
        {checkLastRow && (
          <div className="input-group">
            <label htmlFor="bid2">Enter bid for 2nd Crop:</label>
            <input type="number" id="bid2" value={bid2} onChange={(event) => setBid2(event.target.value)} required />
          </div>
        )}
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
