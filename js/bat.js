$(function()
	{ $("#get-battery").click(function()
		{ $("#battery-pct").text(Math.round(navigator.battery.level * 100) + "%"); }); });

var battery = navigator.battery;

 battery.ondischargingtimechange = function () {
      document.querySelector('#dischargingTime').textContent = battery.dischargingTime / 60;
    };