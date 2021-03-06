//
// Name : MEditor (微信自定义菜单编辑器)
// Author : Jeremaihloo (卢杰杰)
// Home : lujiejie.com
//

function MEditor(){
	var config = {
		"remote_view_url":"/core/op-view-menu.php",
		"remote_delete_url":"/core/op-delete-menu.php",
		"remote_create_url":"/core/op-create-menu.php"
	};
	var container;
	var work_url = "/wp-content/plugins/kaensoft-weixin-adavnced/";
	this.render = function (container_id) {
		container = container_id;
		$.get(work_url  + "/meditor/ui.html" , function (data) {
			console.log("ui" + data);
			$("#" + container).append(data);
			init_ready();
		});
				
	}
	var server_cache;
	this.loadDefault = function () {
		loadDefault();
	}
	this.loadLocal = function(){
		loadLocal();
	}
	this.loadEmpty = function(){
		loadEmpty();
	}
	this.loadMenu = function(menu){
		loadMenu(menu);
	}
	this.setConfig = function(setConfig){
		config = setConfig;
	}
	this.setWorkUrl = function (workUrl) {
		work_url = workUrl;
	}
	this.deleteRemote = function () {
		deleteRemote();
	}
	this.createRemote = function () {
		createRemote();
	}
	this.setServerCache = function(_server_cache){
		server_cache = _server_cache;
		console.log('set server_cache : '+ JSON.stringify(server_cache));
	}
	function deleteRemote () {
		if(confirm("此操作不可恢复！确认删除？")){
			var url = work_url + config.remote_delete_url;
			console.log("delete remote url :"+url);
			$.get(url,function (data) {
				alert(data);
			});
			loadEmpty();	
		}
	}
	function createRemote () {
		$.post(work_url + config.remote_create_url,{ buttons : menu_current }, function (data) {
			console.log("create remote [data]:"+data);
			alert(data);
		});
	}
	var menu_default = {
                                "button": [
                                    {
                                        "type": "view", 
                                        "name": "长得帅", 
                                        "url": "http://lujiejie.com"
                                    }, 
                                    {
                                        "name": "菜单", 
                                        "sub_button": [
                                            {
                                                "type": "view", 
                                                "name": "百度", 
                                                "url": "http://www.soso.com/"
                                            }, 
                                            {
                                                "type": "view", 
                                                "name": "腾讯视频", 
                                                "url": "http://v.qq.com/"
                                            }, 
                                            {
                                                "type": "view", 
                                                "name": "腾讯网", 
                                                "url": "http://www.qq.com/"
                                            }
                                        ]
                                    }
                                ]
                            };

	
	var selected_top_item;
	var selected_sub_item;
	
    var menu_current;

    function init_ready () {
    	loadEmpty();
		loadLocal();
		checkItemIsTopForRightVisiable();
		
		//control panel buttons
		$("#btnLoadRemote").click(function () {
   			var url = work_url + config.remote_view_url;
   			console.log("remote url "+url);
   			loadRemote(url);
   		});
   		$("#btnLoadLocal").click(function(){
   			loadLocal();
   		});
   		$("#btnClearLocal").click(function(){
   			clearLocal();
   		});
   		$("#btnLoadEmpty").click(function () {
   			loadEmpty();
   		});
   		$("#btnLoadDefault").click(function () {
   			loadDefault();
   		});
   		$("#btnDeleteRemote").click(function () {
   			deleteRemote();
   		});
   		$("#btnServerCache").click(function () {
   			loadServerCache();
   		});
		//----------------------------------------
		$(".btnDeleteTopItem").click(function (){
			deleteTopItem();
		});
		$(".btnAddTopItem").click(function (){
			addTopItem();
		});
		$(".btnAddSubItem").click(function () {
			addSubItem();
		})
		$(".btnDeleteSubItem").click(function () {
			deleteSubItem();
		})
		
		$("#save").click(function (){
			save();
		});
		$("#saveAndCreate").click(function () {
			saveLocal();
			createRemote();
		});
		$('#itemTopEdit').on('show.bs.modal', function () {
			if(getTopSeletedItemIndex()>-1){
				var button = menu_current.button[getTopSeletedItemIndex()];
				$("#top_menu_name").val(button.name);
				if(button.hasOwnProperty("type")){
					$("#top_menu_action").val(button.type);				
				}
				else{
					$("#top_menu_action").val("sub_button");
				}
				if(button.hasOwnProperty("url")){
					$("#top_menu_content").val(button.url);				
				}
				if(button.hasOwnProperty("key")){
					$('#top_menu_content').val(button.key);
				}
			}
			
		});
		$('#itemSubEdit').on('show.bs.modal', function () {
			if(getSubSeletedItemIndex()>-1){
				var sub_button = menu_current.button[getTopSeletedItemIndex()].sub_button[getSubSeletedItemIndex()];
				$("#sub_menu_name").val(sub_button.name);
				if(sub_button.hasOwnProperty("type")){
					$("#sub_menu_action").val(sub_button.type);
				}
				else{
					$("#sub_menu_action").val(sub_button.type);
				}
				if(sub_button.hasOwnProperty("url")){
					$("#sub_menu_content").val(sub_button.url);
				}	
				if(sub_button.hasOwnProperty("key")){
					$("#sub_menu_content").val(sub_button.key);
				}
			}
			
		});
		$("#modalSaveTopMenuItem").click(function () {
			saveTopMenuItem();
		});
		$("#modalSaveSubMenuItem").click(function () {
			saveSubMenuItem();
		});
    }
	function loadServerCache () {
		loadMenu(server_cache);
	}
	function checkItemIsTopForRightVisiable(){
		if(selected_top_item==null){
			console.log("selected_top_item is null");
			$(".sub_level_view").hide();
		}else{
			if(!hasSubMenu(menu_current.button[getTopSeletedItemIndex()])){
				$(".sub_level_view").hide();
				console.log("当前一级菜单没有子菜单！")
			}else{
				$(".sub_level_view").show();
				console.log("当前一级菜单有子菜单！")
			}
		}
	}
	
	function getTopSeletedItemIndex() {
		return getTopItemIndex(selected_top_item);
	}
	
	function getTopItemIndex(item) {
		var item_index = -1;
		$(".top_level_item").each(function(index) {
			if($(item).text()==$(this).text()){
				item_index = index;
				return false;
			}
		});
		return item_index;
	}
	
	function getSubSeletedItemIndex() {
		return getSubItemIndex(selected_sub_item);
	}
	
	function getSubItemIndex(item) {
		var item_index = -1;
		$(".sub_level_item").each(function(index) {
			if($(item).text()==$(this).text()){
				item_index = index;
				return false;
			}
		});
		return item_index;
	}
	
	function hasSubMenu(_button) {
		if(_button.hasOwnProperty("sub_button")){
			return true;
		}else{
			return false;			
		}
	}
	
	function saveTopMenuItem() {
		menu_current.button[getTopSeletedItemIndex()] = new Object();
		var current = menu_current.button[getTopSeletedItemIndex()];
		current.name = $("#top_menu_name").val();
		if($("#top_menu_action").val() == "sub_button"){
			current.sub_button = [];
		}
		else{
			current.type = $("#top_menu_action").val();
			current.url = $("#top_menu_content").val();
		}
		
		$("#itemTopEdit").modal("hide");
		
		console.log("save top menu item :");
		console.log(JSON.stringify(menu_current));
		checkItemIsTopForRightVisiable();
		saveLocal();
		loadMenu(menu_current);
	}
	
	function saveSubMenuItem() {
		menu_current.button[getTopSeletedItemIndex()].sub_button[getSubSeletedItemIndex()] = new Object();
		var current = menu_current.button[getTopSeletedItemIndex()].sub_button[getSubSeletedItemIndex()];
		current.name = $("#sub_menu_name").val();
		current.type = $("#sub_menu_action").val();
		if(current.type == "click"){
			current.key = $("#sub_menu_content").val();
		}
		else{
			current.url = $("#sub_menu_content").val();
		}
		$("#itemSubEdit").modal("hide");
		
		console.log("save sub menu item :");
		console.log(JSON.stringify(menu_current));
		
		saveLocal();
	}
	
	function saveLocal(){
		localStorage.WX_MENU = JSON.stringify(menu_current);	
		console.log("save local successed !");
	}
	
	function save(){
		console.log(JSON.stringify(menu_current));
		saveLocal();
		alert("保存成功！");
	}

	function loadEmpty(){
		menu_current = {
			"button":[]
		};
		console.log("load empty menu_current :"+JSON.stringify(menu_current));
		emptyTopItemHtml();
		emptySubItemHtml();
	}
	
	function loadLocal () {
		if(window.localStorage){
			if(localStorage.WX_MENU){
				console.log("local menu :")
				console.log(localStorage.WX_MENU);
				var menu = JSON.parse(localStorage.WX_MENU);
				loadMenu(menu);
			}
			else{
				console.log("do not exist local menu");
			}
		}
		else{
			console.log("browser don't support localStorage");
		}
	}
	
	function clearLocal() {
		localStorage.removeItem("WX_MENU");
		loadEmpty();
	}
	
	function loadRemote(url){
		console.log("load remote url : "+url);
		if(url!=null){
			$.get(url,function(data){
				if(data!=null){
					console.log('load data:'+data);
					loadMenu(eval(data).menu);
				}
				else{
					console.log("data is null !");
				}
			});	
			console.log("get finished !")
		}else{
			console.log("url is null !");
		}
	}
	
	function emptySelectedTopItemData () {
		if(menu_current.button.length>0){
				menu_current.button.splice(getTopSeletedItemIndex(),1);				
		}
	}
	
	function emptySelectedSubItemData () {
		if(menu_current.hasOwnProperty("button")){
				if(menu_current.button.length>0){
					var current_button = menu_current.button[getTopSeletedItemIndex()]; 
					if(current_button.hasOwnProperty("sub_button")){
						if(menu_current.button[getTopSeletedItemIndex()].sub_button.length>0){
							menu_current.button[getTopSeletedItemIndex()].sub_button.splice(getSubSeletedItemIndex(),1);
						}
					}		
				}
			}
	}
	
	function emptySubItemHtml(){
		$(".sub_level_item").each(function(index){
			$(this).remove();
		});
	}
	
	function loadDefault(){
		console.log("load default...");
		loadMenu(menu_default);
	}

	function loadMenu(menu){
		if(menu_current!=null){
			loadEmpty();
		}
		
		console.log("load menu :" + JSON.stringify(menu));
		menu_current = menu;
		emptyTopItemHtml();
		emptySubItemHtml();
		for(var i=0; i<menu.button.length; i++){
			var addItem = $("<li class=\"list-group-item top_level_item\"></li>").appendTo($(".top_level_box .list-group"));
			$(addItem).text(menu.button[i].name);
			$(addItem).attr("id","top_level_item_id_" + i);
			resgister();
		}
	}

	function addTopItem(){
		if($(".top_level_item").length>=3){
			alert("一级菜单不能超过三个！");
		}else{
			var addItem = $("<li class=\"list-group-item top_level_item\"></li>").appendTo($(".top_level_box .list-group"));
			$(addItem).text("一级菜单");
			$(addItem).attr("id","top_level_item_id_" + ($(".top_level_item").length-1));
			var button = new Object();
			button.name = "一级菜单";
			menu_current.button.push(button);
			registerTopItem(addItem);
			checkItemIsTopForRightVisiable();
		}
	}

	function addSubItem(){
		if($(".sub_level_item").length>=5){
			alert("二级菜单不能超过五个！");
		}else{
			if(hasSubMenu(menu_current.button[getTopSeletedItemIndex()])){
				var addItem = $("<li class=\"list-group-item sub_level_item\"></li>").appendTo($(".sub_level_view .list-group"));
				$(addItem).text("二级菜单");
				var sub_button = new Object();
				sub_button.name = "二级菜单";
				menu_current.button[getTopSeletedItemIndex()].sub_button.push(sub_button);
				registerSubItem(addItem);	
			}
			else{
				alert("当前一级菜单不能添加子菜单！");
			}
		}
	}
	
	function deleteTopItem(){
		emptySelectedTopItemData();
		$(selected_top_item).remove();
		selected_top_item = null;
		saveLocal();
	}

	function deleteSubItem(){
		emptySelectedSubItemData();
		$(selected_sub_item).remove();
		selected_sub_item = null;
		saveLocal();
	}

	function registerTopItem(item){
		$(item).unbind("click");
		$(item).click(function (){
			$(".top_level_box .top_level_item").each(function(index){
				$(this).css("background-color","white");
			});
			$(this).css("background-color","yellow");
			selected_top_item = $(this);
			emptySubItemHtml();
			var index = parseInt($(this).attr("id").replace("top_level_item_id_",""));

			$(".sub_level_manager").find("font").text(menu_current.button[index].name);

			if(!hasSubMenu(menu_current.button[index])){
				
			}
			else{
				if(menu_current.button[index].hasOwnProperty("sub_button")){
						for(var i =0;i<menu_current.button[index].sub_button.length;i++){
						var addItem = $("<li class=\"list-group-item sub_level_item\"></li>").appendTo($(".sub_level_view .list-group"));
						$(addItem).text(menu_current.button[index].sub_button[i].name);
						registerSubItem(addItem);
					}	
				}
			}
			checkItemIsTopForRightVisiable();
		});
	}
	
	function registerSubItem(item){
		$(item).unbind("click");
		$(item).click(function (){
			$(".sub_level_view .sub_level_item").each(function(index){
				$(this).css("background-color","white");
			});
			$(this).css("background-color","yellow");
			selected_sub_item = $(this);
		});
	}
	
	function resgister(){
		$(".top_level_box .top_level_item").click(function (){
				registerTopItem($(this));
				
		});

		$(".sub_level_view .sub_level_item").click(function (){
			registerSubItem($(this));
		});
	}
	
	function emptyTopItemHtml () {
		console.log("empty top item html")
		console.log("top_level_item length :"+$(".top_level_box").length);
		$(".top_level_item").each(function(index){
			console.log($(this).text());
			$(this).remove();
		});
	}
	
}
