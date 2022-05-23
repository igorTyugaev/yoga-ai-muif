import React, {Component} from "react";

import PropTypes from "prop-types";

import EmptyState from "../EmptyState";

import {ReactComponent as ErrorIllustration} from "../../illustrations/error.svg";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            eventId: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    render() {
        // Properties
        const {children} = this.props;

        const {hasError} = this.state;

        if (hasError) {
            return (
                <EmptyState
                    image={<ErrorIllustration/>}
                    title="Что-то пошло не так"
                    description="Не удалось загрузить приложение"
                />
            );
        }

        return children;
    }
}

ErrorBoundary.propTypes = {
    // Properties
    children: PropTypes.array.isRequired,
};

export default ErrorBoundary;
