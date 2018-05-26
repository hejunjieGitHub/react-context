import React,{Component,PropTypes} from "react";

class Cmp1 extends Component{
    constructor(props,context){
        super(...arguments);
        // this.name = context.name;
    }
    render(){
        console.log("context:",this.context)
        return <h1>{this.context.propsData.name}</h1>
    }
}
Cmp1.contextTypes = {
    propsData:PropTypes.object
}
export default Cmp1;