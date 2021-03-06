/** @jsx React.DOM */
$(function(){

  var ImageBox = React.createClass({
    loadCommentsFromServer: function(){
      $.getJSON(this.props.url, function(data){
        var new_date = parseInt(data[0].created_time),
            images = this.state.images,
            old_date = parseInt(images ? images[0].created_time : "0");
        if(new_date > old_date){
          window.scrollTo(0, 0);
        }
        this.setState({images: data.slice(0,10)});
      }.bind(this));
    },
    getInitialState: function() {
      return {};
    },
    componentWillMount: function() {
      this.loadCommentsFromServer();
      setInterval(this.loadCommentsFromServer, this.props.refreshRate);
    },
    render: function(){
      if($.isEmptyObject(this.state)){
        return (
          <div className="loading">
            Loading
          </div>
        );
      }
      var that = this,
          images;

      images = this.state.images.map(function(image, i){

        var toggleComments = function(){
          image.comments.show_comments = !image.comments.show_comments;
          that.forceUpdate();
        };
        return (
          <div className="post row" key={image.id}
            onClick={toggleComments}>
            <ImageView images={image.images} />
            <CaptionView data={image} />
          </div>
        );
      });
      return (
        <div>
        {images}
        </div>
      );
    },
  });

  var ImageView = React.createClass({
    render: function() {
      return (
        <img className='main' id="main"
          src={this.props.images.standard_resolution.url} />
      );
    },
  });

  var CaptionView = React.createClass({
    render: function(){
      var data = this.props.data,
          count = data.comments ? data.comments.count : 0,
          user = data.user,
          caption = data.caption,
          caption_view,
          created,
          likes,
          heart,
          ago = moment(data.created_time, 'X').fromNow();

      if(caption === null){
        created = (""+new Date(data.created_time*1000))
          .split(' ').slice(0,5).join(' ');
        caption_view = (
          <span className='caption'>Posted on {created}</span>
        );
      } else {
        caption_view = (
          <span className='caption'>{caption.text}</span>
        );
      }

      likes = data.likes.data.map(function(like){
        return <a href={'http://instagram.com/' + user.username} key={like.id}>
          {like.username} </a>;
      });
      heart = likes.length ? <i className="glyphicon glyphicon-heart"></i> :
        <i className="glyphicon glyphicon-heart-empty"></i>;

      return (
        <div className="comment clearfix">
          <div className="col-xs-12 likes">
            {heart} {likes}
          </div>
          <div className="col-xs-12">
            <img className="comment_picture"
              src={user.profile_picture} />
            <div className="comment_caption">
              <a href={'http://instagram.com/' + user.username}>
                {user.username}
              </a> {caption_view}
            </div>
          </div>
          <div className="col-xs-12 ago">
            {ago}
          </div>
        </div>
      );
    }
  });
  var CommentsCount = React.createClass({
    render: function(){
      var count = this.props.count;

      if(count === 0){
        return (
          <div></div>
        );
      }
      return (
        <div className="comments_count">{count}</div>
      );
    }
  });
  var CommentsView = React.createClass({
    render: function(){
      var comments = this.props.comments,
          show_last = comments.show_comments;

      if(comments.count > 0 && show_last){
        var comments_list = $.map(comments.data, function(comment){
          var data = {
            user: comment.from,
            caption: comment
          };
          return (
            <CaptionView data={data} />
          );
        });
        return (
          <div className="comments_list">
            {comments_list}
          </div>
        );
      }
      return (
        <div></div>
      );
    }
  });

  var Comment = React.createClass({
    render: function(){
      var comment = this.props.comment;
      return (
        <div></div>
      );
    }
  });

  // Main View
  React.renderComponent(
    <ImageBox url="/check" refreshRate="100000" />,
    document.getElementById('content')
  );

});
