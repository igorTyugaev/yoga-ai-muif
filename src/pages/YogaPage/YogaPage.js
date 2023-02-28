import React from 'react';
import classNames from "classnames";
import {useParams} from "react-router-dom";
import YogaCanvas from "../../screen/YogaCanvas";
import style from "./YogaPage.module.scss";

const YogaPage = ({className}) => {
    const {pose} = useParams();

    return (
        <div className={classNames(className)}>
            <div className={classNames(style.Inner)}>
                <YogaCanvas className={classNames(style.Canvas)} pose={pose}/>
            </div>
        </div>
    );
};

export default YogaPage;