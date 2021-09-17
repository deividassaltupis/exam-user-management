import React from "react";
import styles from "./Button.module.css";

const Button = ({ label, func, btnSyle }) => {
    const classList = [styles.button];
    switch (btnSyle) {
        case "primary": {
            classList.push(styles.primary);
            break;
        }
        case "secondary": {
            classList.push(styles.secondary);
            break;
        }
        case "danger": {
            classList.push(styles.danger);
            break;
        }
        case "success": {
            classList.push(styles.success);
            break;
        }
    }
    return (
        <button onClick={func} className={classList.join(" ")}>
            {label}
        </button>
    );
};

export default Button;
