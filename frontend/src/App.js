import "./App.css";
import AdminPanelView from "./views/AdminPanelView";
import Header from "./components/Templates/Header";
import Footer from "./components/Templates/Footer";

function App() {
    return (
        <div className="App">
            <Header />
            <AdminPanelView />
            <Footer />
        </div>
    );
}

export default App;
