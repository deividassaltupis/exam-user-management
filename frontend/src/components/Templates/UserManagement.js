import React, { useContext, useState, useRef } from "react";
import { UserListContext } from "../../views/AdminPanelView";
import Button from "../Buttons/Button";
import Input from "../Inputs/Input";
import { USER_URI } from "../../utils/endpoints";
import axios from "axios";

import alertStyle from "../../styles/alert.module.css";
import styles from "./UserManagement.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const UserManagement = () => {
    const { users, setUsers } = useContext(UserListContext);
    const [selectedUser, setSelectedUser] = useState(null);

    const messageStyleRef = useRef("");

    const editNameInputRef = useRef();
    const editEmailInputRef = useRef();
    const editAgeInputRef = useRef();
    const editPasswordInputRef = useRef();

    const [message, setMessage] = useState("");

    const displayMessageAlert = (msg, msgStyle) => {
        messageStyleRef.current = msgStyle;
        setMessage(msg);
    };

    const editButtonHandler = (user) => setSelectedUser(user);

    const deleteButtonHandler = async (userID) => {
        const deletedUser = await axios
            .delete(USER_URI + userID)
            .then((res) => {
                displayMessageAlert(
                    res.data.message,
                    [alertStyle.alert, alertStyle.success].join(" ")
                );
                return res.data.user;
            })
            .catch((err) => {
                displayMessageAlert(
                    err.response.data.message,
                    [alertStyle.alert, alertStyle.danger].join(" ")
                );
                return false;
            });
        console.log(deletedUser);
        if (deletedUser) {
            const userArray = users;
            const filteredArray = userArray.filter(
                (user) => user._id !== deletedUser._id
            );
            setUsers(filteredArray);
        }
    };

    const saveChangesButtonHandler = async () => {
        const name = editNameInputRef.current.value;
        const age = editAgeInputRef.current.value;
        const email = editEmailInputRef.current.value;
        const password = editPasswordInputRef.current.value;

        if (!name || !age || !email) {
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

        const updatedUser = await axios
            .put(USER_URI + selectedUser._id, { user: user })
            .then((res) => {
                displayMessageAlert(
                    "Vartotojo duomenys sėkmingai atnaujinti",
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

        if (updatedUser) {
            const userArray = [...users];
            userArray.forEach((user, index, arr) => {
                if (user._id === updatedUser._id) arr[index] = updatedUser;
            });
            setUsers(userArray);
        }
        setSelectedUser(null);
    };

    const cancelEditorButtonHandler = () => {
        setSelectedUser(null);
    };

    return (
        <div className={styles.userManagementBox}>
            <h2>Vartotojų tvarkymas</h2>
            {message && <p className={messageStyleRef.current}>{message}</p>}
            {users.length ? (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Vardas</th>
                                <th>El. paštas</th>
                                <th>Amžius</th>
                                <th>Slaptažodis</th>
                                <th>Veiksmai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    {selectedUser &&
                                    selectedUser._id === user._id ? (
                                        <>
                                            <td>
                                                <Input
                                                    type={"text"}
                                                    value={user.name}
                                                    refPass={editNameInputRef}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type={"email"}
                                                    value={user.email}
                                                    refPass={editEmailInputRef}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type={"text"}
                                                    value={user.age}
                                                    refPass={editAgeInputRef}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type={"password"}
                                                    refPass={
                                                        editPasswordInputRef
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <Button
                                                    label={"Išsaugoti"}
                                                    func={() =>
                                                        saveChangesButtonHandler()
                                                    }
                                                    btnSyle={"success"}
                                                />
                                                <Button
                                                    label={
                                                        "Atšaukti redagavimą"
                                                    }
                                                    func={
                                                        cancelEditorButtonHandler
                                                    }
                                                    btnSyle={"secondary"}
                                                />
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.age}</td>
                                            <td>
                                                <span
                                                    className={styles.redText}
                                                >
                                                    *
                                                </span>
                                            </td>
                                            <td>
                                                <Button
                                                    label={"Redaguoti"}
                                                    func={() =>
                                                        editButtonHandler(user)
                                                    }
                                                    btnSyle={"primary"}
                                                />
                                                <Button
                                                    label={"Pašalinti"}
                                                    func={() =>
                                                        deleteButtonHandler(
                                                            user._id
                                                        )
                                                    }
                                                    btnSyle={"danger"}
                                                />
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className={styles.infoAlert}>
                        <FontAwesomeIcon icon={faEyeSlash} size="lg" />
                        <span>
                            <span className={styles.redText}>*</span> Vartotojų
                            slaptažodžiai duomenų bazėje yra užšifruoti ir
                            lentelėje nerodomi konfidencialumo ir saugumo
                            sumetimais, tačiau juos galima atnaujinti
                        </span>
                    </p>
                </>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default UserManagement;
