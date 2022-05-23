import React from 'react';
import classNames from "classnames";
import style from "./Action.module.scss"

const Action = ({className}) => {
    return (
        <div className={classNames(className)}>
            <div className={classNames(style.ActionInner)}>
                <button className={classNames(style.ActionBtn)}>
                    Продолжить тренировку
                </button>
                <h3 className={classNames(style.ActionTime)}>
                    25
                    <span>мин.</span>
                </h3>
            </div>
        </div>
    );
};

export default Action;