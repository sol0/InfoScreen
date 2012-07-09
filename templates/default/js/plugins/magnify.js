var Magnify = {

	turtle : function(id) {
		var element = $(".turtle#" + id);
		var parent = element.parent;

		if (element.length != 0) {
			var parent = element.parent();
			
			$(".group").each(function() {
				if ($(this)[0] == parent[0])
					parent.animate({"width": "100%"});
				else
					$(this).animate({"width": "0%"});
			});
			
			setTimeout(Magnify.reset, 3000);
		}
	},
	
	reset : function() {
		$(".group").each(function() {
			$(this).animate({"width": $(this).attr("data-width") + "%"});
		});
	}

};