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
		$("#faceswapimg").attr('src', `data:image/png;base64,${JSON.parse(response)["face-swap"]}`);
		// document.getElementById('filePreview').innerHTML = ['<img src="', response["face-aligned"]," width="150" />'].join('');
	})
	.fail(function(){
		alert("There was an error while sending prediction request to Face Recognition model.");
	});
};

function uploadAndAlignFace() {

	var fileInput = document.getElementById('facealignmentFileUpload').files;
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
		 document.getElementById('facerecognitionresult').textContent = response;
		//$("#facealign").attr('src', `data:image/png;base64,${JSON.parse(response)["face-aligned"]}`);
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

function handleFileSelectFaceRecognition(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreviewFaceRecognition').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}

//update the working api here??
function uploadAndDoPoseEstimation() {

	var fileInput = document.getElementById('poseEstimationFileUpload').files;
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
		url: 'https://udt4qmcb52.execute-api.ap-south-1.amazonaws.com/dev/hpe',
		data: formData,
		processData: false,
		contentType: false,
		mimeType: "multipart/form-data"
	})
	.done(function (response){
		console.log(response);
		document.getElementById('poseestimationresult').textContent = response;
	})
	.fail(function(){
		alert("There was an error while sending prediction request to Pose Estimation model.");
	});
};


function handleFileSelectFaceAlignment(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreviewFaceAlignment').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}

function handleFileSelectMobilenet(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreviewMobilenet').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}
function handleFileSelectResnet(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreviewResnet').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}


function handleFileSelectFaceSwap_1(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreviewFaceSwap_1').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}

function handleFileSelectFaceSwap_2(evt) {
	var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreviewFaceSwap_2').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}
	

function handleFileSelectPoseEstimation(evt){
var files = evt.target.files;
	var f = files[0];
	var reader = new FileReader();
	 
	  reader.onload = (function(theFile) {
			return function(e) {
			  document.getElementById('filePreviewPoseEstimation').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="150" />'].join('');
			};
	  })(f);
	   
	  reader.readAsDataURL(f);
}

$('#resnet34FileUploadBtn').click(uploadAndClassifyImageUsingResnet);
$('#mobilenetv2FleUploadBtn').click(uploadAndClassifyImageUsingMobilenetv2);
$('#facealignmentFileUploadBtn').click(uploadAndAlignFace);
$('#facerecognitionFileUploadBtn').click(uploadAndRecognizeFace);

$('#faceswapFileUploadBtn').click(uploadAndSwapFace);
$('#poseEstimationFileUploadBtn').click(uploadAndDoPoseEstimation);

document.getElementById("about").style.display = "none";

document.getElementById('facerecognitionFileUpload').addEventListener('change', handleFileSelectFaceRecognition, false);

document.getElementById('facealignmentFileUpload').addEventListener('change', handleFileSelectFaceAlignment, false);
document.getElementById('faceswapDestFileUpload').addEventListener('change', handleFileSelectFaceSwap_2, false);
document.getElementById('faceswapSrcFileUpload').addEventListener('change', handleFileSelectFaceSwap_1, false);
document.getElementById('mobilenetv2FileUpload').addEventListener('change', handleFileSelectMobilenet, false);
document.getElementById('resnet34FileUpload').addEventListener('change', handleFileSelectResnet, false);
document.getElementById('poseEstimationFileUpload').addEventListener('change', handleFileSelectPoseEstimation, false);
$(function() {
    $('a.popper').hover(function() {
        $('#pop').toggle();
    });
});

function about(){
document.getElementById("about").style.display = "block";
document.getElementById("facerecognition").style.display = "none";
document.getElementById("classification").style.display = "none";
document.getElementById("poseestimation").style.display = "none";

}
/*
function facerecognition(){
document.getElementById("facerecognition").style.display = "block";
document.getElementById("classification").style.display = "none";
document.getElementById("facealignment").style.display = "block";
document.getElementById("facerecognition").style.display = "block";

document.getElementById("about").style.display = "none";

document.getElementById("poseestimation").style.display = "none";
}
*/

function faceapp(){
document.getElementById("facerecognition").style.display = "none";
document.getElementById("classification").style.display = "none";
document.getElementById("facealignment").style.display = "block";

document.getElementById("faceswap").style.display = "block";
document.getElementById("facerecognition").style.display = "none";

document.getElementById("about").style.display = "none";

document.getElementById("poseestimation").style.display = "none";
}

function facerecognition(){
document.getElementById("classification").style.display = "none";
document.getElementById("about").style.display = "none";
document.getElementById("facerecognition").style.display = "none";
document.getElementById("facealignment").style.display = "none";
document.getElementById("facerecognition").style.display = "block";
document.getElementById("faceswap").style.display = "none";

document.getElementById("poseestimation").style.display = "none";
}


function home(){
document.getElementById("faceapp").style.display = "block";
document.getElementById("about").style.display = "none";
document.getElementById("classification").style.display = "block";
document.getElementById("resnet34").style.display = "block";
document.getElementById("mobilenetV2").style.display = "block";
document.getElementById("facealignment").style.display = "block";
document.getElementById("facerecognition").style.display = "block";
document.getElementById("faceswap").style.display = "block";

document.getElementById("poseestimation").style.display = "block";
}

function facealignment(){
document.getElementById("classification").style.display = "none";
document.getElementById("about").style.display = "none";
document.getElementById("facerecognition").style.display = "none";
document.getElementById("facealignment").style.display = "block";
document.getElementById("facerecognition").style.display = "none";
document.getElementById("faceswap").style.display = "none";

document.getElementById("poseestimation").style.display = "none";
}


function faceswap(){
document.getElementById("classification").style.display = "none";
document.getElementById("about").style.display = "none";
document.getElementById("facerecognition").style.display = "none";
document.getElementById("facealignment").style.display = "none";
document.getElementById("facerecognition").style.display = "none";
document.getElementById("faceswap").style.display = "block";

document.getElementById("poseestimation").style.display = "none";
}



function displayclassification(){
document.getElementById("about").style.display = "none";	
document.getElementById("classification").style.display = "block";
document.getElementById("mobilenetV2").style.display = "block";
document.getElementById("resnet34").style.display = "block";
document.getElementById("facerecognition").style.display = "none";
document.getElementById("poseestimation").style.display = "none";
document.getElementById("facealignment").style.display = "none";
document.getElementById("faceswap").style.display = "none";


}
function resnet(){
displayclassification();
document.getElementById("resnet34").style.display = "block";
document.getElementById("mobilenetV2").style.display = "none";
}

function mobilenet(){
displayclassification();
document.getElementById("resnet34").style.display = "none";
document.getElementById("mobilenetV2").style.display = "block";
}


function poseestimation(){
document.getElementById("classification").style.display = "none";
document.getElementById("about").style.display = "none";
document.getElementById("facerecognition").style.display = "none";
document.getElementById("facealignment").style.display = "none";
document.getElementById("facerecognition").style.display = "none";
document.getElementById("faceswap").style.display = "none";

document.getElementById("poseestimation").style.display = "block";
}

