import React, {Component} from "react";
import {Layout, Menu, Icon} from "antd";
import { Link, browserHistory  } from 'react-router'
import DataList from '../../config/dataList'
import Home from "../routes/home";
import '../styles.css';

const { Header, Sider, Content } = Layout;

export default class App extends Component {
    constructor(props) {
        super(props);
        const {component} = this.props.route.childRoutes[0];
        const { pathname } = props.location;

        this.state = {
            collapsed: false,
            pathname,
            component,
            defaultSelectedKeys:[pathname],
            DataList:DataList.tabs,
            openKeys: [],
            rootSubmenuKeys:[]
        };
    }

    componentDidMount() {
        const {pathname,DataList} = this.state;
        const openKeys = this.parentPath(DataList, pathname);
        const rootSubmenuKeys = DataList.map((v)=>v.path);
        this.setState({
            openKeys,
            rootSubmenuKeys
        })
    }

    //通过路由找到父级菜单path
    parentPath = (DataList,pathname,parentPatn='/') =>{
        let parent = [];
        const self = this;
        const getData = (DataList,pathname,parentPatn) =>{
            DataList.forEach((v)=>{
                if(v.path === pathname){
                    parent.push(parentPatn);
                    getData(self.state.DataList, parentPatn,'');
                }else if(v.childen && v.childen.length){
                    getData(v.childen,pathname,v.path);
                }
            })
        };
        getData(DataList, pathname, parentPatn);
        return parent;
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    onOpenChange = (openKeys) =>{
        const {rootSubmenuKeys} = this.state;
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    handleClick = (e) =>{
        const {key} = e;

        browserHistory.push(`#${key}`)
    }

    getMenuList = (DataList)=> {
        return DataList.map((v)=>{
            if(v.childen && v.childen.length){
                return (
                    <Menu.SubMenu key={v.path}
                                  title={<span><Icon type={v.icon} />
                                  <span>{ v.text }</span>
                                  </span>}>
                        {this.getMenuList(v.childen)}
                    </Menu.SubMenu>
                )
            }
            return (<Menu.Item key={v.path}>
                <Link to={v.path}>
                    <Icon type={v.icon} />
                    <span>{v.text}</span>
                </Link>
            </Menu.Item>)
        })


    }
    render() {
        const {defaultSelectedKeys,component, DataList, openKeys} = this.state;
        return (
            <Layout className={'layout'}>
                <Sider
                    trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo">
                        Web
                    </div>
                    <Menu theme="dark"
                          mode="inline"
                          defaultSelectedKeys={defaultSelectedKeys}
                          openKeys={openKeys}
                          onOpenChange={this.onOpenChange}
                          onClick={this.handleClick}
                    >
                        {this.getMenuList(DataList)}
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        {this.props.children ? this.props.children:'没有找到路由'}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}