/**
 * 时间转英文格式
 * @param {Object} date
 */
function dateToEng(date) {
	var dt = new Date(date);
	var m = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec");
	var w = new Array("Monday", "Tuseday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
	var d = new Array("st", "nd", "rd", "th");
	mn = dt.getMonth();
	wn = dt.getDay();
	dn = dt.getDate();
	var dns;
	if(((dn) < 1) || ((dn) > 3)) {
		dns = d[3];
	} else {
		dns = d[(dn) - 1];
		if((dn == 11) || (dn == 12)) {
			dns = d[3];
		}
	}
	return m[mn] + " " + dn + dns + " " + dt.getFullYear();
	//document.write(m[mn]+" "+dn+dns+" " +w[wn-1]+" "+dt.getFullYear());
}

function getProductList(){
	var page=$("#proList").attr("page");
	page=parseInt(page);
	var kindId=$(".active-kind").attr("id");
	var params={};
	params.kindId=kindId;
	params.page=page;
	params.pageSize=15;
	var key=$("#search").val();
	if(key!="" && key!=null){
		params.key=key;
	}
	$.ajax({
		type:"get",
		url:config.path+"/api.do?getProductList",
		async:false,
		data:params,
		success:function(data){
			//console.log(data);
			data=JSON.parse(data);
			if(data.isSuccess){
				var rows=data.data;
				var total=data.total;
				console.log("total:"+total);
				$("#proList").attr("total",total);
				for(var i=0;i<rows.length;i++){
					var str="";
					var productDesc=rows[i].productDesc;
					if(productDesc==null || productDesc.length<1){
						productDesc="上传于" + rows[i].createDate ;
					}
					str+="<li class='mui-table-view-cell mui-media mui-col-xs-6'>";
					str+="<a class='toDetail' proId='"+ rows[i].id +"'>";
					str+="<img class='mui-media-object' style='height:121.3px;' src='"+config.path+"/"+rows[i].imagesUrl+"'>";
					var productName=rows[i].productNamem;
					if(productName==null || productName.length<1){
						productName="暂无描述";
					}
					str+="<div class='mui-media-body'>"+productName+"</div>";
					str+="</a>";
					str+="</li>";
					/*---
					str+="<li class='mui-table-view-cell mui-media' >";
					str+="<a class='mui-navigate-right toDetail' proId='"+ rows[i].id +"' >";
					str+="<img class='mui-media-object mui-pull-left' src='"+config.path+"/"+rows[i].imagesUrl+"'>";
					str+="<div class='mui-media-body'>";
					str+=rows[i].productNamem;
					str+="<p class='mui-ellipsis'>"+productDesc+"</p>";
					str+="</div>";
					str+="</a>";
					str+="</li>";*/
					/* str+="<div  class='mui-card'>";
					str+="<div class='mui-card-header mui-card-media' style='height:40vw;background-image:url("+config.path+"/"+rows[i].imagesUrl+")'></div>";
					str+="<div class='mui-card-content'>";
					str+="<div class='mui-card-content-inner'>";
					//var englishDate=dateToEng(rows[i].createDate); 
					str+="<p>上传于 "+ rows[i].createDate +"</p>";
					str+="<p style='color: #333;'>"+rows[i].productDesc+"</p>";
					str+="</div>";
					str+="</div>";
					str+="<div class='mui-card-footer'>";
					str+="<a  class='mui-card-link'><img src='img/like.png' style='width:20%'></a>";
					str+="<a proId='"+ rows[i].id +"' class='toDetail'><img proId='"+ rows[i].id +"' src='img/toDetail.png' style='width:20%;float:right'></a>";
					str+="</div>";
					str+="</div>"; */
					$("#proList").append(str);
				}
				$(".toDetail").bind("tap",function(e){
					var thisProId=$(e.target).attr("proid");
					var obj=$(e.target);
					while(thisProId==undefined){//遍历 避免用户点击到A标签里面的元素导致获取不到PROID
						obj=obj.parent();
						thisProId=obj.attr("proid");
					}
					console.log(thisProId);
					window.location.href="detail.html?id="+thisProId;
					/*mui.openWindow({
						url:"detail.html"
					});*/
				});
			}else{
				mui.toast(data.msg);
			}
		},
		error:function(data){
			mui.toast("系统繁忙！");
		}
	});
}

function getDetail(id){
	$.ajaxSettings.async=false;
	$.post(config.path+"/api.do?getProductDetail",{id:id},function(data){
		console.log(data);
		if(data!=null){
			data=JSON.parse(data);
			data=data.data;
			console.log(data);
			$("#kind").val(data.kind.productKindName);
			$("#productName").val(data.productName);
			$("#productDesc").val(data.productDesc);
			$("#productParam").val(data.productParam);
			$("#stock").val(data.stock);
			$("#remarks").val(data.remarks);
			$("#price").val(data.price);
		}
	});
	$.ajaxSettings.async=true;
}

function getImgList(id){
	$.ajaxSettings.async=false;
	$.post(config.path+"/api.do?getProductImages",{id:id},function(data){
		console.log(data);
		if(data!=null){
			data=JSON.parse(data);
			data=data.data;
			for(var i=0;i<data.length;i++){
				var str="<p><img src='"+config.path+"/"+data[i].imagesUrl+"' data-preview-src='' data-preview-group='1' /></p>";
				$("#imgList").append(str);
			}
		}
	});
	$.ajaxSettings.async=true;
}


function getQueryString(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null; 
    } 
function getKindList(){
	$.ajaxSettings.async=false;
	$.post(config.path+"/api.do?getProductKind",{},function(data){
		console.log(data);
		if(data!=null){
			data=JSON.parse(data);
			data=data.data;
			for(var i=0;i<data.length;i++){
				$("#kindList").append("<li id='"+data[i].id+"' class='mui-table-view-cell' style='text-align: center;'><a >"+ data[i].productKindName+"</a></li>")
			}
		}else{
			mui.toast("服务器繁忙！");
		}
	});
	$.ajaxSettings.async=true;
}
