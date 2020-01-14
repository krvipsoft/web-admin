import React, {Component} from "react";
import { Result, Icon, Button, message ,Spin } from 'antd';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import {postInner} from '../../untils/axios'

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            icons:'success',
            loading:true
        }
    }
    componentDidMount() {
        console.log(this)
        this.userInfo()

    }

    userInfo = () =>{

        postInner('/api/v1/systems/userinfo').then((data)=>{
            console.log(data)
            this.setState({
                loading:false,
                icons:'success'
            })
        }).catch(err => {
            message.error('404 Not Found')
            this.setState({
                loading:false,
                icons:'error'
            })
        })

    }

    render() {
        return (
            <Spin spinning={this.state.loading}>
                <Result
                    status={this.state.icons}
                    title="欢迎使用WebAdmin!"
                    extra={<Button
                        type="primary">
                        <a href="https://github.com/kuhami/web-admin" target={'_blank'}>阅读文档</a>
                    </Button>}
                    />
            </Spin>
        );
    }
}
const mapStateToProps = (state, ownProps) =>{
    console.log(state, ownProps);
    return {
        home:state.home
    }
}
export default connect(mapStateToProps)(Home)