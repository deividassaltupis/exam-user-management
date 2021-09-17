import React from "react";

import styles from "./Input.module.css";

const Input = ({ type, label, refPass, value }) => {
    return (
        <div>
            {label && <label className={styles.label}>{label}</label>}
            <input
                type={type}
                ref={refPass}
                defaultValue={value}
                className={styles.input}
            ></input>
        </div>
    );
};

export default Input;
