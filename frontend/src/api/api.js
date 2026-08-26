import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 15000
});


// ================================
// REQUEST INTERCEPTOR
// ================================

api.interceptors.request.use(
    (config) => {
        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ================================
// RESPONSE INTERCEPTOR
// ================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        // No response from server
        if (!error.response) {

            console.error(
                "Backend/network connection failed:",
                error.message
            );

            return Promise.reject(error);
        }


        const status =
            error.response.status;


        // Rate limiting
        if (status === 429) {

            console.warn(
                "Too many requests sent to backend."
            );
        }


        // Server error
        if (status >= 500) {

            console.error(
                "Backend server error:",
                error.response.data
            );
        }


        /*
            IMPORTANT:

            Do NOT globally redirect on 401.

            We have TWO auth systems:

            customerToken
            adminToken

            Customer pages handle customer 401.
            Admin ProtectedRoute handles admin authentication.
        */


        return Promise.reject(error);
    }
);


export default api;