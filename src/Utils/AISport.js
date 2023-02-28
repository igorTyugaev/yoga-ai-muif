import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from '@tensorflow/tfjs';
import * as params from './params';
import {detectorConfig, POINTS, poseDetectionModel, userMediaConfig} from "./consts";
import {complete, stepAway} from "../Assets/music";
import {withDebounce} from "./helpers";

const COLOR_PALETTE = [
    '#ffffff', '#800000', '#469990', '#e6194b', '#42d4f4', '#fabed4', '#aaffc3',
    '#9a6324', '#000075', '#f58231', '#4363d8', '#ffd8b1', '#dcbeff', '#808000',
    '#ffe119', '#911eb4', '#bfef45', '#f032e6', '#3cb44b', '#a9a9a9'
];

export class AISport {
    constructor(canvasRef, exampleSet) {
        /* Canvas */
        this.canvas = canvasRef.current;

        /* Pose estimation */
        this.userMediaConfig = userMediaConfig
        this.poseDetectionModel = poseDetectionModel
        this.detectorConfig = detectorConfig

        /* Pre-settings */
        this.color = 'White';
        this.stepAwaySound = new Audio(stepAway);
        this.stepAwaySound.loop = false;
        this.doneSound = new Audio(complete);
        this.doneSound.loop = false;
        this.count = 0;

        /* Sport estimation */
        this.initSquatting(exampleSet[0], exampleSet[1]);
    }

    playStep = withDebounce(() => {
        this.stepAwaySound?.play();
    }, 256);

    stopStep = withDebounce(() => {
        this.stepAwaySound?.pause();
        this.stepAwaySound.currentTime = 0;
    }, 256);

    changeExampleSet(exampleSet){
        /* Sport estimation */
        this.initSquatting(exampleSet[0], exampleSet[1]);
    }

    initSquatting(positiveSet, negativeSet) {
        const classifier = knnClassifier.create();

        positiveSet.map((item) => {
            addExample(item, 0)
        })
        negativeSet.map((item) => {
            addExample(item, 1)
        })

        function addExample(pose, index) {
            const poseArray = pose.keypoints.map(p => [p.score, p.x, p.y]);
            classifier.addExample(tf.tensor(poseArray), index);
        }

        this.classifierSquatting = classifier;
    }

    initCanvas() {
        const videoWidth = this.video.videoWidth;
        const videoHeight = this.video.videoHeight;

        this.canvas.width = videoWidth;
        this.canvas.height = videoHeight;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.translate(this.video.videoWidth, 0);
        this.ctx.scale(-1, 1);
    }

    initCamera(callback) {
        this.getMediaStream(this.userMediaConfig)
            .then(mediaStream => {
                this.mediaStream = mediaStream;
                this.buildVideo();
                return Promise.all([this.loadPoseEstimator(), this.loadMetaData()]);
            })
            .then(([detector, _]) => {
                this.detector = detector;
                this.callbackSquat = callback;
                this.loopPrediction();
                this.loadingCallback?.({isLoading: false, error: null});
            })
            .catch(err => {
                this.loadingCallback?.({isLoading: false, error: err});
            })
    }

    setCallback(callback) {
        this.loadingCallback = callback;
    }

    buildVideo() {
        this.video = document.createElement('video');
        this.video.setAttribute('autoPlay', null);
        this.video.setAttribute('playsInline', null);
        this.video.setAttribute('muted', null);
        this.video.addEventListener('canplay', () => this.video.play())
        this.video.srcObject = this.mediaStream;
    }

