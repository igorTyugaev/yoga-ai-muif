import React, {useState, useEffect} from "react";
import {useParams, Link, useHistory} from "react-router-dom";

import {Fab, Grid, styled, Stack} from "@mui/material";

import {Refresh as RefreshIcon, Home as HomeIcon} from "@mui/icons-material";

import {firestore} from "../../firebase";


import {ReactComponent as ErrorIllustration} from "../../illustrations/error.svg";
import {ReactComponent as NoDataIllustration} from "../../illustrations/no-data.svg";
import EmptyState from "../../domain/EmptyState";
import Loader from "../../components/Loader";
import {useAppContext} from "../../AppContext";
import UserCard from "../../components/UserCard";


const GridWrapper = styled(Grid)(({theme}) => ({
    margin: 0,
    width: "100%"
}));

const UserPage = () => {
    const appContext = useAppContext();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const {userId} = useParams();
    const {openSnackbar} = appContext;
    const canGoBack = history.action !== 'POP';

    useEffect(() => {
        return firestore
            .collection("users")
            .doc(userId)
            .onSnapshot(
                (snapshot) => {
                    setLoading(false);
                    setUser(snapshot.data());
                },
                (error) => {
                    setLoading(false);
                    setError(error);
                }
            );
    }, [userId]);

    useEffect(() => {
        return firestore
            .collection("users")
            .doc(userId)
            .collection("reviews")
            .where("expert", "==", userId)
            .limit(5)
            .get()
            .then((res) => {
                setLoading(false);
                const items = res.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setReviews(items);
            })
            .catch(() => {
                setLoading(false);
                setError(error);
            })
    }, [userId]);

    if (error) {
        return (
            <EmptyState
                image={<ErrorIllustration/>}
                title="Не удалось получить пользователя."
                description="Что-то пошло не так при попытке получить пользователя."
                button={
                    <Fab
                        variant="extended"
                        color="primary"
                        onClick={() => window.location.reload()}
                    >
                        <Stack direction="row" gap={1}>
                            <RefreshIcon/>
                            <span>Повторить</span>
                        </Stack>
                    </Fab>
                }
            />
        );
    }

    if (loading) {
        return <Loader/>;
    }

    if (!user) {
        return (
            <EmptyState
                image={<NoDataIllustration/>}
                title="Пользователя не существует."
                description="Запрашиваемого пользователь не существует."
                button={
                    <Fab variant="extended" color="primary" component={Link} to="/">
                        <Stack direction="row" gap={1}>
                            <HomeIcon/>
                            Главная
                        </Stack>
                    </Fab>
                }
            />
        );
    }

    const hasProfile = user.firstName && user.lastName && user.username;

    if (hasProfile) {
        return (
            <GridWrapper container justifyContent="center" spacing={5}>
                <Grid item xs={4}>
                    <UserCard user={user}/>
                </Grid>
            </GridWrapper>
        );
    }

    return (
        <EmptyState
            image={<NoDataIllustration/>}
            title="No profile."
            description="The user hasn‘t setup their profile."
        />
    );
}

export default UserPage;
