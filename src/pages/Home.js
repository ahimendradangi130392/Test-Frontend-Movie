import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

const Home = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/signIn");
  };

  useEffect(() => {
    (async () => {
      await fetchMovies();
    })();
  }, [currentPage]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `http://103.186.184.179:3003/api/movie?limit=8&page=${currentPage}`,
        {
          method: "GET",
          mode: "cors", // Enable CORS
          headers: {
            "Content-Type": "application/json",
            // You can add other headers as needed
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setMovies(data.items);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span
          className={currentPage === i ? "active" : ""}
          key={i}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  };

  const renderEmptyList = () => {
    return (
      <div className="signincontainer ">
        <div className="homepagecontainer">
          <div className="emptypage">
            <h2>Your movie list is empty</h2>
            <button
              className="successbtn"
              onClick={() => navigate("/CreateMovie")}
            >
              Add a new movie
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMovieList = () => {
    return (
      <div className="bg-img">
        <div className="show-movie-section container">
          {renderHeader()}
          <div>
            <Card>{renderCard()}</Card>
            {renderPagination()}
          </div>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    return (
      <div className="pagination">
        <button
          onClick={prevPage}
          className={`pre ${currentPage === 1 ? "preopacity" : ""}`}
          disabled={currentPage === 1}
        >
          prev
        </button>
        {renderPageNumbers()}
        <button
          onClick={nextPage}
          className={`next ${
            currentPage === totalPages ? "nextopacity" : "disabled"
          }`}
          disabled={currentPage === totalPages}
        >
          next
        </button>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="movieheader">
        <h2>
          My movies
          <span>
            <Link to="/CreateMovie">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <g clip-path="url(#clip0_3_196)">
                  <path
                    d="M17.3334 9.33332H14.6667V14.6667H9.33342V17.3333H14.6667V22.6667H17.3334V17.3333H22.6667V14.6667H17.3334V9.33332ZM16.0001 2.66666C8.64008 2.66666 2.66675 8.63999 2.66675 16C2.66675 23.36 8.64008 29.3333 16.0001 29.3333C23.3601 29.3333 29.3334 23.36 29.3334 16C29.3334 8.63999 23.3601 2.66666 16.0001 2.66666ZM16.0001 26.6667C10.1201 26.6667 5.33341 21.88 5.33341 16C5.33341 10.12 10.1201 5.33332 16.0001 5.33332C21.8801 5.33332 26.6667 10.12 26.6667 16C26.6667 21.88 21.8801 26.6667 16.0001 26.6667Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3_196">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
          </span>
        </h2>
        {renderLogoutBtn()}
      </div>
    );
  };

  const renderLogoutBtn = () => {
    return (
      <Button className="logoutbtn" onClick={handleLogOut}>
        Logout
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <g clip-path="url(#clip0_7_232)">
            <path
              d="M22.6667 10.6667L20.7867 12.5467L22.8933 14.6667H12V17.3333H22.8933L20.7867 19.44L22.6667 21.3333L28 16L22.6667 10.6667ZM6.66667 6.66667H16V4H6.66667C5.2 4 4 5.2 4 6.66667V25.3333C4 26.8 5.2 28 6.66667 28H16V25.3333H6.66667V6.66667Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_7_232">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </Button>
    );
  };

  const renderCard = () => {
    return (
      <>
        {movies.map((movie) => (
          <div className="card text-left">
            <Link
              to={{
                pathname: `/EditMovie/${movie.id}`,
                state: { name: "ankit" },
              }}
            >
              <img
                className="card-img-top"
                crossOrigin="anonymous"
                src={movie.file}
                alt={movie.title}
              />
              <div className="card-body">
                <h4 className="card-title">{movie.title}</h4>
                <p className="card-text">{movie.publishingYear}</p>
              </div>
            </Link>
          </div>
        ))}
      </>
    );
  };

  return movies.length === 0 ? renderEmptyList() : renderMovieList();
};

export default Home;
