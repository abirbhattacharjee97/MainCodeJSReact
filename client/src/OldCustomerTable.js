import axios from "axios";
import React from "react";
import "./style.css"; // import the CSS file here

const client = axios.create({
  baseURL: "http://localhost:3001"
});

const ITEMS_PER_PAGE = 2;

export default function App() {
  const [customers, setCustomers] = React.useState([]);
  const [user, setUser] = React.useState("");
  const [bundle, setBundle] = React.useState("");
  const [bid1, setBid1] = React.useState("");
  const [bid2, setBid2] = React.useState(""); 
  const [currentPage, setCurrentPage] = React.useState(1); 

  

  React.useEffect(() => {
    async function getPost() {
      const response = await client.get("/bundles");
      setCustomers(response.data);
      console.log(response.data);
    }
    getPost();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await client.post("/bundles", {
      user: user,
      bundle: bundle,
      bid1: bid1,
      bid2: bid2
    });
    console.log(response.user,response.bundle, response.bid1,response.bid2);

    console.log(event);

    setCustomers([...customers, response.data]);
    setUser("");
    setBundle("");
    setBid1("");
    setBid2("");
  }

  console.log(customers);

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE); // 3
  const start = (currentPage - 1) * ITEMS_PER_PAGE; // 0
  const end = start + ITEMS_PER_PAGE; // 2

  const handleNextPage = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages));
    // console.log(currentPage);
  };

  const getCustomerRows = () => {
    console.log(currentPage);
    console.log(start);
    console.log(end);

    return customers.slice(start, end).map((customer) => (
      <tr key={customer.bundle_id}>
        <td>{customer.bundle_id}</td>
        <td>{customer.bundle}</td>
        <td>{customer.request_id}</td>
        <td>{customer.WEEKP}</td>
        <td>{customer.CROP}</td>
        <td>{customer.Value}</td>
      </tr>
    ));
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
          {customers.slice(start, end).map((customer) => ( 
            <tr key={customer.bundle_id}>
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
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={end >= customers.length}>
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
        <div className="input-group">
          <label htmlFor="bid2">Enter bid for 2nd Crop:</label>
          <input type="number" id="bid2" value={bid2} onChange={(event) => setBid2(event.target.value)} required />
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
