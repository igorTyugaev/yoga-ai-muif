import React from 'react';
import {Typography, Grid, Stack, Button} from "@mui/material";

const DemoPage = () => {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 2 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Unique Visitor</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <Button
                                size="small"

                            >
                                Month
                            </Button>
                            <Button
                                size="small"

                            >
                                Week
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ducimus excepturi iure, maiores
                    minus non, officiis placeat, praesentium quibusdam quidem quo reiciendis repellat tempore. Ea eos
                    illum quibusdam totam. Enim?
                </div>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Income Overview</Typography>
                    </Grid>
                    <Grid item/>
                </Grid>
                <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ducimus excepturi iure, maiores
                    minus non, officiis placeat, praesentium quibusdam quidem quo reiciendis repellat tempore. Ea eos
                    illum quibusdam totam. Enim?
                </div>
            </Grid>
        </Grid>
    );
};

export default DemoPage;