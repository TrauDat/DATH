import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read } from '../user/apiUser';
import "../css/style.css";
import DefaultProfile from '../img/my_avatar.png';
import DefaultBanner from '../img/beach.jpg';

import { list } from "./apiPost";
import DefaultPost from "../img/beach.jpg";



class Posts extends Component {

    constructor() {
        super();
        this.state = {
            posts: [],
            user: "",
            redirectToSignin: false,
        };
    }

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true });
                } else {
                    this.setState({user: data});
                }
            });
    };

    loadPosts = page => {
        list(page).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

    componentDidMount() {
        // const userId = this.props.match.params.userId;
        // this.init(userId);
        this.loadPosts(this.state.page);
    }
    // componentWillReceiveProps(props) {
    //     const userId = props.match.params.userId;
    //     this.init(userId);
    // }

    renderPosts = posts => {
        return (
            <>
                {posts.map((post, i) => {
                    const posterId = post.postedBy
                        ? `/user/${post.postedBy._id}`
                        : "";
                    const posterName = post.postedBy
                        ? post.postedBy.name
                        : " Unknown";

                    return (
                        <div>
                        <div className="post" key={i}>
                            <div className="tb">
                                <a href="#" className="td p-p-pic">
                                <img 
                                    className="img-thumbnail"
                                    src={`http://localhost:8080/api/post/photo/${post._id}`}
                                    alt={post.title} 
                                    onError={i =>
                                        (i.target.src = `${DefaultPost}`)
                                    }
                                
                                /> 
                                </a>
                                <div className="td p-r-hdr">
                                    <div className="p-u-info">
                                    <Link to={`${posterId}`}>
                                        {posterName}{" "}
                                    </Link> chia sẻ cùng với
                                     <a href="#"> TrauDat</a> 
                                    </div>
                                    <div className="p-dt">
                                    <i className="fas fa-calendar"></i>
                                    {new Date(post.created).toDateString()}
                                    </div>
                                </div>
                                <div className="td p-opt"><i className="fas fa-chevron-down"></i></div>
                            </div>
                            
                            <h5 className="card-title">{post.title}</h5>

                            <Link
                                    to={`/post/${post._id}`}
                                    className="p-cnt-v"
                                >                         
                                        <img 
                                                className="img-thumbnail"
                                                src={`http://localhost:8080/api/post/photo/${post._id}`}
                                                alt={post.title} 
                                                onError={i =>
                                                    (i.target.src = `${DefaultPost}`)
                                                }
                                            
                                        /> 
                                </Link>
                            
                           
                        </div>
                        </div>
                    );
                })}
            </>
        );
    };

    render() {

        const {redirectToSignin, user, posts} = this.state;
        if (redirectToSignin) 
            return <Redirect to="/singin" />

        const photoUrl = user._id
            ? `http://localhost:8080/api/user/photo/${
                  user._id
              }?${new Date().getTime()}`
            : DefaultProfile;

        const photoBackgroundUrl = user._id
            ? `http://localhost:8080/api/user/photoBackground/${
                  user._id
              }?${new Date().getTime()}`
            : DefaultBanner;

        // const photoUrl = user._id ? 
        // `${process.env.REACT_APP_API_URL}/api/user/photo/${
        //     user._id
        // }?${new Date().getTime()}` : DefaultProfile;

        

        return (
            

            <>
                <div className="bodyOfMyProfile">
                <main className="container">
                    <div className="row">

                        <div className="news">

                        
                            <div className="col-lg-3">
                                <div className="panel panel-default">
                                <div className="panel-body">
                                <div className="cnt-label">
                                        
                                        
                                        <div className="lb-action">
                                            
                                            {isAuthenticated().user && isAuthenticated().user._id === user._id && (
                                                <>
                                                    <Link to={`/user/edit/${user._id}`}
                                                    >
                                                        <i className="fas fa-pencil-alt"></i>
                                                    </Link>
                                                    
                                                </>
                                            )}

                                            
                                        </div>

                                </div>
                                <div id="i-box">
                                   
                                </div>
                                </div>
                            </div>

                                <div className="l-cnt l-mrg">
                                                <div className="cnt-label">
                                                    <i className="l-i" id="l-i-p"></i>
                                                    <span>Photos</span>
                                                    <div className="lb-action" id="b-i"><i className="far fa-image"></i></div>
                                                </div>
                                                <div id="photos">
                                                    <div className="tb">
                                                        <div className="tr">
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                        </div>
                                                        <div className="tr">
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                        </div>
                                                        <div className="tr">
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                            <div className="td"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                            </div>
                            <div className="col-lg-6">
                                
                                <div className="m-mrg" id="composer">
                                                <div id="c-tabs-cvr">
                                                    <div className="tb" id="c-tabs">
                                                        <div className="td active"><i className="fas fa-th"></i><span>Tạo bài viết</span></div>
                                                        <div className="td"><i className="fas fa-camera-retro"></i><span>Photo/Video</span></div>
                                                        <div className="td"><i className="fas fa-video"></i><span>Live Video</span></div>
                                                        <div className="td"><i className="far fa-calendar-alt"></i><span>Dòng thời gian</span></div>
                                                    </div>
                                                </div>
                                                <div id="c-c-main">
                                                    <div className="tb">
                                                        <div className="td" id="p-c-i">
                                                        <img 
                                                            className="img-thumbnail"
                                                            src={photoUrl} 
                                                            onError={i => (i.target.src = `${DefaultProfile}`)}
                                                            alt={user.name}
                                                        />  
                                                        
                                                        </div>
                                                        <div className="td" id="c-inp">
                                                            <input type="text" placeholder="Bạn đang nghĩ gì?" />
                                                        </div>
                                                    </div>
                                                    <div id="insert_emoji"><i className="far fa-smile"></i></div>
                                                </div>
                                </div>

                                

                        <div>
                            {this.renderPosts(posts)}
                        {/* <div className="panel panel-default">
                            <div className="panel-body">
                            <p>Hello people! This is my first FaceClone post. Hurray!!!</p>
                            </div>
                            <div className="panel-footer">
                            <span>posted 2017-5-27 20:45:01 by nicholaskajoh</span> 
                            <span className="pull-right"><a className="text-danger" href="#">[delete]</a></span>
                            </div>
                        </div> */}
                        </div>
                    </div>
                    
                    </div>
                    </div>
                </main>
                </div>
                

            </>
        );
    }
}

export default Posts;