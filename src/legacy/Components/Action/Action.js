import React from 'react';
import classNames from "classnames";
import {Button} from "@mui/material";
import style from "./Action.module.scss"

const Action = ({className}) => {
    return (
        <div className={classNames(className)}>
            <div className={classNames(style.ActionInner)}>
                <Button variant="outlined" size="large">
                    Продолжить тренировку
                </Button>
                <h3 className={classNames(style.ActionTime)}>
                    25
                    <span>мин.</span>
                </h3>
            </div>
        </div>
    );
};

export default Action;