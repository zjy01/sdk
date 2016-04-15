/**
 * Created by zjy on 16-3-13.
 */

var msg = {
    commentTpl: '',
    likeTpl: '',
    IFMax: false,
    fetching: false,
    loaded: 0,//已经加载的评论数
    load_rows: 0,//每次加载的评论数,
    id: '', //文章id
    type: '',
    init: function (type) {
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
            '{{{name}}}' +
            '</div>' +
            '<div>' +
            '{{{content}}}' +
            '</div>' +
            '<div class="comment-time">' +
            '{{{time}}}' +
            '</div>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</div>';
        this.likeTpl = '<div class="like-person">' +
            '<img src="{{img}}">' +
            '</div>';

        this.load_rows = 5;
        this.id = this.getPar('id');

        console.log(this.id);
        this.type = type;
        this.bindEvent();
        this.loadLike();
        this.loadComment();
    },
    bindEvent: function () {
        var self = this;
        var wh = $(window).height();
        var refresh = $("#comment-refresh");

        $(window).on('scroll', function () {
            var LFTop = $(window).scrollTop();
            var RETop = refresh.offset().top;
            if (RETop - LFTop - wh < 0) {
                if (!self.fetching) {
                    self.loadComment(self.start, self.rows);
                }
            }
        });
    },
    loadComment: function () {
        var self = this;
        self.fetching = true;
        $.ajax({
            //url: 'json/comment.json',
            url: window.__HOST__ + '/index.php/Wechat/Index/get'+self.type+'Comment',
            data: {
                "id": self.id,
                "start": self.loaded,
                "rows": self.load_rows
            },
            dataType: 'json',
            success: function (data) {
                if (!data.data) return false;
                data = data.data;
                $("#comment-num").text(data.total);

                self.loaded += self.load_rows;
                var renderMsg = '';
                data.comment.forEach(function (value) {
                    var view = {
                        img: value.comment_ava,
                        name: value.name,
                        content: value.content,
                        time: value.time
                    };
                    renderMsg += Mustache.render(self.commentTpl, view);
                });
                $('.comment-area').append($(renderMsg));
                if (self.loaded >= data.total) {
                    $(window).off("scroll");
                    $("#comment-refresh").text("到底了~");
                }
            },
            complete: function () {
                self.fetching = false;
            }
        });
    },
    loadLike: function () {
        var self = this;
        var lw = $(".like-person-box").width();
        var iw = 56;
        var num = Math.floor(lw / iw);
        $.ajax({
            //url: 'json/like.json',
            url: window.__HOST__ + '/index.php/Wechat/Index/get'+self.type+'Like',
            data: {
                "id": self.id,
                num: num
            },
            dataType: 'json',
            success: function (data) {
                if (!data.data) return false;
                data = data.data;
                $("#like-num").text(data.total);

                var rn = 0;
                var renderMsg = '';
                var renderDot = '';
                if (data.total <= num) {
                    rn = data.total;
                } else {
                    rn = num - 1;
                    renderDot = '<div class="like-person like-dot"> ' +
                        '</div>';
                }
                for (var i = 0; i < rn; i++) {
                    var view = {
                        img: data.ava[i].headpic
                    };
                    renderMsg += Mustache.render(self.likeTpl, view);
                }
                renderMsg += renderDot;
                $('.like-person-box').append($(renderMsg));
            },
            complete: function () {
                self.fetching = false;
            }
        });
    },
    getPar: function (par) {
        //获取当前URL
        var local_url = location.href;
        //获取要取得的get参数位置
        var get = local_url.indexOf(par + "=");
        if (get == -1) {
            //截取字符串 /paralue 模式
            var pattern = new RegExp('/' + par + '/(.*?)(/|\\.|$)', 'i');
            var re = pattern.exec(local_url);
            if (re) {
                return re[1];
            }
            else {
                return false;
            }
        }
        //截取字符串 ?par=value模式
        var get_par = local_url.slice(par.length + get + 1);
        //判断截取后的字符串是否还有其他get参数
        var nextPar = get_par.indexOf("&");
        if (nextPar != -1) {
            get_par = get_par.slice(0, nextPar);
        }

        return get_par;
    }

};