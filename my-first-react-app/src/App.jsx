import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [isLoading, setLoading] = useState(true);
    const [discussions, setDiscussions] = useState([]);
    const [error, setError] = useState(null);

    const baseurl = "https://team-dawgs.dokku.cse.lehigh.edu";

    useEffect(() => {
        axios.get(`${baseurl}/discussions`)
            .then((response) => {
                console.log({ response });
                if (response.data.mStatus === "ok") {
                    setDiscussions(response.data.mData);
                } else {
                    setError("Failed to fetch discussions");
                }
            })
            .catch((error) => {
                console.error("Error fetching discussions:", error);
                setError("Failed to fetch discussions");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const doAjax = async (title, msg) => {
        try {
            const response = await axios.post(`${baseurl}/discussions`, {
                mTitle: title,
                mMessage: msg
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(`The server replied not ok: ${response.status}\n${response.statusText}`);
            }
        } catch (error) {
            console.warn('Something went wrong.', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newDiscussion = {
            mTitle: formData.get("title"),
            mMessage: formData.get("body")
        };

        console.log("New Discussion Data:", newDiscussion); // Log the data before sending

        try {
            const response = await doAjax(newDiscussion.mTitle, newDiscussion.mMessage);
            console.log("New discussion created:", response);
            if (response.mStatus === "ok") {
                setDiscussions([...discussions, response]);
                e.target.reset();
                setError(null); // Reset error state on successful creation
            } else {
                setError("Failed to create discussion: " + response.mMessage);
            }
        } catch (error) {
            console.error("Error creating discussion:", error);
            setError("Failed to create discussion: " + error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="App">
                <h1 className="geeks">GeeksforGeeks</h1>
                <div>Loading...</div>
            </div>
        );
    } else {
        return (
            <div className="App">
                <h1 className="geeks">GeeksforGeeks</h1>
                <h3>React JS CORS Options</h3>
                <h4>No CORS error in the console window</h4>
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Title:</label>
                            <input type="text" name="title" required />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea name="body" required />
                        </div>
                        <button type="submit">Submit</button>
                        {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
                    </form>
                    {discussions.map((discussion, index) => (
                        <div className="item" key={index}>
                            <div>
                                <b>Title: </b>
                                {discussion.mTitle}
                            </div>
                            <div>
                                <b>Description: </b>
                                {discussion.mContent}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default App;