/**
 * Created by zjy on 16-3-13.
 */
$(function () {
    var msg = {
        render:'',
        IFMax: false,
        fetching: false,
        loaded:5,
        init: function () {
            this.render = '<div class="comment-box">' +
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
            this.bindEvent();
        },
        bindEvent: function () {
            var self = this;
            var wh=$(window).height();
            var refresh = $("#comment-refresh");

            $(window).on('scroll', function () {
                var LFTop= $(window).scrollTop();
                var RETop= refresh.offset().top;
                if(self.IFMax){
                    $(window).off("scroll");
                    refresh.text("无更多评论");
                }

                console.log(RETop - LFTop - wh);
                console.log(!self.fetching);
                if(RETop - LFTop - wh < 0 ){
                    if(!self.fetching){
                        self.loadMsg(self.start,self.rows);
                    }
                }
            });
        },
        loadMsg: function () {
            var self = this;
            self.fetching = true;
            $.ajax({
                url: '../json/comment.json',
                success: function (data) {
                    self.loaded += 5;
                    if(self.loaded >= data.all){
                        self.IFMax = true;
                    }
                    data.msg.forEach(function (value) {
                        var view = {
                            img: value.user['user-img'],
                            name: value.user['user-name'],
                            content: value.comment.content,
                            time: value.comment.time
                        };
                        var renderMsg = Mustache.render(self.render,view);
                        $('.comment-area').append($(renderMsg));
                    });
                },
                complete: function () {
                    self.fetching = false;
                }
            });
        }
    };

    msg.init();
});