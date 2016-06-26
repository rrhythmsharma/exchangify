//To upload the image and show it in the preview div
$(function(){
	$('#file').change(function(){
		var reader = new FileReader();

		reader.onload = function(image){
			$('.imageUploadedOrNot').show(0);
			$('#blankImg').attr('src', image.target.result);
		}

		reader.readAsDataURL(this.files[0]);
	});

	//To hide the image previously loaded
	$('#launchDlgBtn').click(function(){
		$('.imageUploadedOrNot').hide();
	});

});