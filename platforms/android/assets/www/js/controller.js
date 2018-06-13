! function() {
    "use strict";
    ({
        model: null,
        self: null,
        hydrateCtrl: null,
        notify: null,
        initialize: function() {
            self = this, this.model = new StoreModel, this.notify = new Notification;
            var a = new HydrateView(self.model);
            this.hydrateCtrl = new HydrateController(self.model, a), navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) ? document.addEventListener("deviceready", this.onDeviceReady, !1) : this.onDeviceReady()
        },
        appClosed: function() {
            self.model.setTime(self.notify.getTime());
            self.model.saveData();
            self.hydrateCtrl.updateLastOpenedDate();
        },
        appOpened: function() {
            self.hydrateCtrl.initialize();
        },
        registerEvent: function() {
            document.addEventListener("pause", self.appClosed, !1), document.addEventListener("resume", self.appOpened, !1), document.addEventListener("backbutton", self.onBackKeyDown, !1)
        },
        onBackKeyDown: function(a) {
            a.preventDefault()
        },
        onDeviceReady: function() {
            self.registerEvent();
            var a = new ProfileView(self.model, !1);
            new ProfileController(self.model, a);
            self.notify.setTime(self.model.getTime()), self.notify.initialize()
        }
    }).initialize()
}();