import React, {useState} from 'react';
import classNames from "classnames";
import SportCanvas from "../../screen/SportCanvas";
import style from "./SportPage.module.scss";
import {Box, Button, Chip, Grid, Slider, Stack, styled, Typography} from "@mui/material";
import ButtonBases from "./ButtonBases";
import BackIcon from "@mui/icons-material/KeyboardBackspace";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import Programs from "../../components/Programs/Programs";
import {useHistory} from "react-router-dom";

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
    marginBottom: '-8px'
}));

const SportPage = ({className}) => {
    const [value, setValue] = useState(10);
    const history = useHistory();

    const handleChange = (event, newValue) => {
        if (typeof newValue === 'number') {
            setValue(newValue);
        }
    };

    return <SportCanvas className={classNames(style.Canvas)}/>;

    return (
        <Wrapper>
            <Bar direction="row" alignItems="center" spacing={1}>
                <Button size="small" startIcon={<BackIcon/>} sx={{fontWeight: 'bold'}}
                        onClick={() => history.goBack()}>
                    Назад
                </Button>
            </Bar>

            <Stack spacing={1}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{flex: '0 0 auto'}}>
                    Составить программу тренировок
                </Typography>

                <Typography variant="body1">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium amet aperiam asperiores
                    assumenda consequuntur deserunt dicta, dolore ducimus eum, inventore nobis nostrum officia officiis
                    provident quia saepe voluptate! Inventore?
                </Typography>

                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{flex: '0 0 auto'}}>
                    Выберите упражнения для тренировки
                </Typography>

                <ButtonBases/>

                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{flex: '0 0 auto'}}>
                    Укажите количество повторений
                </Typography>

                <Grid container direction="row" spacing={2} alignItems="center">
                    <Grid item container xs={3}>
                        <Typography variant="body1">
                            Количество повторений:
                        </Typography>
                    </Grid>
                    <Grid item container xs={4}>
                        <Slider
                            value={value}
                            min={5}
                            step={5}
                            max={50}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item container xs={1}>
                        <Typography variant="body1" fontWeight="bold">
                            {value}
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
        </Wrapper>
    );
};

export default SportPage;