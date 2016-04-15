/**
 * Created by zjy on 2016/4/11.
 */

$(function () {
    var index = {
        item_tlp: '',
        con: null,
        start: 0,
        row: 0,
        lm: null,

        init: function () {
            this.item_tlp = '<a class="activity-item" href="'+window.__HOST__+'/index.php/Wechat/Index/activity/id/{{id}}.html">' +
                '<div class="activity-poster left">' +
                '<img src="{{poster}}">' +
                '</div>' +
                '<div class="activity-msg left">' +
                '<div class="activity-title">{{title}}</div>' +
                '<div class="activity-dept">{{association}}</div>' +
                '<div class="activity-location"><span class="glyphicon glyphicon-map-marker"></span> <span>{{location}}</span></div>' +
                '<div class="activity-attention">' +
                '<span class="glyphicon glyphicon-heart"></span> <span>{{like}}</span>' +
                '<span class="glyphicon glyphicon-comment"></span> <span>{{comment}}</span>' +
                '</div>' +
                '</div>' +
                '<div class="activity-time left">' +
                '<div class="status {{sclass}}">' +
                '{{status}}' +
                '</div>' +
                '<div class="time">' +
                '<div class="day">{{day}}</div>' +
                '<div class="clock">{{clock}}</div> ' +
                '</div> ' +
                '</div> ' +
                '</a>';

            this.con = $(".activity-list-box");
            this.row = 10;

            this.getMsg();
            this.bindEvent();
        },

        bindEvent: function () {
            var self = this;

            $(".activity-more").on('click', function () {
               self.start += self.row;
                self.getMsg();
            });
        },

        getMsg: function () {
            var self = this;
            $.ajax({
                //url: 'json/index.json',
                url: window.__HOST__ + '/index.php/Wechat/Index/getActivityList',
                type: 'get',
                data:{
                    from: self.start,
                    cnt: self.row,
                    uid: '',
                    type: '2000'
                },
                dataType: 'json',
                success: function (data) {
                    if(self.start == 0){
                        var htpl = '<div class="msg-poster">' +
                            '<img src="{{poster}}">' +
                            '</div>' +
                            '<a class="msg-cover" href="'+window.__HOST__+'/index.php/Wechat/Index/activity/id/{{id}}.html">' +
                            '<div class="msg-block">' +
                            '<!--活动名-->' +
                            '<div class="msg-title">' +
                            '{{title}}' +
                            '</div>' +
                            '<div class="msg-other">' +
                            '<span>{{time}}</span>' +
                        '<span>{{location}}</span>' +
                        '</div>' +
                        '</div>' +
                        '</a>';

                        var st = new Date(Date.parse(data.activity[0].activity_start_time.replace(/-/g,"/")));

                        var sm = st.getMonth() + 1;

                        var sd = st.getDate();
                        sd = sd < 9 ? '0' + sd: sd;

                        var sh = st.getHours();
                        sh = sh < 9 ? '0' + sh: sh;

                        var sn = st.getMinutes();
                        sn = sn < 9 ? '0' + sn: sn;
                        var pa = {
                            id: data.activity[0].id,
                            poster: data.activity[0].activity_pic_url,
                            title: data.activity[0].activity_name,
                            location: data.activity[0].activity_location,
                            time: sm + '/' + sd + '  ' + sh + ':' + sn
                        };

                        var re = Mustache.render(htpl, pa);
                        $(".activity-index-header").html(re);
                    }
                    if(data.activity.length < self.row){
                        $(".activity-more").off('click').text('到底了~');
                    }
                    self.build(data.activity);
                },
                error: function (err) {
                    console.log(err);
                }
            })
        },

        build: function(data){
            var self = this;
            var tpl = '<div>';
            data.forEach(function (value, index) {
                var ct = new Date();

                var st = new Date(Date.parse(value.activity_start_time.replace(/-/g,"/")));
                var et = new Date(Date.parse(value.activity_end_time.replace(/-/g,"/")));

                var sm = st.getMonth() + 1;

                var sd = st.getDate();
                sd = sd < 9 ? '0' + sd: sd;

                var sh = st.getHours();
                sh = sh < 9 ? '0' + sh: sh;

                var sn = st.getMinutes();
                sn = sn < 9 ? '0' + sn: sn;

                if(self.lm != sm){
                    tpl +=
                        '</div>' +
                        '<div class="activity-time-box">' +
                        '<div class="activity-time-title">'+ sm +'月</div>';
                }
                var status = '';
                var sclass = 'none';
                if(ct < st){

                }
                else if(ct > et){
                    status = '已结束';
                    sclass = 'did';
                }
                else{
                    status = '进行中';
                    sclass = 'doing';
                }
                var params = {
                    id: value.id,
                    poster: value.activity_pic_url,
                    title: value.activity_name,
                    association: value.association_name,
                    location: value.activity_location,
                    like: value.like,
                    comment: value.comment,
                    status: status,
                    sclass: sclass,
                    day: sd,
                    clock: sh + ':' + sn
                };

                tpl += Mustache.render(self.item_tlp, params);
                tpl += '</div>';
                self.lm = sm;
            });

            self.con.append($(tpl));
        }
    };

    index.init();
});