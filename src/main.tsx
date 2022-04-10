import { render, h } from "preact";
import "preact/debug";
import { App } from "./app";
import "./index.css";

render(<App />, document.getElementById("app")!);
