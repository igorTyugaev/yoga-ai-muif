import React from 'react';
import classNames from "classnames";
import style from "./Programs.module.scss"
import {poses} from "../../Utils";
import {useHistory} from "react-router-dom";

const Programs = ({className}) => {
    const history = useHistory();
    return (
        <div className={classNames(className)}>
            <div className={classNames(style.ProgramsInner)}>
                <div className={classNames(style.ProgramsHeader)}>
                    <h3 className={classNames(style.ProgramsTitle)}>
                        Разучивание упражнений
                    </h3>
                </div>
                <ul className={classNames(style.ProgramsList)}>
                    {poses.map(([name, {label, img}]) => (
                        <li className={classNames(style.ProgramsItem)} key={label} onClick={() => {
                            history.push(`/coaching/${name}`)
                        }}>
                            <h3 className={classNames(style.ProgramsLabel)}>{label}</h3>
                            <img className={classNames(style.ProgramsImg)}
                                 src={img} alt="React Logo"/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Programs;