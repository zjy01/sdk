/**
 * Created by zjy on 16-3-13.
 */
$(function () {
    var msg = {
        commentTpl: '',
        likeTpl: '',
        IFMax: false,
        fetching: false,
        loaded:5,
        init: function () {
            this.commentTpl = '<div class="comment-box">' +
                '<table>' +
                '<tr>' +
                '<td class="user-img-td" valign="top">' +
                '<div class="user-img">' +
                '<img src="{{img}}">' +
                '</div>' +
                '</td>' +
                '<td class="user-comment-td">' +
                '<div class="user-name">' +
                '{{name}}' +
                '</div>' +
                '<div>' +
                '{{content}}'+
                '</div>' +
                '<div class="comment-time">' +
                '{{time}}' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>';
            this.likeTpl = '<div class="like-person">' +
                '<img src="{{img}}">' +
                '</div>';

            this.bindEvent();
            this.loadLike();
        },
        bindEvent: function () {
            var self = this;
            var wh=$(window).height();
            var refresh = $("#comment-refresh");

            $(window).on('scroll', function () {
                var LFTop= $(window).scrollTop();
                var RETop= refresh.offset().top;
                if(RETop - LFTop - wh < 0 ){
                    if(!self.fetching){
                        self.loadComment(self.start,self.rows);
                    }
                }
            });
        },
        loadComment: function () {
            var self = this;
            self.fetching = true;
            $.ajax({
                url: 'json/comment.json',
                success: function (data) {
                    self.loaded += 5;
                    var renderMsg = '';
                    data.msg.forEach(function (value) {
                        var view = {
                            img: value.user['user-img'],
                            name: value.user['user-name'],
                            content: value.comment.content,
                            time: value.comment.time
                        };
                        renderMsg += Mustache.render(self.commentTpl,view);
                    });

                    $('.comment-area').append($(renderMsg));
                    if(self.loaded >= data.all){
                        $(window).off("scroll");
                        $("#comment-refresh").text("无更多评论");
                    }
                },
                complete: function () {
                    self.fetching = false;
                }
            });
        },
        loadLike: function () {
            var self = this;
            var lw=$(".like-person-box").width();
            var iw=56;
            var num = Math.floor(lw/iw);
            console.log(num);
            $.ajax({
                url: 'json/like.json',
                data:{
                  num:num
                },
                success: function (data) {
                    var rn = 0;
                    var renderMsg = '';
                    var renderDot = '';
                    if(data.all <= num ){
                        rn = num;
                    } else {
                        rn = num - 1;
                        renderDot = '<div class="like-person">' +
                            '<img src="src/img/dots.png">' +
                            '</div>';
                    }
                    for(var i = 0; i < rn; i++){
                        var view = {
                            img: data.data[i].img
                        };
                        renderMsg += Mustache.render(self.likeTpl,view);
                    }
                    renderMsg += renderDot;
                    $('.like-person-box').append($(renderMsg));
                },
                complete: function () {
                    self.fetching = false;
                }
            });
        }
    };

    msg.init();
});