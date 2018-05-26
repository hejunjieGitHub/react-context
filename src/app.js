import React from "react";
import ReactDOM from "react-dom";
import MainRouter from "./routes/MainRouter.js"
import {BrowserRouter} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from "./util/i18next.js"

ReactDOM.render((<BrowserRouter>
    <I18nextProvider i18n={ i18n() }><MainRouter/></I18nextProvider>
</BrowserRouter>),document.getElementById("root"));
