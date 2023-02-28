import React from 'react';
import classNames from "classnames";
import {useHistory} from "react-router-dom";
import {poses} from "../../Utils";
import style from "./Programs.module.scss"
import GridCard from "../../UIKit/GridCard";
import {Button, Typography} from "@mui/material";

const Programs = ({className}) => {
    const history = useHistory();
    return (
        <GridCard className={classNames(className)}>
            <div className={classNames(style.ProgramsInner)}>
                <div className={classNames(style.ProgramsHeader)}>
                    <Typography variant="body1" fontWeight="bold">
                        Популярные упражнения
                    </Typography>
                </div>
                <ul className={classNames(style.ProgramsList)}>
                    {poses.map(([name, {label, img}]) => (
                        <li className={classNames(style.ProgramsItem)} key={label} onClick={() => {
                            history.push(`/coaching/${name}`)
                        }}>
                            <Typography variant="h6" fontWeight="bold">
                                {label}
                            </Typography>
                            <img className={classNames(style.ProgramsImg)}
                                 src={img} alt="React Logo"/>
                            <Button variant="outlined" color="primary">
                                Изучить
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </GridCard>
    );
};

export default Programs;