function uploadAndSwapFace() {

	var fileInput1 = document.getElementById('faceswapSrcFileUpload').files;
	if (!fileInput1.length) {
		return alert('Please choose source file to upload first')
	}
	var fileInput2 = document.getElementById('faceswapDestFileUpload').files;
	if (!fileInput2.length) {
		return alert('Please choose destination file to upload first')
	}
	var file1 = fileInput1[0]
	var filename1 = file1.name;
	var formData = new FormData()
	formData.append(filename1, file1)
	console.log(filename1)

	var file2 = fileInput2[0]
	var filename2 = file2.name;
	formData.append(filename2, file2)
	console.log(filename2)
	
	$.ajax({
		async: true,
		crossDomain: true,
		method: 'POST',
		url: 'https://nvtei6hvx5.execute-api.ap-south-1.amazonaws.com/dev/face-swap',
		data: formData,
		processData: false,
		contentType: false,
		mimeType: "multipart/form-data"
	})
	.done(function (response){
		// console.log(response);
		// document.getElementById('facerecognitionresult').textContent = response;
		$("#faceswap").attr('src', `data:image/png;base64,${JSON.parse(response)["face-swap"]}`);
		// document.getElementById('filePreview').innerHTML = ['<img src="', response["face-aligned"]," width="150" />'].join('');
	})
	.fail(function(){
		alert("There was an error while sending prediction request to Face Recognition model.");
	});
};

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
		url: 'https://nvtei6hvx5.execute-api.ap-south-1.amazonaws.com/dev/face-align',
		data: formData,
		processData: false,
		contentType: false,
		mimeType: "multipart/form-data"
	})
	.done(function (response){
		console.log(response);
		// document.getElementById('facerecognitionresult').textContent = response;
		$("#facealign").attr('src', `data:image/png;base64,${JSON.parse(response)["face-aligned"]}`);
		// document.getElementById('filePreview').innerHTML = ['<img src="', response["face-aligned"]," width="150" />'].join('');
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

function handleFileSelect3_1(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreview3_1').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}

function handleFileSelect3_2(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreview3_2').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}

function handleFileSelect2(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreview2').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}
function handleFileSelect1(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreview1').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}

	
$('#resnet34FileUploadBtn').click(uploadAndClassifyImageUsingResnet);
$('#mobilenetv2FleUploadBtn').click(uploadAndClassifyImageUsingMobilenetv2);
$('#facerecognitionFileUploadBtn').click(uploadAndRecognizeFace);
$('#faceswapFileUploadBtn').click(uploadAndSwapFace);

document.getElementById('facerecognitionFileUpload').addEventListener('change', handleFileSelect, false);
document.getElementById('faceswapDestFileUpload').addEventListener('change', handleFileSelect3_2, false);
document.getElementById('faceswapSrcFileUpload').addEventListener('change', handleFileSelect3_1, false);
document.getElementById('mobilenetv2FileUpload').addEventListener('change', handleFileSelect2, false);
document.getElementById('resnet34FileUpload').addEventListener('change', handleFileSelect1, false);

$(function() {
    $('a.popper').hover(function() {
        $('#pop').toggle();
    });
});