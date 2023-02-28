import * as poseDetection from '@tensorflow-models/pose-detection';

export const DEFAULT_LINE_WIDTH = 4;
export const DEFAULT_RADIUS = 4;

export const VIDEO_SIZE = {
    '640 X 480': {width: 640, height: 480},
    '640 X 360': {width: 640, height: 360},
    '360 X 270': {width: 360, height: 270}
};
export const BLAZEPOSE_CONFIG = {
    maxPoses: 1,
    type: 'full',
    scoreThreshold: 0.65,
    render3D: true
};
export const POSENET_CONFIG = {
    maxPoses: 1,
    scoreThreshold: 0.5
};
export const MOVENET_CONFIG = {
    maxPoses: 1,
    type: 'lightning',
    scoreThreshold: 0.3,
    customModel: '',
    enableTracking: false
};


export const TUNABLE_FLAG_VALUE_RANGE_MAP = {
    WEBGL_VERSION: [1, 2],
    WASM_HAS_SIMD_SUPPORT: [true, false],
    WASM_HAS_MULTITHREAD_SUPPORT: [true, false],
    WEBGL_CPU_FORWARD: [true, false],
    WEBGL_PACK: [true, false],
    WEBGL_FORCE_F16_TEXTURES: [true, false],
    WEBGL_RENDER_FLOAT32_CAPABLE: [true, false],
    WEBGL_FLUSH_THRESHOLD: [-1, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    CHECK_COMPUTATION_FOR_ERRORS: [true, false],
};

export const BACKEND_FLAGS_MAP = {
    ['tfjs-wasm']: ['WASM_HAS_SIMD_SUPPORT', 'WASM_HAS_MULTITHREAD_SUPPORT'],
    ['tfjs-webgl']: [
        'WEBGL_VERSION', 'WEBGL_CPU_FORWARD', 'WEBGL_PACK',
        'WEBGL_FORCE_F16_TEXTURES', 'WEBGL_RENDER_FLOAT32_CAPABLE',
        'WEBGL_FLUSH_THRESHOLD'
    ],
    ['mediapipe-gpu']: []
};

export const MODEL_BACKEND_MAP = {
    [poseDetection.SupportedModels.PoseNet]: ['tfjs-webgl'],
    [poseDetection.SupportedModels.MoveNet]: ['tfjs-webgl', 'tfjs-wasm'],
    [poseDetection.SupportedModels.BlazePose]: ['mediapipe-gpu', 'tfjs-webgl']
}

export const TUNABLE_FLAG_NAME_MAP = {
    PROD: 'production mode',
    WEBGL_VERSION: 'webgl version',
    WASM_HAS_SIMD_SUPPORT: 'wasm SIMD',
    WASM_HAS_MULTITHREAD_SUPPORT: 'wasm multithread',
    WEBGL_CPU_FORWARD: 'cpu forward',
    WEBGL_PACK: 'webgl pack',
    WEBGL_FORCE_F16_TEXTURES: 'enforce float16',
    WEBGL_RENDER_FLOAT32_CAPABLE: 'enable float32',
    WEBGL_FLUSH_THRESHOLD: 'GL flush wait time(ms)'
};


export const STATE = {
    camera: {targetFPS: 60, sizeOption: '640 X 480'},
    backend: 'tfjs-webgl',
    flags: {},
    modelConfig: {
        maxPoses: 1,
        type: 'lightning',
        scoreThreshold: 0.3,
        customModel: '',
        enableTracking: false
    }
};
