import React, {useEffect, useRef, useState} from "react";
import * as poseDetection from '@tensorflow-models/pose-detection';
// import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';

const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};


export function useGetTFDetector() {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const detectorRef = useRef(null);

    useEffect(() => {
        if (!detectorRef.current) {
            loadTFDetector(detectorConfig)
                .then(detector => {
                    detectorRef.current = detector;
                })
                .catch(err => {
                    setError(err);
                    console.log(err)
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [])

    return {isLoading, error, detector: detectorRef.current};
}

export function useEstimatePoses(videoRef, mediaStream) {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const detectorRef = useRef(null);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;
        videoEl.srcObject = mediaStream;
        Promise.all([loadTFDetector(detectorConfig), loadMetaData(videoEl)])
            .then(([detector]) => {
                detectorRef.current = detector;
                mainLoop();
            })
    }, [mediaStream, videoRef.current]);

    async function mainLoop() {
        await prediction(videoRef.current, detectorRef.current);
        requestAnimationFrame(mainLoop);
    }


    return {isLoading, error};
}


export async function prediction(videoEl, detector) {
    if (!detector) return;
    try {
        const poses = await detector.estimatePoses(videoEl);
        console.log(poses)
    } catch (error) {
        console.log(error)
        detector.dispose();
        detector = null;
    }
}

export function loadMetaData(videoEl) {
    console.log('loadMetaData - start');
    return new Promise((resolve) => videoEl
        .addEventListener('loadedmetadata', () => {
            resolve(videoEl);
            console.log('loadMetaData - end');
        })
    );
}

export function loadTFDetector(detectorConfig) {
    return poseDetection
        .createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)
}