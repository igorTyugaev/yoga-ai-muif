import React from "react";
import {BrowserRouter, Switch, Redirect, Route} from "react-router-dom";

import UserPage from "./pages/UserPage";
import NotFoundPage from "./domain/NotFoundPage";
import {useAppContext} from "./AppContext";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import YogaPage from "./pages/YogaPage";
import {Grid} from "@mui/material";
import classNames from "classnames";
import style from "./pages/MainPage/MainPage.module.scss";
import Programs from "./components/Programs/Programs";
import Stat from "./components/Stat";
import ProgramPage from "./pages/ProgramPage";
import SportPage from "./pages/SportPage/SportPage";


const AppRouter = ({bar}) => {
    const appContext = useAppContext();
    // Properties
    const {user, openSnackbar} = appContext;
    return (
        <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
            {bar}
            <Switch>
                {true ? <>
                        <MainPage>
                            <Route path="/" exact>
                                <Grid container className={classNames(style.Content)}>
                                    <Programs className={classNames(style.Programs)}/>
                                    <Stat className={classNames(style.Stat)}/>
                                </Grid>
                            </Route>

                            <Route path="/program/:program">
                                <ProgramPage/>
                            </Route>

                            <Route path="/coaching/:pose">
                                <YogaPage/>
                            </Route>

                            <Route path="/sport">
                                <SportPage/>
                            </Route>
                        </MainPage>

                        <Route path="/user/:userId">
                            {user ? <UserPage/> : <Redirect to="/"/>}
                        </Route>
                    </> :
                    <HomePage/>
                }

                <Route>
                    <NotFoundPage/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default AppRouter;
