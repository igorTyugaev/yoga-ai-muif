import React from "react";
import {ReactComponent as CabinIllustration} from "../../illustrations/cabin.svg";
import {ReactComponent as InsertBlockIllustration} from "../../illustrations/insert-block.svg";
import {EmptyState} from "../../domain";
import {useAppContext} from "../../AppContext";

const HomePage = () => {
    const appContext = useAppContext();
    // Properties
    const {user} = appContext;

    if (user) {
        return (
            <EmptyState
                image={<CabinIllustration/>}
                title="Home"
                description="This is the home page. You can edit it from HomePage.js."
            />
        );
    }

    return (
        <EmptyState
            image={<InsertBlockIllustration/>}
            title="YogaAI"
            description="Йога, доступная каждому!"
        />
    );
}

export default HomePage;