    drawCtx() {
        this.ctx.drawImage(
            this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    }

    loadMetaData() {
        return new Promise((resolve) => this.video
            .addEventListener('loadedmetadata', () => {
                this.initCanvas();
                resolve('loadedMetaData');
            })
        );
    }

    loadPoseEstimator() {
        return poseDetection
            .createDetector(this.poseDetectionModel, this.detectorConfig)
    }

    getCenterPoint(landmarks, left_bodypart, right_bodypart) {
        const left = tf.gather(landmarks, left_bodypart, 1)
        const right = tf.gather(landmarks, right_bodypart, 1)
        return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))
    }

    getPoseSize(landmarks, torso_size_multiplier = 2.5) {
        const hips_center = this.getCenterPoint(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
        const shoulders_center = this.getCenterPoint(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER)
        const torso_size = tf.norm(tf.sub(shoulders_center, hips_center))
        let pose_center_new = this.getCenterPoint(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
        pose_center_new = tf.expandDims(pose_center_new, 1)

        pose_center_new = tf.broadcastTo(pose_center_new,
            [1, 17, 2]
        )

        const d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0)
        const max_dist = tf.max(tf.norm(d, 'euclidean', 0))

        return tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist)
    }

    normalizePoseLandmarks(landmarks) {
        let pose_center = this.getCenterPoint(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
        pose_center = tf.expandDims(pose_center, 1)
        pose_center = tf.broadcastTo(pose_center,
            [1, 17, 2]
        )
        landmarks = tf.sub(landmarks, pose_center)

        const pose_size = this.getPoseSize(landmarks)
        landmarks = tf.div(landmarks, pose_size)
        return landmarks
    }

    landmarksToEmbedding(landmarks) {
        landmarks = this.normalizePoseLandmarks(tf.expandDims(landmarks, 0))
        return tf.reshape(landmarks, [1, 34])
    }

    printByKeyUp(pose) {
        /**
         * Служебный метод для записи массива ключевых точек
         */
        document.addEventListener('keyup', (e) => {
            if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
                console.log(pose);
                this.array ? this.array.push(pose) : this.array = []
            } else if (e.key === "Escape") {
                console.log(this.array);
            }
        })
    }

    async prediction(detector, video) {
        if (!detector || !video) return;
        try {
            const [pose] = await detector.estimatePoses(video);
            const isDetected = pose && pose.keypoints[13].score > 0.4

            if (pose && pose.score > 0.1) {
                this.drawResult(pose);
                if (isDetected) await this.angleSquatting(pose);
            }
        } catch (error) {
            console.log(error)
            detector.dispose();
            detector = null;
        }
    }

    async loopPrediction() {
        this.drawCtx();
        await this.prediction(this.detector, this.video);
        this.requestID = requestAnimationFrame(this.loopPrediction.bind(this));
    }

    async angleSquatting(pose) {
        const poseArray = pose.keypoints.map(p => [p.score, p.x, p.y]);
        const res = await this.classifierSquatting.predictClass(tf.tensor(poseArray));

        const isSquatting = res.confidences[res.classIndex] > 0.6;

        if (isSquatting) {
            if (this.lastPose === 1 && res.classIndex === 0) {
                this.count = this.count ? ++this.count : 1;
                this.doneSound.currentTime = 0;
                this.doneSound.play();
            }

            this.callbackSquat(this.count)
            this.lastPose = res.classIndex;
        }
    }

    hasMediaDevices() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    }

    getMediaStream(userMediaConfig) {
        return navigator.mediaDevices.getUserMedia(userMediaConfig);
    }

    cleanMediaStream() {
        const stream = this.mediaStream;
        if (stream) {
            window.cancelAnimationFrame(this.requestID);
            stream.getTracks().forEach(track => {
                stream.removeTrack(track);
                track.stop();
            });
        }
    }

    drawResult(pose) {
        if (pose.keypoints != null) {
            this.drawKeypoints(pose.keypoints);
            this.drawSkeleton(pose.keypoints, pose.id);
        }
    }

    drawKeypoints(keypoints) {
        const keypointInd =
            poseDetection.util.getKeypointIndexBySide(this.poseDetectionModel);
        this.ctx.fillStyle = 'Red';
        this.ctx.strokeStyle = "White";
        this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;

        for (const i of keypointInd.middle) {
            this.drawKeypoint(keypoints[i]);
        }

        this.ctx.fillStyle = 'Green';
        for (const i of keypointInd.left) {
            this.drawKeypoint(keypoints[i]);
        }

        this.ctx.fillStyle = 'Orange';
        for (const i of keypointInd.right) {
            this.drawKeypoint(keypoints[i]);
        }
    }

    drawKeypoint(keypoint) {
        const score = keypoint.score != null ? keypoint.score : 1;
        const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;

        if (score >= scoreThreshold) {
            const circle = new Path2D();
            circle.arc(keypoint.x, keypoint.y, params.DEFAULT_RADIUS, 0, 2 * Math.PI);
            this.ctx.fill(circle);
            this.ctx.stroke(circle);
        }
    }
    drawSkeleton(keypoints, poseId) {
        const color = params.STATE.modelConfig.enableTracking && poseId != null ?
            COLOR_PALETTE[poseId % 20] :
            this.color
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;

        poseDetection.util
            .getAdjacentPairs(this.poseDetectionModel)
            .forEach(([i, j]) => {
                const kp1 = keypoints[i];
                const kp2 = keypoints[j];

                const score1 = kp1.score != null ? kp1.score : 1;
                const score2 = kp2.score != null ? kp2.score : 1;
                const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;

                if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(kp1.x, kp1.y);
                    this.ctx.lineTo(kp2.x, kp2.y);
                    this.ctx.stroke();
                }
            });
    }
}
