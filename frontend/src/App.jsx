import { useEffect, useState } from "react";
import api from "./api/api";

function App() {

    const [status, setStatus] = useState("Checking backend...");

    useEffect(() => {

        const checkBackend = async () => {
            try {

                const response = await api.get("/health");

                setStatus(response.data.message);

            } catch (error) {

                console.error(error);

                setStatus("Backend connection failed");
            }
        };

        checkBackend();

    }, []);

    return (
        <div>
            <h1>Shop Management</h1>

            <p>{status}</p>
        </div>
    );
}

export default App;