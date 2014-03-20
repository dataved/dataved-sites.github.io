function SelectRowInTable(selectedRow) {
	var id = selectedRow.id.substr(3);
	if (selectedRow.className == "active") {
		selectedRow.className = "";
		$("#ft_chart_" + id).hide();
		return false;
	}
	var tables = selectedRow.parentNode.parentNode.parentNode.getElementsByTagName("table");
	for(var t = 0; t < tables.length; t++) {
		var rows = tables[t].getElementsByTagName("tr")
		for(var i = 0; i < rows.length; i++) {
			if (rows[i].id.substr(0, 9) == "ft_chart_") { rows[i].className = "hidden"; $("#" + rows[i].id).hide(); } else { rows[i].className = ""; }
		}
	}
//	alert("/inc/idx_table_chart.asp?id=" + id);
	selectedRow.className = "active";
	$("#ft_chart_" + id).find("td").load("/inc/idx_table_chart.asp?id=" + id, function(resp) {
		$("#ft_chart_" + id).show();
	});	
}

var g_OpenedMenuId = 0;
function MenuDropDown(menuId, event) {
	event = event || window.event;
	if (event.stopPropagation) { event.stopPropagation(); } else { event.returnValue = false; event.cancelBubble = true; }
	if (menuId == g_OpenedMenuId) {
		g_OpenedMenuId = 0;
		$("#menu_content").slideUp(200);
		return false;
	}
	if ((menuId != 0) && (g_OpenedMenuId != menuId)) {
		$("#menu_content").slideUp(200, function() { LoadAndShowMenu(menuId); });
		
	}
	return false;
}
function LoadAndShowMenu(menuId) {
	var menus = new Array("", "", "/inc/other/s_mval.asp", "/inc/other/s_mfnd.asp", "/inc/other/s_mobv.asp", "/inc/other/s_mwmr.asp", "/inc/other/s_mprod.asp", "/inc/other/s_mabt.asp");
	var top = $("#menu_" + menuId).offset().top;
	var left = $("#menu_" + menuId).offset().left;
	var maxLeft = $(".content").offset().left + $(".content").width();
	if (left + $("#menu_content").width() > maxLeft) left = maxLeft - $("#menu_content").width() - 20;
	$("#menu_content").load("http://www.finmarket.ru" + menus[menuId]);
	$("#menu_content").css("top", top + 20);
	$("#menu_content").css("left", left);
	$("#menu_content").slideDown(400);
	g_OpenedMenuId = menuId;
	for(var i = 0; i < menus.length; i++) {
		var o = document.getElementById("menu_" + i + "_arrow");
		if (o) {
			if (i != menuId) {
				o.src = "/img/mn_st1.gif";
			} else {
				o.src = "/img/mn_st22.gif";
			}
		}
	}
}

function show_comments(div) {
	var cDiv = document.getElementById("div_comm");
	switch (div) {
		case "div_comm":
			cDiv.className="item_active";
			cDiv.firstChild.removeAttribute("href");
			$("#div_form").slideUp(400);
			$("#div_descl").slideDown(400);
			break;
		case "div_add":
			cDiv.className = "item";
			cDiv.firstChild.setAttribute("href", "#");
			$("#div_form").slideDown(400);
			$("#div_descl").slideUp(400);
			break;
	}
	
}
function goto_comments() {
	var cDiv = document.getElementById("div_comm");
	cDiv.className = "item";
	cDiv.firstChild.setAttribute("href", "#");
	$("#div_form").slideDown(400);
	$("#div_descl").slideUp(400);
	document.getElementById("addcmn").scrollIntoView(true);
}

