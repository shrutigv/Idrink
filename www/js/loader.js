(function() {
    "use strict";
    var app = {
        self: null,
        initialize: function() {
            self = this;
            if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
                document.addEventListener("deviceready", this.onDeviceReady, false);
            } else {
                this.onDeviceReady();
            }
        },
        onDeviceReady: function() {
            var model = new StoreModel(),
                view = new ProfileView(model,true),
                controller = new ProfileController(model, view);
        }
    };
    app.initialize();
})();