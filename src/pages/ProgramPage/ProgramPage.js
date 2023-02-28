import React from 'react';
import classNames from "classnames";
import {useHistory, useParams} from "react-router-dom";
import BackIcon from '@mui/icons-material/KeyboardBackspace';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import {Button, Chip, Grid, Stack, styled, Typography} from "@mui/material";
import Programs from "../../components/Programs/Programs";
import {programs} from "../../Utils";
import style from "../MainPage/MainPage.module.scss";

const Wrapper = styled('div')(({theme}) => ({
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    padding: '12px',
    paddingLeft: '24px',
    display: 'grid',
    gridTemplateRows: 'auto auto 1.5fr',
    gap: theme.spacing(2),
}));

const Bar = styled(Stack)(({theme}) => ({
    width: '100%',
    overflow: 'hidden',
    marginBottom: '-16px'
}));

const Header = styled('div')(({theme}) => ({
    width: '100%',
    overflow: 'hidden',
    display: 'grid',
    gridAutoFlow: 'column',
    gap: theme.spacing(1),
}));

const Body = styled(Grid)(({theme}) => ({
    width: '100%',
    overflow: 'hidden',
}));

const CardImg = styled('img')(({theme}) => ({
    objectFit: 'contain',
    objectPosition: 'center',
}));

const ProgramPage = () => {
    const {program} = useParams();
    const history = useHistory();
    const {title, img, duration, description} = programs[program];

    return (
        <Wrapper>
            <Bar direction="row" alignItems="center" spacing={1}>
                <Button size="small" startIcon={<BackIcon/>} sx={{fontWeight: 'bold'}}
                        onClick={() => history.goBack()}>
                    Назад
                </Button>
            </Bar>
            <Header item>
                <CardImg src={img}/>
                <Grid item container flexDirection="column">
                    <Typography variant="h4" fontWeight="bold" component="h3"
                                sx={{marginBottom: "8px", paddingRight: '3em'}}>
                        {title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{marginBottom: "8px"}}>
                        <Chip label={`${duration} мин.`} variant="outlined" icon={<TimerOutlinedIcon/>} size="small"/>
                        <Chip label="новинка" color="secondary" variant="outlined" size="small"/>
                        <Chip label="для начинающих " color="success" variant="outlined" size="small"/>
                    </Stack>
                    <Grid item>
                        {description}
                    </Grid>
                </Grid>
            </Header>
            <Body item>
                <Programs className={classNames(style.Programs)}/>
            </Body>
        </Wrapper>
    );
};

export default ProgramPage;