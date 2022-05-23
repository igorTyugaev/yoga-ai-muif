import React, {useRef, useState} from 'react';
import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import classNames from "classnames";
import style from "./Timer.module.scss";

const RenderTime = ({remainingTime}) => {
    const currentTime = useRef(remainingTime);
    const prevTime = useRef(null);
    const isNewTimeFirstTick = useRef(false);

    if (currentTime.current !== remainingTime) {
        isNewTimeFirstTick.current = true;
        prevTime.current = currentTime.current;
        currentTime.current = remainingTime;
    } else {
        isNewTimeFirstTick.current = false;
    }

    const isTimeUp = isNewTimeFirstTick.current;

    return (
        <div className={style.TimeWrapper}>
            <h1 key={remainingTime} className={`${style.time} ${isTimeUp ? style.up : ""}`}>
                {remainingTime}
            </h1>
            {prevTime.current !== null && (
                <h1
                    key={prevTime.current}
                    className={`${style.time} ${!isTimeUp ? style.down : ""}`}
                >
                    {prevTime.current}
                </h1>
            )}
        </div>
    );
};

const Timer = ({className, keyTimer = 0, isPlaying, duration = 10, onCompleted = null}) => {

    return (
        <div className={classNames(className, style.TimerWrapper)}>
            <svg className={classNames(style.TimerSVG)}>
                <defs>
                    <linearGradient id="your-unique-id" x1="1" y1="0" x2="0" y2="0">
                        <stop offset="5%" stopColor="gold"/>
                        <stop offset="95%" stopColor="red"/>
                    </linearGradient>
                </defs>
            </svg>
            <CountdownCircleTimer
                key={keyTimer}
                isPlaying={isPlaying}
                duration={duration}
                size={240}
                colors="url(#your-unique-id)">
                {({remainingTime}) => {
                    onCompleted?.(remainingTime);
                    return <RenderTime remainingTime={remainingTime}/>
                }}
            </CountdownCircleTimer>
        </div>
    );
};

export default Timer;