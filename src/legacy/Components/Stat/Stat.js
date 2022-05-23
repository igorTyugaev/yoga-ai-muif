import React from 'react';
import classNames from "classnames";
import style from "./Stat.module.scss"
import TimeIcon from "../../Assets/time.svg"

const Stat = ({className}) => {
    return (
        <div className={classNames(className)}>
            <div className={classNames(style.StatInner)}>
                <h2 className={classNames(style.StatLabel)}>
                    Цель <br/> на день
                </h2>

                <h4 className={classNames(style.StatInfo)}>
                    800 <sub>мин. <br/> / 10 000 мин.</sub>
                </h4>

                <img className={classNames(style.StatIcon)} src={TimeIcon} alt="time"/>
            </div>
        </div>
    );
};

export default Stat;