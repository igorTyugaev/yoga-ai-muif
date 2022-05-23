import React from 'react';
import classNames from "classnames";
import Banner from "../../legacy/Components/Banner";
import Stat from "../../legacy/Components/Stat";
import Action from "../../legacy/Components/Action/Action";
import Programs from "../../legacy/Components/Programs/Programs";
import style from "./MainPage.module.scss";

const MainPage = ({className}) => {
    return (
        <div className={classNames(style.Container)}>
            <Banner className={classNames(style.Banner)}/>
            <div className={classNames(style.Content)}>
                <Stat className={classNames(style.Stat)}/>
                <Action className={classNames(style.Action)}/>
                <Programs className={classNames(style.Programs)}/>
            </div>
        </div>
    );
};

export default MainPage;