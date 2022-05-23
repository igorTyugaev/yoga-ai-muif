import React, {useState} from 'react';
import classNames from "classnames";
import {useLocation, useParams} from "react-router-dom";
import Canvas from "../../Components/Canvas";
import img from "../../Assets/permission.png";
import style from "./CoachingPage.module.scss";

const CoachingPage = ({className}) => {
    const [isActive, setActive] = useState(true);
    const {pose} = useParams();

    return (
        <div className={classNames(className)}>
            <div className={classNames(style.Inner)}>
                {
                    isActive ?
                        <Canvas className={classNames(style.Canvas)} pose={pose}/> :
                        <div className={classNames(style.Intro)}>
                            <ul className={classNames(style.IntroList)}>
                                <p className={classNames(style.IntroListItem)}>
                                    Разрешите доступ к камере и дождитесь ее загрузки.
                                    <img className={classNames(style.IntroImg)} src={img} alt="permission"/>
                                </p>

                                {/*<p className={classNames(style.IntroListItem)}>*/}
                                {/*    Займите аналогичную позу, как на изображении справа, убедившись, что лицом вы*/}
                                {/*    обращены в*/}
                                {/*    ту же сторону.*/}
                                {/*</p>*/}

                                {/*<p className={classNames(style.IntroListItem)}>*/}
                                {/*    Удерживайте паузу в течение 20 секунд.*/}
                                {/*    Таймер перезапускается, если вы допустили ошибку.*/}
                                {/*</p>*/}
                            </ul>
                            <button className={classNames(style.IntroBtn)} onClick={() => setActive(true)}>
                                Запросить доступ
                            </button>
                        </div>
                }
            </div>
        </div>
    );
};

export default CoachingPage;