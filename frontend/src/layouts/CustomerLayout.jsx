import Navbar from "../components/Navbar";

function CustomerLayout({ children }) {
    return (
        <>
            <Navbar />

            <main>
                {children}
            </main>
        </>
    );
}

export default CustomerLayout;