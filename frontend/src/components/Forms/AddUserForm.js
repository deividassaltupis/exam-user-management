import React, { useRef, useState, useContext } from "react";
import axios from "axios";
import { USER_URI } from "../../utils/endpoints";
import { UserListContext } from "../../views/AdminPanelView";

import Button from "../Buttons/Button";
import Input from "../Inputs/Input";

import alertStyle from "../../styles/alert.module.css";
import styles from "./AddUserForm.module.css";

const AddUserForm = () => {
    const { users, setUsers } = useContext(UserListContext);

    const nameInputRef = useRef();
    const ageInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const messageStyleRef = useRef("");

    const [message, setMessage] = useState("");

    const displayMessageAlert = (msg, msgStyle) => {
        messageStyleRef.current = msgStyle;
        setMessage(msg);
    };

    const addUserHandler = async (e) => {
        e.preventDefault();

        setMessage("");

        const name = nameInputRef.current.value;
        const age = ageInputRef.current.value;
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value;

        if (!name || !age || !email || !password) {
            displayMessageAlert(
                "Prašome užpildyti visus formos laukelius !",
                [alertStyle.alert, alertStyle.danger].join(" ")
            );
            return;
        }

        if (isNaN(age)) {
            displayMessageAlert(
                "Prašome nurodyti teisingą amžiaus skaitmenį.",
                [alertStyle.alert, alertStyle.danger].join(" ")
            );
            return;
        }

        const user = {
            name: name,
            age: age,
            email: email,
            password: password,
        };

        const createdUser = await axios
            .post(USER_URI, { user: user })
            .then((res) => {
                displayMessageAlert(
                    "Vartotojas sėkmingai pridėtas",
                    [alertStyle.alert, alertStyle.success].join(" ")
                );
                return res.data.user;
            })
            .catch((err) => {
                if (err.response.status === 401 || err.response.status === 400)
                    displayMessageAlert(
                        err.response.data.message,
                        [alertStyle.alert, alertStyle.danger].join(" ")
                    );
            });

        if (createdUser) {
            const userArray = [...users];
            userArray.push(createdUser);
            setUsers(userArray);
        }

        nameInputRef.current.value = "";
        ageInputRef.current.value = "";
        emailInputRef.current.value = "";
        passwordInputRef.current.value = "";
    };

    return (
        <form className={styles.form}>
            {message && <p className={messageStyleRef.current}>{message}</p>}
            <Input
                type={"text"}
                label={"Vartotojo vardas:"}
                refPass={nameInputRef}
            />
            <Input type={"text"} label={"Amžius:"} refPass={ageInputRef} />
            <Input
                type={"email"}
                label={"El. pašto adresas:"}
                refPass={emailInputRef}
            />
            <Input
                type={"password"}
                label={"Slaptažodis"}
                refPass={passwordInputRef}
            />
            <Button
                btnSyle={"success"}
                label={"Pridėti"}
                func={(e) => addUserHandler(e)}
            />
        </form>
    );
};

export default AddUserForm;
