import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function ErrorScreen({ error }) {
  return (
    <div style={{ minHeight: "100vh", padding: 32, background: "#0a0a0f", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ margin: "0 0 12px", fontSize: 24 }}>TaskFlow hit a browser error</h1>
      <pre style={{ whiteSpace: "pre-wrap", color: "#fda4af" }}>{String(error?.stack || error?.message || error)}</pre>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.error) return <ErrorScreen error={this.state.error} />;
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));

window.addEventListener("error", (event) => {
  root.render(<ErrorScreen error={event.error || event.message} />);
});

window.addEventListener("unhandledrejection", (event) => {
  root.render(<ErrorScreen error={event.reason} />);
});

import("./App")
  .then(({ default: App }) => {
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
    );
  })
  .catch((error) => {
    root.render(<ErrorScreen error={error} />);
  });
