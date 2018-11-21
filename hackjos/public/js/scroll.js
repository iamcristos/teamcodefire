var navbar = document.querySelector("nav");
var brand = document.querySelector("#brand");
var links = document.querySelectorAll(".nav-link");

	window.addEventListener("scroll", function(){
		if(this.scrollY <= 10){
			navbar.style.background = "";
			brand.style.color = "rgba(255, 255, 255, .5)"
			navbar.classList.add("navbar-dark");
			navbar.classList.remove("navbar-light");
		}
		else{
			navbar.style.background = "white";
			brand.style.color = "rgba(255, 26, 26, .9)"
			navbar.classList.remove("navbar-dark");
			navbar.classList.add("navbar-light");
		}
	});

var navHeight = $("nav").outerHeight();
$(".navigate").click(function(e){
	var linkHref = $(this).attr("href");
	$("html, body").animate({
		scrollTop: $(linkHref).offset().top - navHeight
	}, 1000);
	e.preventDefault();
});