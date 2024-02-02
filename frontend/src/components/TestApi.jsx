import React, { useState} from "react";
import axios from "axios";
import Button from "./elements/Button";

export const TestApi = () => {
    const [url, setUrl] = useState("");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/shorten-url/",
        { url: String(url) }, // Ensure that the URL is sent as a string
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true, // Add credentials
                }
            );
            console.log("Shorten URL Response:", response.data);
            setResponse(response.data);
            setError(null);
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter URL:
          <input type="text" value={url} onChange={handleUrlChange} />
        </label>
        <Button type="submit">Submit</Button>
      </form>
      {response && (
        <div>
          Response:
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  );
};