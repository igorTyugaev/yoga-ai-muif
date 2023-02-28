import React, {useEffect, useState, useRef} from 'react';
import classNames from "classnames";
import Confetti from 'react-confetti';

import {
    userMediaConfig,
    YOGA_POSES, poses
} from "../../Utils";
import {AICamera} from "../../Utils/AICamera";
import {done, female, next} from "../../Assets/music";
import {CloseBtn} from "./particles";
import Timer from "../../components/Timer";
import style from "./Canvas.module.scss";
import {useHistory} from "react-router-dom";
import {Button} from "@mui/material";

const YogaCanvas = ({className, pose}) => {
    const canvasRef = useRef();
    const [currentPose, setCurrentPose] = useState(pose);
    const {isLoading, camera} = useAICamera({
        canvasRef,
        classifier: {
            link: YOGA_POSES[currentPose].model,
            pose: YOGA_POSES[currentPose].id
        },
        catchPose,
    });
    const audio = useRef(new Audio(female)).current;
    const doneSound = useRef(new Audio(done)).current;
    const nextSound = useRef(new Audio(next)).current;
    const [isPlaying, setPlaying] = useState(false);
    const isDone = useRef(false);
    const [keyTimer, setKeyTimer] = useState(0);
    useStopStreamWillUnmount(camera, audio);
    const history = useHistory();

    function catchPose(state) {
        if (isDone.current) return;
        setPlaying(state);
        if (state) {
            audio?.play();
        } else {
            if (audio) {
                audio.pause();
                // audio.currentTime = 0;
            }
            // setKeyTimer(prevState => ++prevState);
        }
    }

    function handleCompleted(remainingTime) {
        if (remainingTime === 0 && !isDone.current) {
            isDone.current = true;
            setPlaying(false);
            audio.pause();

            nextSound.loop = false;
            doneSound.loop = false;

            doneSound.play();
            nextSound.play();
        }
    }


    return (
        <div className={classNames(className, style.Inner)}>
            <CloseBtn className={classNames(style.CloseBtn)}/>
            {isLoading && <i className={classNames(style.Loader)}/>}
            {isDone.current ?
                <>
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
                                    isDone.current = false;
                                    const [, {next}] = poses.find(([key]) => key === currentPose);
                                    setCurrentPose(next);
                                    camera.changeClassifier({
                                        link: YOGA_POSES[next].model,
                                        pose: YOGA_POSES[next].id
                                    });
                                    setKeyTimer(prevState => ++prevState);
                                    audio.currentTime = 0;
                                    history.push(`/coaching/${next}`)
                                }}>
                                    Далее
                                </Button>
                            </div>
                        </div>
                    </div>
                </> :
                <>
                    <Timer className={classNames(style.Timer)} duration={10}
                           isPlaying={isPlaying} keyTimer={keyTimer}
                           onCompleted={handleCompleted}/>
                    <img className={classNames(style.PoseImg)}
                         src={YOGA_POSES[currentPose].img} alt="React Logo"/>
                </>
            }
            <canvas className={classNames(style.Canvas)} ref={canvasRef}/>
        </div>
    );
};

export default YogaCanvas;

export function useAICamera({canvasRef, classifier = null, catchPose}) {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current && !cameraRef.current) {
            const camera = new AICamera(canvasRef, userMediaConfig);
            camera.setCallback(({isLoading, error}) => {
                setLoading(isLoading);
                setError(error);
            });
            camera.initCamera(classifier);
            camera.setCatchPose(catchPose);
            cameraRef.current = camera;
        }
    }, [canvasRef.current])

    return {isLoading, error, camera: cameraRef.current}
}

export function useStopStreamWillUnmount(camera, audio) {
    useEffect(() => () => {
        camera?.cleanMediaStream();
        audio?.pause();
        audio?.remove();
    }, [camera]);
}

export function useAudio(song) {
    const audio = useRef(null);
    useEffect(() => {
        audio.current = new Audio(song);
        audio.current.loop = true;
    }, [])

    return audio.current;
}