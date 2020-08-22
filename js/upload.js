function uploadAndRecognizeFace() {

	var fileInput = document.getElementById('facerecognitionFileUpload').files;
	if (!fileInput.length) {
		return alert('Please choose a file to upload first')
	}
	var file = fileInput[0]
	var filename = file.name;
	var formData = new FormData()
	formData.append(filename, file)
	console.log(filename)
	
	$.ajax({
		async: true,
		crossDomain: true,
		method: 'POST',
		url: 'https://wy3jncecdh.execute-api.ap-south-1.amazonaws.com/dev/classify/facerecognition',
		data: formData,
		processData: false,
		contentType: false,
		mimeType: "multipart/form-data"
	})
	.done(function (response){
		console.log(response);
		document.getElementById('facerecognitionresult').textContent = response;
		document.getElementById('filePreview').innerHTML = ['<img src="', response.result,'" title="', theFile.name, '" width="150" />'].join('');
	})
	.fail(function(){
		alert("There was an error while sending prediction request to Face Recognition model.");
	});
};

function uploadAndClassifyImageUsingResnet() {

	var fileInput = document.getElementById('resnet34FileUpload').files;
	if (!fileInput.length) {
		return alert('Please choose a file to upload first')
	}
	
	var file = fileInput[0]
	var filename = file.name;
	var formData = new FormData()
	formData.append(filename, file)
	console.log(filename)
	
	$.ajax({
		async: true,
		crossDomain: true,
		method: 'POST',
		url: 'https://kkuaq40otk.execute-api.ap-south-1.amazonaws.com/dev/classify/resnet',
		data: formData,
		processData: false,
		contentType: false,
		mimeType: "multipart/form-data"
	})
	.done(function (response){
		console.log(response);
		document.getElementById('resnetresult').textContent = response;
	})
	.fail(function(){
		alert("There was an error while sending prediction request to resnet34 model.");
	});
};

	
function uploadAndClassifyImageUsingMobilenetv2() {

	var fileInput = document.getElementById('mobilenetv2FileUpload').files;
	if (!fileInput.length) {
		return alert('Please choose a file to upload first')
	}
	
	var file = fileInput[0]
	var filename = file.name;
	var formData = new FormData()
	formData.append(filename, file)
	console.log(filename)
	
	$.ajax({
		async: true,
		crossDomain: true,
		method: 'POST',
		url: 'https://4r5lpgknic.execute-api.ap-south-1.amazonaws.com/dev/classify/mobilenet',
		data: formData,
		processData: false,
		contentType: false,
		mimeType: "multipart/form-data"
	})
	.done(function (response){
		console.log(response);
		document.getElementById('mobilenetv2result').textContent = response;
	})
	.fail(function(){
		alert("There was an error while sending prediction request to Mobilenetv2 model.");
	});
};
function handleFileSelect(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreview').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}

	
$('#resnet34FileUploadBtn').click(uploadAndClassifyImageUsingResnet);
$('#facerecognitionFileUploadBtn').click(uploadAndRecognizeFace);
$('#mobilenetv2FleUploadBtn').click(uploadAndClassifyImageUsingMobilenetv2);

document.getElementById('facerecognitionFileUpload').addEventListener('change', handleFileSelect, false);

$(function() {
    $('a.popper').hover(function() {
        $('#pop').toggle();
    });
});