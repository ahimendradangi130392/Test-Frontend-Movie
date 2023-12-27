import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";

const EditMovie = (props) => {
  const params = useParams();
  const movieId = params.id;
  const [title, setTitle] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [image, setImage] = useState(null);
  const [movie, setMovie] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `http://103.186.184.179:3003/api/movie/${movieId}`,
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
        setMovie(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovie();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Display the selected image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleUpdateMovie = async () => {
    setBtnDisable(true);
    setLoading(true);
    const formData = new FormData();
    formData.append("id", movie.id);
    formData.append("title", title || movie.title);
    formData.append("publishingYear", publishingYear || movie.publishingYear);

    if (image) {
      formData.append("file", image);
    }

    try {
      const response = await fetch(`http://103.186.184.179:3003/api/movie`, {
        method: "PATCH",
        mode: "cors",
        body: formData,
      });

      if (response.ok) {
        alert("Movie updated successfully!");
        setBtnDisable(false);
        setLoading(false);
        navigate("/");
      } else {
        console.error("Failed to update movie");
        setBtnDisable(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      setBtnDisable(false);
      setLoading(false);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }
  const handleCancel = () => {
    navigate("/");
  };

  const renderInputs = () => {
    return (
      <>
        <div>
          <input
            className="inputtext"
            type="text"
            placeholder="Title"
            defaultValue={title || movie.title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <input
            className="inputtext year-select"
            type="number"
            placeholder="Publishing year"
            defaultValue={publishingYear || movie.publishingYear}
            onChange={(e) => setPublishingYear(e.target.value)}
          />
        </div>
      </>
    );
  };

  const renderImageUpload = () => {
    return (
      <div className="input-file-box">
        <input type="file" onChange={handleFileChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Selected"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        )}
        {!imagePreview && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clip-path="url(#clip0_3_407)">
                <path
                  d="M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM17 11L15.59 9.59L13 12.17V4H11V12.17L8.41 9.59L7 11L12 16L17 11Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_3_407">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <br />
            Drop an image here
          </div>
        )}
      </div>
    );
  };

  const renderFooterBtn = () => {
    return (
      <div className="footer-btn">
        <Button className="cancel" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          className={`successbtn ${btnDisable && "o-20"}`}
          disabled={btnDisable}
          loading={loading}
          onClick={handleUpdateMovie}
        >
          Update
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-img">
      <div className="show-movie-section container">
        <div>
          <h2>Edit</h2>
        </div>
        <div className="img-upload-page">
          {renderImageUpload()}
          <div>
            {renderInputs()}
            {renderFooterBtn()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovie;
