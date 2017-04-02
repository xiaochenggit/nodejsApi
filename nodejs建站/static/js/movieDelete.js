$(function (){
	console.log('movieDelete 文件载入');
	// movie删除
	$('#delete').click(function (){
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
		}
		if (!$err) {
			return false;
		}
	})
})