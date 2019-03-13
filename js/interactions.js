window.addEventListener('contentChanged', () => {
	$(".content-container-toggle-btn").click( (event) => {
		$(event.currentTarget).parents(".content-container").children(".content-container-body-wrapper").slideToggle();
		$(event.currentTarget).parents(".content-container").toggleClass("content-container-closed");
	})
});

