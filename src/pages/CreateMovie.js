import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const CreateMovie = () => {
  const [title, setTitle] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    publishingYear: "",
  });
  const navigate = useNavigate();

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

  const handleAddMovie = async () => {
    setBtnDisable(true);
    setLoading(true);
    const newErrors = {};
    let isValid = true;

    if (!title) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!publishingYear) {
      newErrors.publishingYear = "Publishing year is required";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      setBtnDisable(false);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("publishingYear", publishingYear);
    formData.append("file", image);

    try {
      const response = await fetch("http://103.186.184.179:3003/api/movie", {
        method: "POST",
        mode: "cors",
        body: formData,
      });

      if (response.ok) {
        alert("Movie added successfully!");
        setBtnDisable(false);
        setLoading(false);
        navigate("/");
      } else {
        console.error("Failed to add movie");
        setBtnDisable(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      setBtnDisable(false);
      setLoading(false);
    }
  };
  const handleCancel = () => {
    navigate("/");
  };

  const renderInputs = () => {
    return (
      <>
        <div className="input-field">
          <input
            className="inputtext"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors({ ...errors, title: "" }); // Clear error when typing
            }}
          />
          {errors.title && (
            <p className="error-message" style={{ color: "red" }}>
              {errors.title}
            </p>
          )}
        </div>
        <div className="input-field">
          <input
            className="inputtext year-select"
            type="number"
            placeholder="Publishing year"
            value={publishingYear}
            onChange={(e) => {
              setPublishingYear(e.target.value);
              setErrors({ ...errors, publishingYear: "" }); // Clear error when typing
            }}
          />
          {errors.publishingYear && (
            <p className="error-message" style={{ color: "red" }}>
              {errors.publishingYear}
            </p>
          )}
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
          onClick={handleAddMovie}
        >
          Add Movie
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-img">
      <div className="show-movie-section container">
        <div>
          <h2>Create a new movie</h2>
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

export default CreateMovie;
