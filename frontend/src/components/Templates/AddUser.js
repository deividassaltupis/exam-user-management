import React from "react";
import AddUserForm from "../Forms/AddUserForm";
import styles from "./AddUser.module.css";

const AddUser = () => {
    return (
        <div className={styles.addUserBox}>
            <h2>Sukurti naują vartotoją</h2>
            <AddUserForm />
        </div>
    );
};

export default AddUser;
