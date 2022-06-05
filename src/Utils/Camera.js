class Camera {
    constructor(canvasRef) {
        /* Canvas */
        this.canvas = canvasRef.current;
    }

    initCanvas() {
        const videoWidth = this.video.videoWidth;
        const videoHeight = this.video.videoHeight;
        // Must set below two lines, otherwise video element doesn't show.
        this.canvas.width = videoWidth;
        this.canvas.height = videoHeight;

        // Because the image from camera is mirrored, need to flip horizontally.
        this.ctx = this.canvas.getContext('2d');
        this.ctx.translate(this.video.videoWidth, 0);
        this.ctx.scale(-1, 1);
    }

    initCamera(classifier = null) {
        this.getMediaStream(this.userMediaConfig)
            .then(mediaStream => {
                this.mediaStream = mediaStream;
                this.buildVideo();
                return this.loadMetaData();
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
}