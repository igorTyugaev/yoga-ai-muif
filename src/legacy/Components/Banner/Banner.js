import React from 'react';
import classNames from "classnames";
import ProgramCard from "../../../components/ProgramCard";
import style from "./Banner.module.scss"

const programs = [
    {
        title: "Ознакомительный-1",
        desc: "Самый первый класс в практике йоги по методу Айенгара. Это класс обязательной программы для уровня «Новичок». Класс включает в себя всего одно занятие",
        img: "https://media.istockphoto.com/photos/morning-yoga-picture-id1181078385?k=20&m=1181078385&s=612x612&w=0&h=2FA9Y9Ex_2iD-Wu2ahZmtnskuUY2R_-yUUCOWXgNqwM=",
    },

    {
        title: "Ознакомительный 2-3",
        desc: "Эти классы знакомят с практикой йоги — со всеми группами поз и диапазонами движения. Все они важны для хорошего самочувствия и для дальнейшего развития.",
        img: "https://images.healthshots.com/healthshots/en/uploads/2021/12/18081913/bhujangasana.jpg",
    },

    {
        title: "Начальный",
        desc: "Мы познакомим вас со скручиваниями в позах стоя, снимающими напряжения позвоночника и нервной системы. С простыми прогибами назад, удлиняющими и омолаживающими переднюю часть позвоночника.",
        img: "https://static01.nyt.com/images/2016/12/02/well/move/yoga_body_images-slide-NMNW/yoga_body_images-slide-NMNW-blog480-v2.jpg",
    }
]

const Banner = ({className}) => {

    return (
        <div className={classNames(className)}>
            <div className={classNames(style.Inner)}>
                {programs
                    .map((item) => (
                        <ProgramCard key={item.title} {...item}/>)
                    )}
            </div>
        </div>
    );
};

export default Banner;