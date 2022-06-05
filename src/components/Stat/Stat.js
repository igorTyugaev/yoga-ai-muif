import React, {useEffect, useRef, useState} from 'react';
import classNames from "classnames";
import {Typography} from "@mui/material";
import GridCard from "../../UIKit/GridCard";
import {programs} from "../../Utils";
import style from "../Programs/Programs.module.scss"
import ProgramCard from "../ProgramCard";
import {useHistory} from "react-router-dom";
import gym from "../../Assets/gym.svg"


const Stat = ({className}) => {
        const innerRef = useRef();
        const history = useHistory();
        const [size, setSize] = useState(10);

        useEffect(() => {
            if (!innerRef?.current) return;
            const size = Math.floor(innerRef.current?.getBoundingClientRect().height * 0.08);
            setSize(size);
            console.log(size)
        }, [innerRef.current])

        return (
            <GridCard className={classNames(className)}>
                <div className={classNames(style.ProgramsInner)}>
                    <div className={classNames(style.ProgramsHeader)}>
                        <Typography variant="body1" fontWeight="bold">
                            Программы тренировок
                        </Typography>
                    </div>
                    <ul className={classNames(style.ProgramsList)}>
                        {programs.map(({img, id}, index) => {

                            if (index === 1) {
                                return <>
                                    <ProgramCard isNew img={gym} style={{padding: '28px'}} onClick={() => {
                                        history.push("/sport")
                                    }}/>
                                    <ProgramCard img={img} onClick={() => {
                                        history.push(`/program/${index}`)
                                    }}/>
                                </>
                            }

                            return (
                                <ProgramCard img={img} onClick={() => {
                                    history.push(`/program/${index}`)
                                }}/>
                            )
                        })}
                    </ul>
                </div>
            </GridCard>
        )
            ;
    }
;

export default Stat;