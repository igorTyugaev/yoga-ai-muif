import React from 'react';
import classNames from "classnames";
import style from "./Button.module.scss";

const Button = ({className, children, accent = false, ...props}) => {
    return (
        <button className={classNames(className, style.Button, {[style.Button_color_uplift]: accent})} {...props}>
            {children}
        </button>
    );
};

export default Button;