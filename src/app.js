import React from "react";
import ReactDOM from "react-dom";
import Provider from "./Provider.js"
import Cmp1 from "./component/Cmp1.js"
import data from "./propsData.js"
ReactDOM.render((<Provider propsData={data}>
    <Cmp1/>
</Provider>),document.getElementById("root"));
