$(".content-container-toggle-btn").click(function () {
  $(this).parents(".content-container").children(".content-container-body-wrapper").slideToggle();
  $(this).parents(".content-container").toggleClass("content-container-closed");
});