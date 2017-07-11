/*!
 *
 * Copyright 2017, Adstor Lin, adstorly@163.com
 * 
 * 请尊重原创，保留头部版权
 * 在保留版权的前提下可应用于个人或商业用途
 * 
 * Date: 2017/06/17
 * 
 */

var is_add = true; //判断弹出层是添加状态还是编辑状态
var is_index = -1; //编辑状态下是哪一条数据索引值，-1为无编辑状态
var all_group = ['华东区','华北区','华中区','华南区','东北区','西北区','西南区','港澳台区'];
var all_province = [
	['上海市','江苏省','浙江省','安徽省','江西省'],
	['北京市','天津市','山西省','山东省','河北省','内蒙古自治区'],
	['湖南省','湖北省','河南省'],
	['广东省','广西省','福建省','海南省'],
	['辽宁省','吉林省','黑龙省'],
	['陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区'],
	['重庆市','云南省','贵州省','四川省','西藏自治区'],
	['香港特别行政区','澳门特别行政区','台湾省']
]

 function close_groupBox(){
 	$("#chose_group").css("display","none");
 	$(".groupbtn_notice").css("display","none");
 	is_add = true;
 	is_index = -1;
 }

/*
	生成区域弹出框
 */
function optionGroup(){
	$(".provinceBox_list").html("");
	var _itemTop;
	var _itemlist;
	for (var i = 0; i < all_group.length; i++) {
		_itemlist = "";
		if(all_province[i]){
	 		for (var j = 0; j < all_province[i].length; j++) {
	 			_itemlist += '<li><label><input name="f_address" type="checkbox" value="'+all_province[i][j]+'" onclick="groupSelected(this,2,'+i+');"><span>'+all_province[i][j]+'</span></label></li>';
	 		}
		 	_itemTop = '<div class="itembody_top"><label><input name="f_address" type="checkbox" value="'+all_group[i]+'" onclick="groupSelected(this,1,'+i+');"><span>'+all_group[i]+'</span></label></div>';

			$(".provinceBox_list").append('<div class="provinceBox_item">'+_itemTop +'<ul>'+_itemlist+'</ul><div class="pitem_clear"></div></div>');
	 	}
	}
	datamatch();//加载完毕进行数据匹配
}

/*
	数据匹配
 */
function datamatch(){
	disable_box = [];
	var groupBox = [];//存储现有已勾选的大区域
	var temp = [];//临时数组用作不可选匹配
	var temp_edit = []; //临时数组用作编辑匹配
	var len = $(".addgroupBox").find("[name='group_name']").length;
	var groupname;
	if(len > 0){
		for(var i = 0; i < len; i++){
			groupname = $(".addgroupBox").find("[name='group_name']").eq(i).val().split("、");
			if(i != is_index){
				for(var ii = 0; ii < groupname.length;ii++){
					temp[groupname[ii]] = true ;
				}
			}else{
				for(var ii = 0; ii < groupname.length;ii++){
					temp_edit[groupname[ii]] = true ;
				}
			}
		}
		var len2 = $(".provinceBox_list").find("[name='f_address']").length;
		var f_address = $(".provinceBox_list").find("[name='f_address']");
		for (var i = 0; i < len2; i++) {
			var _val = f_address.eq(i).val();
			if (!temp[_val]) { 
				if (!temp_edit[_val]) { 
					f_address.eq(i).prop("checked",false);
				}else{
					f_address.eq(i).prop("checked",true);
				}
			}else{
				f_address.eq(i).prop("disabled",true);
				f_address.eq(i).parents("label").css("color","#999");
			}
		}
	}
	//遍历一遍数据 确保当当前区域省份全部勾选后，该区域也将不显示
	$(".provinceBox_item").each(function(index){
		var all_li = $(this).find("li").find("[name='f_address']");
		var li_num = 0;
		var check_num = 0;
		for(var i = 0; i < all_li.length; i++){
			if(all_li.eq(i).is(":disabled")){
				li_num++;
			}
			if(all_li.eq(i).is(":checked")){
				check_num++;
			}
		}
		if(li_num == all_li.length){
			$(".itembody_top").eq(index).find("[name='f_address']").prop("disabled",true);
		}else if(check_num == all_li.length){
			$(".itembody_top").eq(index).find("[name='f_address']").prop("checked",true);
		}
	})
	$("#chose_group").css("display","block");
}
/*
	勾选
*/
function groupSelected(obj,status,index){
	// status:1 全选  status:2 单个复选
	var itemlist = $(obj).parents(".provinceBox_item");
	var itemlist_li = itemlist.find("li").siblings().find("[name='f_address']")
	if(status == 1 ){
		if($(obj).is(":checked")){
			console.log(itemlist_li.length)
			for(var i=0;i<itemlist_li.length;i++){
				if(!itemlist_li.eq(i).is(":disabled")){
					itemlist_li.eq(i).prop("checked",true);
				}
			}
		}else{
			itemlist_li.prop("checked",false);
		}
	}else{
		if($(obj).is(":checked")){
			$(obj).prop("checked",true);
			var _len = $(obj).parents("ul").find("li").length;

			var check_num = 0;
			for(var i = 0; i < _len; i++){
				var cur_group= $(obj).parents("ul").find("li").eq(i).find("[name='f_address']")
				 if(cur_group.is(":checked") ){
				 	check_num++;
				 }
			}
			if(check_num == _len && !itemlist.find(".itembody_top").find("[name='f_address']").is(":disabled")){
				itemlist.find(".itembody_top").find("[name='f_address']").prop("checked",true);
			}
		}else{
			$(obj).prop("checked",false);
			itemlist.find(".itembody_top").find("[name='f_address']").prop("checked",false);
		}
	}
}


/*
	确认添加数据 或者 编辑数据
*/

 function submit_groupBox(){
 	var p_text = '';
 	var group_name ='';
 	var num = 0;
 	var g_num =0;
 	$(".provinceBox_list").find("li").each(function(i){
 		var obj = $(this).find("[name='f_address']")
 		if(obj.is(":checked")){
 			if(num == 0){
 				p_text = obj.val();
 			}else{
 				p_text += "、"+obj.val();
 			}
 			num++;
 		}
 	})
 	$(".provinceBox_list").find("[name='f_address']").each(function(i){
 		if($(this).is(":checked")){
 			if(g_num == 0){
 				group_name = $(this).val();
 			}else{
 				group_name += "、"+$(this).val();
 			}
 			g_num++;
 		}
 	})
 	if(p_text == null || p_text == ''){
 		$(".groupbtn_notice").css("display","inline-block");
 		return false;
 	}
 	var li = '<td class="textLeft"><input type="hidden" name="group_name" value="'+group_name+'">';
 	li += '<span class="provinceText">'+p_text+'</span>';
 	li += '<a href="javascript:;" class="edit_info" onclick="editGroup(this)">编辑</a></td>'
 	li += '<td><input type="number" name="first_price" value="0.00"></td>';
 	li += '<td><input type="number" name="next_price" value="0.00"></td>';
 	li += '<td><a href="javascript:;" onclick="deleteGroup(this)">删除</a></td>';

 	if(is_add){
 		$(".addgroupBox tbody").append("<tr>"+li+"</tr>");
 	}else{
 		$(".addgroupBox tbody").find("tr").eq(is_index).html(li);
 	}
 	is_add = true;
 	is_index = -1;
 	$("#chose_group").css("display","none");
 	$(".groupbtn_notice").css("display","none");
 }

