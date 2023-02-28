import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as handPoseModel from "@tensorflow-models/handpose";
import * as tf from '@tensorflow/tfjs';
import fp from "fingerpose";
import * as params from './params';
import {POINTS} from "./consts";
import {stepAway} from "../Assets/music";
import {withDebounce} from "./helpers";
import okGesture from "./okGesture";
import {millDown, millUp, sitDown, standUp, starDown, starUp} from "./meta";

const COLOR_PALETTE = [
    '#ffffff', '#800000', '#469990', '#e6194b', '#42d4f4', '#fabed4', '#aaffc3',
    '#9a6324', '#000075', '#f58231', '#4363d8', '#ffd8b1', '#dcbeff', '#808000',
    '#ffe119', '#911eb4', '#bfef45', '#f032e6', '#3cb44b', '#a9a9a9'
];

export class AIBase {
    constructor(canvasRef, userMediaConfig, poseDetectionModel, detectorConfig) {
        this.canvas = canvasRef.current;
        this.userMediaConfig = userMediaConfig
        this.poseDetectionModel = poseDetectionModel
        this.handPoseDetectionModel = handPoseModel
        this.detectorConfig = detectorConfig
        this.color = 'White';
        this.stepAwaySound = new Audio(stepAway);
        this.stepAwaySound.loop = false;
        this.gestures = new fp.GestureEstimator([
            fp.Gestures.ThumbsUpGesture
        ]);
        this.initSquatting();
    }

    playStep = withDebounce(() => {
        this.stepAwaySound?.play();
    }, 256);

    stopStep = withDebounce(() => {
        this.stepAwaySound?.pause();
        this.stepAwaySound.currentTime = 0;
    }, 256);

    initSquatting() {
        const classifier = knnClassifier.create();

        starUp.map((item) => {
            addExample(item, 0)
        })

        starDown.map((item) => {
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

    initCamera(classifier = null) {
        this.getMediaStream(this.userMediaConfig)
            .then(mediaStream => {
                this.mediaStream = mediaStream;
                this.buildVideo();
                return Promise.all([this.loadPoseDetector(), this.loadMetaData(), this.loadClassifier(classifier), this.loadHandPoseDetector()]);
            })
            .then(([detector, _, poseClassifier, handPoseDetector]) => {
                this.detector = detector;
                this.handPoseDetector = handPoseDetector;
                this.loopPrediction();
                this.poseClassifier = poseClassifier;
                this.pose = classifier.pose;
                this.loadingCallback?.({isLoading: false, error: null});
            })
            .then(() => {
                setTimeout(() => {
                    this.playStep();
                }, 250);
            })
            .catch(err => {
                this.loadingCallback?.({isLoading: false, error: err});
            })
    }

    changeClassifier(classifier) {
        this.loadingCallback?.({isLoading: true, error: null});
        this.loadClassifier(classifier).then(poseClassifier => {
            this.poseClassifier = poseClassifier;
            this.pose = classifier.pose;
            this.loadingCallback?.({isLoading: false, error: null});
        }).catch(err => {
            this.loadingCallback?.({isLoading: false, error: err});
        });
    }

    setCallback(callback) {
        this.loadingCallback = callback;
    }

    setCatchPose(callback) {
        this.catchPose = callback;
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

    loadPoseDetector() {
        return poseDetection
            .createDetector(this.poseDetectionModel, this.detectorConfig)
    }

    loadHandPoseDetector() {
        return this.handPoseDetectionModel.load();
    }

    loadClassifier(classifier) {
        if (!classifier?.link) return null;
        return tf.loadLayersModel(classifier.link);
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

    classifyPose(processedInput) {
        if (this.poseClassifier) {
            const classification = this.poseClassifier.predict(processedInput)

            classification.array()
                .then(([data]) => {
                    if (data[this.pose] > 0.97) {
                        this.color = 'Green';
                        this.catchPose?.(true);
                    } else {
                        this.color = 'White';
                        this.catchPose?.(false);
                    }
                })
        }
    }

    detectPose(pose) {
        const keypointCoordinates = pose.keypoints.map(({x, y}) => [x, y]);
        const processedInput = this.landmarksToEmbedding(keypointCoordinates);
        this.classifyPose(processedInput);
    }

    async prediction(detector, video) {
        if (!detector || !video) return;
        try {
            const [pose] = await detector.estimatePoses(video);

            if (pose && pose.score > 0.1) {
                this.drawResult(pose);
                await this.angleSquatting(pose);
            } else {
                this.catchPose?.(false);
            }
        } catch (error) {
            console.log(error)
            detector.dispose();
            detector = null;
        }
    }

    async loopPrediction(callback) {
        this.drawCtx();
        callback?.();
        this.requestID = requestAnimationFrame(this.loopPrediction.bind(this));
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

    drawHand(predictions) {
        const fingerJoints = {
            thumb: [0, 1, 2, 3, 4],
            indexFinger: [0, 5, 6, 7, 8],
            middleFinger: [0, 9, 10, 11, 12],
            ringFinger: [0, 13, 14, 15, 16],
            pinky: [0, 17, 18, 19, 20],
        };
        const style = {
            0: {color: "yellow", size: 15},
            1: {color: "gold", size: 6},
            2: {color: "green", size: 10},
            3: {color: "gold", size: 6},
            4: {color: "gold", size: 6},
            5: {color: "purple", size: 10},
            6: {color: "gold", size: 6},
            7: {color: "gold", size: 6},
            8: {color: "gold", size: 6},
            9: {color: "blue", size: 10},
            10: {color: "gold", size: 6},
            11: {color: "gold", size: 6},
            12: {color: "gold", size: 6},
            13: {color: "red", size: 10},
            14: {color: "gold", size: 6},
            15: {color: "gold", size: 6},
            16: {color: "gold", size: 6},
            17: {color: "orange", size: 10},
            18: {color: "gold", size: 6},
            19: {color: "gold", size: 6},
            20: {color: "gold", size: 6},
        };

        if (predictions.length > 0) {
            predictions.forEach((prediction) => {
                const landmarks = prediction.landmarks;

                for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
                    let finger = Object.keys(fingerJoints)[j];
                    for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
                        const firstJointIndex = fingerJoints[finger][k];
                        const secondJointIndex = fingerJoints[finger][k + 1];

                        this.ctx.beginPath();
                        this.ctx.moveTo(
                            landmarks[firstJointIndex][0],
                            landmarks[firstJointIndex][1]
                        );
                        this.ctx.lineTo(
                            landmarks[secondJointIndex][0],
                            landmarks[secondJointIndex][1]
                        );
                        this.ctx.strokeStyle = "plum";
                        this.ctx.lineWidth = 4;
                        this.ctx.stroke();
                    }
                }

                for (let i = 0; i < landmarks.length; i++) {
                    const x = landmarks[i][0];
                    const y = landmarks[i][1];

                    this.ctx.beginPath();
                    this.ctx.arc(x, y, style[i]["size"], 0, 3 * Math.PI);

                    this.ctx.fillStyle = style[i]["color"];
                    this.ctx.fill();
                }
            });
        }
    };

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
