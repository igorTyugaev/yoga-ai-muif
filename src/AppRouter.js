import React from "react";
import {BrowserRouter, Switch, Redirect, Route} from "react-router-dom";


import UserPage from "./pages/UserPage";
import NotFoundPage from "./domain/NotFoundPage";
import {useAppContext} from "./AppContext";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import CoachingPage from "./legacy/Pages/CoachingPage/CoachingPage";


const AppRouter = ({bar}) => {
    const appContext = useAppContext();
    // Properties
    const {user, openSnackbar} = appContext;
    return (
        <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
            {bar}
            <Switch>
                <Route path="/" exact>
                    {user ? <MainPage/> : <HomePage/>}
                </Route>

                <Route path="/user/:userId">
                    {user ? <UserPage/> : <Redirect to="/"/>}
                </Route>

                <Route path="/coaching/:pose">
                    <CoachingPage/>
                </Route>

                <Route>
                    <NotFoundPage/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default AppRouter;
