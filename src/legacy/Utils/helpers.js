import {useState, useEffect, useRef} from "react";

export function hasMediaDevices() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

export function getMediaStream(requestedMedia) {
    return navigator.mediaDevices.getUserMedia(requestedMedia);
}

export function cleanMediaStream(mediaStream) {
    if (!mediaStream) return;
    return mediaStream.getTracks().forEach(track => {
        track.stop();
    });
}


export function useUserMedia(requestedMedia) {
    const mediaStream = useRef(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!mediaStream.current) {
            getMediaStream(requestedMedia)
                .then(stream => {
                    mediaStream.current = stream;
                })
                .catch(err => setError(err))
                .finally(() => setLoading(false))
        }

        return () => cleanMediaStream(mediaStream.current);
    }, [requestedMedia])

    return {mediaStream: mediaStream.current, isLoading, error}
}

export function useSetMediaStream(videoRef, mediaStream) {
    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;
        videoEl.srcObject = mediaStream;
        videoEl.addEventListener('loadedmetadata', () => {
        })
    }, [mediaStream, videoRef.current]);
}

export function withDebounce(func, wait) {
    let timeoutId = null;
    let lastProps = null;
    let lastContext = null;
    return (...args) => {
        lastProps = args;
        lastContext = this;
        const handleCallFunc = () => {
            func.apply(lastContext, lastProps);
            lastProps = null;
            lastContext = null;
        };
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleCallFunc, wait);
    };
}