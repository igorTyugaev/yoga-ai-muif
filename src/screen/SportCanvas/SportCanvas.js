import React, {useEffect, useState, useRef} from 'react';
import classNames from "classnames";
import Confetti from 'react-confetti';
import {done, female, next} from "../../Assets/music";
import {CloseBtn} from "./particles";
import style from "./SportCanvas.module.scss"
import {useHistory} from "react-router-dom";
import {Button, MenuItem, Select} from "@mui/material";
import {AISport} from "../../Utils/AISport";
import {useStopStreamWillUnmount} from "../YogaCanvas/YogaCanvas";
import {examplesSet} from "../../Utils/meta";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import {useAppContext} from "../../AppContext";

const SportCanvas = ({className}) => {
    const canvasRef = useRef();
    const [exercise, setExercise] = useState(0);
    const {isLoading, camera, count} = useAISportCamera({canvasRef, exampleSet: examplesSet[0]});

    const audio = useRef(new Audio(female)).current;
    const doneSound = useRef(new Audio(done)).current;
    const nextSound = useRef(new Audio(next)).current;

    const isDone = useRef(false);

    useStopStreamWillUnmount(camera, audio);

    const appContext = useAppContext();
    const {theme} = appContext;
    const history = useHistory();


    function handleCompleted(remainingTime) {
        if (remainingTime === 0 && !isDone.current) {
            isDone.current = true;
            audio.pause();

            nextSound.loop = false;
            doneSound.loop = false;

            doneSound.play();
            nextSound.play();
        }
    }

    const handleChange = (event) => {
        const val = event.target.value
        setExercise(val);
        camera.changeExampleSet(examplesSet[+val])
        camera.count = 0;
    };


    return (
        <div className={classNames(className, style.Inner)}>
            <CloseBtn className={classNames(style.CloseBtn)}/>
            {isLoading && <i className={classNames(style.Loader)}/>}
            {isDone.current ? <>
                <Confetti className={classNames(style.Confetti)} run={isDone.current}/>
                <div className={classNames(style.Modal)}>
                    <div className={classNames(style.ModalInner)}>
                        <div className={style.SvgBox}>
                            <svg viewBox="0 0 130.2 130.2">
                                <circle className={style.CircularPath} fill="none" stroke="#73AF55" strokeWidth="6"
                                        strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                                <polyline className={style.CheckmarkCheck} fill="none" stroke="#73AF55"
                                          strokeWidth="6"
                                          strokeLinecap="round" strokeMiterlimit="10"
                                          points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                            </svg>
                        </div>
                        <h2 className={classNames(style.ModalTitle)}>
                            Отличная работа!
                        </h2>
                        <p className={classNames(style.ModalMessage, "text text_size_accent")}>
                            Вы открыли новое упражение. Можете перейти к следующему или вернуться обратно
                        </p>

                        <div className={classNames(style.ModalActions)}>
                            <Button className={classNames(style.ModalAction)} color="primary" size="large"
                                    variant="outlined" onClick={() => {
                                history.goBack();
                            }}>
                                На главную
                            </Button>

                            <Button className={classNames(style.ModalAction)} color="primary" size="large"
                                    variant="contained" onClick={() => {
                            }}>
                                Далее
                            </Button>
                        </div>
                    </div>
                </div>
            </> : <>
                <Select
                    className={classNames(style.Selector)}
                    value={exercise}
                    label="exercise"
                    onChange={handleChange}
                >
                    <MenuItem value={0}>Приседания</MenuItem>
                    <MenuItem value={1}>Мельница</MenuItem>
                    <MenuItem value={2}>Звездочка</MenuItem>
                </Select>
                <CircularProgressbar className={classNames(style.Timer)}
                                     value={count / 10 * 100} text={count || 0}
                                     styles={buildStyles({
                                         textColor: "#fff",
                                         textSize: '2.5em',
                                         pathColor: theme.palette.primary.main,
                                         trailColor: theme.palette.primary.light,
                                     })}/>
            </>
            }
            <canvas className={classNames(style.Canvas)} ref={canvasRef}/>
        </div>
    );
};

export default SportCanvas;

export function useAISportCamera({canvasRef, exampleSet}) {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);
    const cameraRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current && !cameraRef.current) {
            const camera = new AISport(canvasRef, exampleSet);
            camera.setCallback(({isLoading, error}) => {
                setLoading(isLoading);
                setError(error);
            });
            camera.initCamera((count) => {
                setCount(count)
            });
            cameraRef.current = camera;
        }
    }, [canvasRef.current])

    return {isLoading, error, camera: cameraRef.current, count}
}