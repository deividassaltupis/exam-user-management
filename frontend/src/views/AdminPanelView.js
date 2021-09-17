import React, { useState, useEffect } from "react";
import axios from "axios";
import AddUser from "../components/Templates/AddUser";
import UserManagement from "../components/Templates/UserManagement";
import { USER_URI } from "../utils/endpoints";

export const UserListContext = React.createContext();

const AdminPanelView = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => fetchUsers(USER_URI), []);

    const fetchUsers = (URI) => {
        axios
            .get(URI)
            .then((res) => setUsers(res.data))
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <h1>Administratoriaus darbalaukis</h1>
            <UserListContext.Provider value={{ users, setUsers }}>
                <UserManagement />
                <AddUser />
            </UserListContext.Provider>
        </div>
    );
};

export default AdminPanelView;