function SendForm(url, formname) {
	var req = getXmlHttp();
	var fio, email, phone, comapny, body
	var len, val, name, query, requir, status
	var oForm = document.forms[formname];
	len = oForm.elements.length;  
	status = document.getElementById("status");
	digit = document.getElementById("digit_img");
	query = ""
	for (var i=0; i<len; i++) {
		name = encodeURIComponent(oForm.elements[i].name);
		val = encodeURIComponent(oForm.elements[i].value);
		requir = oForm.elements[i].required;
		if (requir && val != "") {
			oForm.elements[i].style.border = "1px solid #ABADB3";
		}
		if (requir && val == "") {
			oForm.elements[i].style.border = "2px dashed red";
			alert("Заполните, пожалуйста, необходимые поля!");
			oForm.elements[i].focus();
			return;
		}
		query = query + "&" + name + "=" + val;
	}
	query = "act=save" + query;
	req.onreadystatechange = function() {  
		if (req.readyState == 4) { 
			if (req.status == 200) {
				tmp = req.responseText;
				if (tmp == "ok") {
					status.innerHTML = "Ваше сообщение отправлено!";
					status.style.color = "green";
					status.style.display = "block";
					if (oForm.body) {
						oForm.body.value = "";
					}
					oForm.defdigit.value = "";
				} else {
					status.innerHTML = tmp;
					status.style.color = "red";
					status.style.display = "block";
					oForm.defdigit.value = "";
				}
				tmp = digit.src;
				var tmp = tmp.split("&")[0]
				digit.src = tmp +"&a="+Math.floor((Math.random()*1000)+1);
			}
		}
	}
	req.open('POST', url, true); 
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send(query);
}

function getXmlHttp(){
	var xmlhttp;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

// кнопки переключения графиков
var SourceId, FinToolId, PeriodId, btnPrev, ChartImageUrl;
	btnPrev = "";
	ChartImageUrl = "";
	PeriodId = "";
	
function btnPeriod(btnId) {
	var o;
	for (var i = 0; i < 4; i++) {
		o = document.getElementById("btnPeriod_0" + i);
		o.className = "item";
	}
	document.getElementById("btnPeriod_0" + btnId).className = "item_active";
	PeriodId = btnId;
	ReloadImage();
	return false;
}
function btnFinTool(btnSourceId, btnFinToolId, btnId) {
	var o;
	SourceId = btnSourceId;
	FinToolId = btnFinToolId;
	if (btnPrev != "") {
		o = document.getElementById(btnPrev);
		if (o) o.className = "fintool_button";
	}
	btnPrev = btnId;
	o = document.getElementById(btnId);
	if (o) o.className = "fintool_button pressed";
	ReloadImage();
	return false;
}
function ReloadImage() {
	// use external ChartImageUrl variable
	var s = ChartImageUrl.replace("{SourceId}", SourceId);
	s = s.replace("{FinToolId}", FinToolId);
	s = s.replace("{PeriodId}", PeriodId);
	document.getElementById("chart").src = s;
	return false;
	//alert(document.getElementById("chart").src);
}
// -- кнопки переключения

/* крутилка в шапке сайта */
var g_HeadSpinner_curId = 0;
var g_HeadSpinner_WaitTimeout = 7000;
function StartSpinner() {
	$(".head_spinner_block").css("display", "block");
	$("#head_spin_cur").html("");
	SetSpinnerContent("#head_spin_next");
	SpinnerAction();
}
function SpinnerAction() {
	$("#head_spin_cur").animate({ "top": "-=32px" }, 500, function() {
		this.id = "head_spin_remove_current";
		$("#head_spin_remove_current").remove();
	});
	$("#head_spin_next").animate({ "top": "-=32px" }, 500, function() {
		$(this).css("top", "0px");
		this.id = "head_spin_cur";
		$("#head_spin_cur").after("<div id=\"head_spin_next\"></div>")
		g_HeadSpinner_curId += 1;
		if (g_HeadSpinner_curId >= Titles.length) g_HeadSpinner_curId = 0;
		SetSpinnerContent("#head_spin_next");
		setTimeout("SpinnerAction()", g_HeadSpinner_WaitTimeout);
	});
}
function SetSpinnerContent(spinId) {
	var s = "<a href=\"" + Hrefs[g_HeadSpinner_curId] + "\">" + Titles[g_HeadSpinner_curId].replace(" ", "&nbsp;") + "</a>";
	$(spinId).html(s);
}
/* eof: крутилка в шапке сайта */