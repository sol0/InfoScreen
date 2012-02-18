(function($) {
	
	var collection = Backbone.Collection.extend({
		initialize : function(models, options) {
			// prevents loss of 'this' inside methods
			_.bindAll(this, "refresh");
			
			// bind refresh
			this.bind("born", this.refresh);
			this.bind("refresh", this.refresh);
			
			// default hashtag
			if(!options.hashtag)
				options.hashtag = "flatturtle";
			
			// automatic collection refresh each minute, this will automatically
			// trigger the reset event
			refreshInterval = window.setInterval(this.refresh, 60000);
		},
		refresh : function() {
			this.fetch();
		},
		url : function() {
			// remote source url
			return 'http://data.irail.be/spectql/twitter/search/' + this.options.hashtag + "/results.limit(15):json";
		},
		parse : function(json) {
			var tweets = json.spectql;

			// process tweets
			for (var i in tweets) {
				// time ago string
				var minutes = parseInt(tweets[i].created_at.replace("'", ""));
				if (minutes < 1)
					tweets[i].ago = i18n.just_now;
				else if (minutes < 60)
					tweets[i].ago = minutes + ' ' + i18n.minutes;
				else if (minutes < 1440)
					tweets[i].ago = Math.floor( minutes / 60 ) + ' ' + i18n.hours;
				else if (minutes < 10080)
					tweets[i].ago = Math.floor( minutes / 1440 ) + ' ' + i18n.days;
				else
					tweets[i].ago = i18n.long_time;
				
				// #tags
				tweets[i].text = tweets[i].text.replace(/(#[^\s]+)/g, '<span class="text-color">$1</span>');
				// @replies
				tweets[i].text = tweets[i].text.replace(/(@[^\s]+)/g, '<span class="text-color">$1</span>');
				// links                                  [   https://www.   |www.| domain.| ... ]
				tweets[i].text = tweets[i].text.replace(/((https?:\/\/(\w\.)*|\w\.)[^\s]+\.[^\s]+)/g, '<span class="text-color">$1</span>');
			}
			
			return tweets;
		}
	});

	var view = Backbone.View.extend({
		initialize : function() {
			// prevents loss of 'this' inside methods
			_.bindAll(this, "render");

			// bind render to collection reset
			this.collection.bind("reset", this.render);
			
			// pre-fetch template file and render when ready
			var self = this;
			if(this.template == null) {
				$.get("turtles/twitter/list.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},
		render : function() {
			// only render when template file is loaded
			if(this.template) {
				var data = {
					hashtag : this.options.hashtag,
					entries : this.collection.toJSON(),
					i18n : this.options.i18n
				};
				
				// add html to container
				this.$el.html($.tmpl(this.template, data));
				
				// notify listeners render completed and pass element
				this.trigger("rendered", this.$el);
			}
		}
	});

	// register turtle
	Turtles.register("twitter", {
		collection : collection,
		view : view
	});

})(jQuery);
