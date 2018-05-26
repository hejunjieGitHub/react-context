import React,{Component,PropTypes} from "react";

class Provider extends Component{

    getChildContext = () => {
        return {
            propsData:this.props.propsData
        }
    }

    render(){
        return this.props.children;
    }
}

Provider.childContextTypes={
    propsData:PropTypes.object
}

export default Provider;