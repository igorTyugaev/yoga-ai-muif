import * as poseDetection from "@tensorflow-models/pose-detection";
import ChairPose from '../Assets/poses/chair.svg';
import CobraPose from '../Assets/poses/cobra.svg';
import DogPose from '../Assets/poses/dog.svg';
import ShoulderPose from '../Assets/poses/shoulder-stand.svg';
import TreePose from '../Assets/poses/tree.svg';
import TrianglePose from '../Assets/poses/triangle.svg';
import WarriorPose from '../Assets/poses/warrior.svg';

export const userMediaConfig = {
    audio: false,
    video: true
};

export const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
};

export const poseDetectionModel = poseDetection.SupportedModels.MoveNet;

export const POINTS = {
    NOSE: 0,
    LEFT_EYE: 1,
    RIGHT_EYE: 2,
    LEFT_EAR: 3,
    RIGHT_EAR: 4,
    LEFT_SHOULDER: 5,
    RIGHT_SHOULDER: 6,
    LEFT_ELBOW: 7,
    RIGHT_ELBOW: 8,
    LEFT_WRIST: 9,
    RIGHT_WRIST: 10,
    LEFT_HIP: 11,
    RIGHT_HIP: 12,
    LEFT_KNEE: 13,
    RIGHT_KNEE: 14,
    LEFT_ANKLE: 15,
    RIGHT_ANKLE: 16,
}

export const default_model = 'https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json';

export const YOGA_POSES = {
    triangle: {
        id: 5,
        next: 'tree',
        label: "Поза треугольника",
        img: TrianglePose,
        model: default_model,
    },
    tree: {
        id: 6,
        next: 'warrior',
        label: "Поза дерева",
        img: TreePose,
        model: default_model,
    },
    cobra: {
        id: 1,
        next: 'dog',
        label: "Поза кобры",
        img: CobraPose,
        model: default_model,
    },
    dog: {
        id: 2,
        next: 'shoulder_stand',
        label: "Поза собаки",
        img: DogPose,
        model: default_model,
    },
    chair: {
        id: 0,
        next: 'cobra',
        label: "Поза стула",
        img: ChairPose,
        model: default_model,
    },
    shoulder_stand: {
        id: 4,
        next: 'triangle',
        label: "Стойка на плечах",
        img: ShoulderPose,
        model: default_model,
    },
    warrior: {
        id: 7,
        next: 'chair',
        label: "Поза война",
        img: WarriorPose,
        model: default_model,
    },

    // no_pose: {
    //     id: 3,
    //     label: 'нет позы',
    //     model: default_model,
    // },
}

export const poses = Object.entries(YOGA_POSES);

export const programs = [
    {
        id: 1,
        title: 'Упражнения для улучшения пищеварения',
        duration: 12,
        img: 'https://static.vecteezy.com/system/resources/previews/003/088/092/non_2x/yoga-poses-for-digestion-young-woman-practicing-yoga-poses-vector.jpg',
        description: 'Вашему вниманию представлен комплекс асан, которые направлены на то, чтобы улучшить работу пищеварительных органов: печени, поджелудочной железы, желудка и кишечника, устранить лишнее напряжение, мешающее корректному кровообращению. Регулярное выполнение этих упражнений улучшит пищеварение, устранит расстройства кишечника.'
    },
    {
        id: 2,
        title: 'Упражнения со стулом',
        duration: 18,
        img: 'https://static.vecteezy.com/system/resources/previews/003/088/090/non_2x/chair-yoga-poses-young-woman-practicing-yoga-poses-vector.jpg',
        description: 'Простые упражнения помогут уменьшить боль, освободиться от напряжения, укрепить мышцы и сделать тело более гибким.  К тому же при использовании стула снижается нагрузка на опорно-двигательный аппарат. На нем проще держать равновесие. В частности, это полезно при освоении различных асан скручивания.'
    },
    {
        id: 3,
        title: 'Упражнения для начинающих',
        duration: 21,
        img: 'https://static.vecteezy.com/system/resources/previews/003/088/093/non_2x/beginner-yoga-poses-young-woman-practicing-yoga-poses-vector.jpg',
        description: 'Если вы давно мечтаете освоить йогу, то в нашей подборке вы найдете лучшие асаны для начинающих, которые можно выполнять при любом уровне физической подготовки.'
    },
    {
        id: 4,
        title: 'Упражнения от бессонницы',
        duration: 8,
        img: 'https://static.vecteezy.com/system/resources/previews/003/088/087/non_2x/yoga-poses-for-insomnia-young-woman-practicing-yoga-poses-vector.jpg',
        description: 'Выполняя эти десять асан на ночь, мы можем снизить уровень стресса, улучшить качество сна или избавиться от бессонницы.'
    },
    {
        id: 5,
        title: 'Упражнения от пробуждения силы',
        duration: 12,
        img: 'https://static.vecteezy.com/system/resources/previews/003/088/097/large_2x/yoga-poses-for-building-strength-young-woman-practicing-yoga-poses-vector.jpg',
        description: 'Этот комплекс упражнений займет у вас всего 12 минут свободного времени! Ощутите прилив силы во всем теле, приятное тепло и легкость в голове. Попробуйте уделить своему телу немного драгоценных минут:)'
    }
]
