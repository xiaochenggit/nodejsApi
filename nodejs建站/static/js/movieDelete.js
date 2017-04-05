$(function (){
	console.log('movieDelete 文件载入');
	// category删除
	$('.deleteCategory').click(function (){
		var $this = $(this);
		var id = $(this).attr('data-id');
		$.ajax({
			type : 'delete',
			url : '/admin/category/detail?id=' + id
		}).done(function (result){
			if (result.success === 1) {
				$this.parents('tr').remove();
			}
		})
	});
	// movie删除
	$('.deleteMovie').click(function (){
		var $this = $(this);
		var id = $(this).attr('data-id');
		$.ajax({
			type : 'delete',
			url : '/admin/movie/detail?id=' + id
		}).done(function (result){
			if (result.success === 1) {
				$this.parents('tr').remove();
			}
		})
	});
	// 用户删除
	$('.userDelete').click(function (){
		console.log('da');
		var $this = $(this);
		var id = $(this).attr('data-id');
		console.log(id);
		$.ajax({
			type : 'delete',
			url : '/admin/user/detail?id=' + id
		}).done(function (result){
			if (result.success === 1) {
				$this.parents('tr').remove();
			}
		})
	});
	// 注册
	$('#signupBtn').click(function () {
		var $form = $("#signupForm");
		var $err = true;
		if(!$('#question').val()){
			alert("请设定问题,以助于修改密码");
			$err = false;
		}
		if ($("#userPassWord").val()!=$("#reUserPassWord").val()) {
			alert('两次密码输入的不同');
			$err = false;
		}
		if (!$("#key").val()) {
			alert("答案不能为空");
			$err = false;
		}
		if (!$err) {
			return false;
		}
	});

	// 评论回复
	$(".reComment").click(function(event) {
		var cid = $(this).attr("data-cid");
		var tid = $(this).attr("data-tid");
		var $comment = $("#commentForm");
		if ($("#commentId").length > 0) {
			$("#commentId").val(cid);
			$("#toId").val(tid);
		} else {
			$('<input>').attr({
				type: 'hidden',
				value: cid,
				id : 'commentId',
				name: 'comment[cid]'
			}).appendTo($comment)
			$('<input>').attr({
				type: 'hidden',
				value: tid,
				id: 'toid',
				name: 'comment[tid]'
			}).appendTo($comment)
		}
	});

	// 申请豆瓣数据
	$("#douban").blur(function () {
		// 26309788
		const URL = 'https://api.douban.com/v2/movie/subject/';
		var id = $(this).val();
		if (id) {
			$.ajax({
				url: URL + id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data) {
					$("#inputName").val(data.title);
					$("#inputAuthor").val(data.directors[0].name);
					$("#inputYear").val(data.year);
					$("#inputCountry").val(data.countries[0]);
					$("#inputLanguage").val('');
					$("#inputPoster").val(data.images.large);
					$("#inpustSwf").val('');
					$("#inputSummary").html(data.summary);
				}
			})
		}
	})
})