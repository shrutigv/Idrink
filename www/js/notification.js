var Notification = function() {
    var notification = {
        cur: null,
        time: null,
        initialize: function() {
            cur = this;
            this.setNotification();
            for (var j = 0; j < cur.time.length; j++) {
                $('.notificationWrapper').find("[data-time='" + cur.time[j] + "']").attr('checked', 'checked');
            }
            $('#save').on('click', function(e) {
                cordova.plugins.notification.local.cancelAll(function() {}, this);
                cur.time = [];
                $('.notification input:checked').each(function(i) {
                    cur.time.push($(this).attr('data-time'));
                });
                cur.setNotification();
                e.stopImmediatePropagation();
            });
        },
        getTime: function() {
            return this.time;
        },
        setTime: function(t) {
            this.time = t;
        },
        setNotification: function() {
            for (var i = 0; i < cur.time.length; i++) {
                var date = new Date();
                var schedule_time = new Date((date.getMonth() + '-' + date.getDay() + '-' + date.getFullYear() + " " + cur.time[i]).replace(/-/g, "/")).getTime();
                schedule_time = new Date(schedule_time);
                cur.register(schedule_time, i);
            }
        },
        register: function(t, i) {
            cordova.plugins.notification.local.schedule({
                id: i,
                title: "Hydration time!!",
                text: "Time to hydrate yourself",
                every: "day",
                icon: "res://not_icon.png",
                smallIcon: "res://not_icon.png",
                at: t
            });
        }
    }
    return notification;
}