function uploadAndClassifyImage() {

	var fileInput = document.getElementById('resnet34FileUpload').files;
	if (!fileInput.length) {
		return alert('Please choose a file to upload first')
	}
	
	var file = fileInput[0]
	var filename = file.name;
	var formData = new FormData()
	formdata.append(filename, file)
	console.log(filename)
	
	$.ajax({
		async: true,
		crossDomain: true,
		method: 'POST',
		url: https://ap-south-1.console.aws.amazon.com/apigateway/home?region=ap-south-1#/apis/kkuaq40otk/resources/qayddlgr1h,
		data: formData,
		processData: false,
		contentType: false,
		mimeType: "multipart/form-data"
	})
	.done(function (response){
		console.log(response);
		document.getElementById('result').textContent = response;
	})
	.fail(function(){
		alert("There was an error while sending prediction request to resnet34 model.");
	});
};

$('#btnResnetUpload').click(uploadAndClassifyImage);
	
