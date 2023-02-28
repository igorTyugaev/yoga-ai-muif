class Camera {
    constructor(canvasRef) {
        this.canvas = canvasRef.current;
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
