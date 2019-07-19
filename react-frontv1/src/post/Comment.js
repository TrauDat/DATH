import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import "../css/style.css";

class Comment extends Component {
    state = {
        text: "",
        error: ""
    };

    handleChange = event => {
        this.setState({ error: "" });
        this.setState({ text: event.target.value });
    };

    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0 || text.length > 150) {
            this.setState({
                error:
                    "Bình luận không được rỗng và lớn hơn 150 kí tự"
            });
            return false;
        }
        return true;
    };

    addComment = e => {
        e.preventDefault();

        if (!isAuthenticated()) {
            this.setState({ error: "Vui lòng nhập bình luận" });
            return false;
        }

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;

            comment(userId, token, postId, { text: this.state.text }).then(
                data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.setState({ text: "" });
                        // dispatch fresh list of coments to parent (SinglePost)
                        this.props.updateComments(data.comments);
                    }
                }
            );
        }
    };

    deleteComment = comment => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateComments(data.comments);
            }
        });
    };

    deleteConfirmed = comment => {
        let answer = window.confirm(
            "Bạn có chắc chắn xóa bình luận?"
        );
        if (answer) {
            this.deleteComment(comment);
        }
    };

    render() {
        const { comments } = this.props;
        const { error } = this.state;

        return (
            <div>
                <h2 className="mt-5 mb-5">Nhập bình luận</h2>

                <form onSubmit={this.addComment}>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.text}
                            className="form-control"
                            placeholder="Nhập bình luận..."
                        />
                        <button className="btn btn-raised btn-success mt-2">
                            Bình luận
                        </button>
                    </div>
                </form>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                <div className="col-md-12">
                    <h3 className="text-primary">{comments.length} Bình Luận</h3>
                    <hr />
                    {comments.map((comment, i) => (
                        <div key={i}>
                            <div>
                                <div className="td" id="p-c-i">
                                <Link to={`/user/${comment.postedBy._id}`}>
                                    <img
                                        
                                        className="img-thumbnail"
                                       
                                        onError={i =>
                                            (i.target.src = `${DefaultProfile}`)
                                        }
                                        src={`http://localhost:8080/api/user/photo/${comment.postedBy._id}`}
                                        alt={comment.postedBy.name}
                                    />
                                </Link>
                                </div>
                                <div>
                                    <p className="lead">{comment.text}</p>
                                    <p className="font-italic mark">
                                        Bình luận bởi{" "}
                                        <Link
                                            to={`/user/${comment.postedBy._id}`}
                                        >
                                            {comment.postedBy.name}{" "}
                                        </Link>
                                        on{" "}
                                        {new Date(
                                            comment.created
                                        ).toDateString()}
                                        <span>
                                            {isAuthenticated().user &&
                                                isAuthenticated().user._id ===
                                                    comment.postedBy._id && (
                                                    <>
                                                        <span
                                                            onClick={() =>
                                                                this.deleteConfirmed(
                                                                    comment
                                                                )
                                                            }
                                                            className="text-danger float-right mr-1"
                                                        >
                                                            Xóa
                                                        </span>
                                                    </>
                                                )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Comment;
