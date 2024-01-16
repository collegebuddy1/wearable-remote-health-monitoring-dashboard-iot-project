import React from "react";


class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: '',
            errorInfo: '',
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        // Use any error reporting service such as Sentry
        console.log("error: ", error );
        console.log("errorInfo:", errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo,
        })
    }

   /* componentWillUnmount() {
        const {history} = this.props;
        history.push("/admin/index");
    }*/

    render() {
        const {errorInfo, error} = this.state;
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div>
                <br/>
                <br/>
                <br/>
                <div className={"container bg-light"}>
                    <div className={"row"}>
                        <div className={"col d-flex justify-content-center"}>
                            <h1 className={"display-2"}>
                                500: Internal Server Error
                            </h1>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col d-flex justify-content-center"}>
                            <h1>
                                Uh oh, something went wrong. Please try reloading the app
                                and contact us with details of this error.{' '}
                                <span
                                    style={{ cursor: 'pointer', color: '#0077FF' }}
                                    onClick={() => {
                                        window.location.replace("/admin/index");
                                    }}
                                >
            Click here to reload the application.
          </span>{' '}
                            </h1>
                        </div>
                    </div>

                    <div className={"row bg-dark"}>
                        <div className={"col d-flex justify-content-center"}>
                            <h1 className={"text-white"}>Error Log</h1>
                        </div>
                    </div>
                    <div className={"row bg-dark text-light"}>
                        <div className={"col d-flex justify-content-start"}>
                            {error.toString()}
                        </div>
                    </div>
                    <div className={"row bg-dark text-light"}>
                        <div className={"col d-flex justify-content-center"}>
                            <h2 className={"text-white"}>Stack Trace</h2>
                        </div>
                    </div>
                    <div className={"row bg-dark text-light"}>
                        <div className={"col d-flex justify-content-center"}>
                            {errorInfo && errorInfo.componentStack.toString()}
                        </div>
                    </div>
                </div>
            </div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;