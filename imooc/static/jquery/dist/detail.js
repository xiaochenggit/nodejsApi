$(function(){
	$("body").click(function(){
		console.log("body");
	})
	$(".comment").click(function(e){
		$("div:odd").addClass("odd");
		var $this = $(this);
		var toId = $this.attr("data-tid");
		var commentId = $this.attr("data-cid");
		console.log("tid : " + toId + " | " + "cid : " + commentId);
		// 插入隐藏表单
		if ( $("#commentTid").length > 0 ) {
			$("#commentTid").val(toId);
			$("#commentId").val(commentId);
		}else{
			$("<input>").attr({
				type : "hidden",
				name : "comment[tid]",
				id : "commentTid",
				value : toId
			}).appendTo($("#commentForm"));
			$("<input>").attr({
				type : "hidden",
				name : "comment[cid]",
				id : "commentId",
				value : commentId
			}).appendTo($("#commentForm"));
		}
	})
})