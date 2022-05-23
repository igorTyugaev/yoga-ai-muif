import React from 'react';
import {useHistory} from "react-router-dom";
import classNames from "classnames";
import style from "./CloseBtn.module.scss"

const CloseBtn = ({className}) => {
    const history = useHistory();

    return (
        <button className={classNames(className, style.CloseBtn)}
                onClick={() => {
                    history.goBack();
                }}/>
    );
};

export default CloseBtn;