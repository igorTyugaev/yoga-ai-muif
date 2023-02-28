import React from 'react';
import classNames from "classnames";
import Calendar from "react-calendar";
import {Button, Grid} from "@mui/material";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import {useAppContext} from "../../AppContext";
import GridCard from "../../UIKit/GridCard";
import 'react-circular-progressbar/dist/styles.css';
import style from "./MainPage.module.scss";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const date = [
    new Date(2022, 5, 1),
    new Date(2022, 5, 2),
];

const MainPage = ({className, children}) => {
    const appContext = useAppContext();
    const {theme} = appContext;
    const percentage = 18;

    return (
        <div className={classNames(style.Container)}>
            {children}
            <Grid container className={classNames(style.Banner)}>
                <GridCard item container title="Дневная норма" alignItems="center"
                          justifyContent="space-between">
                    <Grid item container alignItems="center" justifyContent="center">
                        <Grid item xs={6}>
                            <CircularProgressbar value={percentage} text={`${percentage}%`}
                                                 styles={buildStyles({
                                                     textColor: theme.palette.text.primary,
                                                     textSize: '1.5em',
                                                     pathColor: theme.palette.primary.main,
                                                     trailColor: theme.palette.primary.light,
                                                 })}/>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center" justifyContent="center">
                        <Button variant="outlined" size="large" sx={{marginTop: '12px'}}>
                            Продолжить тренировку
                        </Button>
                    </Grid>
                </GridCard>
                <GridCard item container title="Частота занятий" alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Calendar view="month" locale="ru-RU"
                                  prevLabel={<ArrowBackIcon/>}
                                  nextLabel={<ArrowForwardIcon/>}/>
                    </Grid>
                </GridCard>
            </Grid>
        </div>
    );
};

export default MainPage;