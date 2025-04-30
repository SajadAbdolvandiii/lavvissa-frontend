import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Error boundary for the entire app
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error("Application error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return ( <
                div style = {
                    { padding: '20px', textAlign: 'center' }
                } >
                <
                h2 > متأسفانه خطایی رخ داده است. < /h2> <
                p > لطفا صفحه را مجدداً بارگذاری کنید یا با پشتیبانی تماس بگیرید. < /p> <
                button onClick = {
                    () => window.location.reload()
                } > بارگذاری مجدد صفحه < /button> <
                details style = {
                    { marginTop: '20px', textAlign: 'left', direction: 'ltr' }
                } >
                <
                summary > جزئیات خطا(برای توسعه‌دهندگان) < /summary> <
                pre style = {
                    { whiteSpace: 'pre-wrap' }
                } > { this.state.error && this.state.error.toString() } <
                br / > { this.state.errorInfo && this.state.errorInfo.componentStack } <
                /pre> < /
                details > <
                /div>
            );
        }

        return this.props.children;
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render( <
    React.StrictMode >
    <
    ErrorBoundary >
    <
    App / >
    <
    /ErrorBoundary> < /
    React.StrictMode >
);