var upload = document.getElementById('upload');
		function allowDrop(e) {
			e.preventDefault();
		}
		function drag(e) {
			e.dataTransfer.setData('text/html', e.target.id);
		}
		function drop(e) {
			e.preventDefault();
			// var data = e.dataTransfer.getData('text/html');
			// e.target.appendChild(document.getElementById(data));
			uploadFile(e.dataTransfer.files);
		}
		function uploadFile(files) {
			console.log(files.length);
			var percent = document.createElement('div');
			percent.id = 'percent';
			upload.appendChild(percent);

			var formData = new FormData();

			formData.append('submit', '测试');
			var fileNames = '';

			for(var i = 0; i < files.length; i++) {
				var file = files[i]
				formData.append('file[' + i + ']', file);
				fileNames += "<" + file.name + ">";
				console.log(file);
				console.log(fileNames);
			}
			formData.enctype = "multipart/form-data";
			console.log(formData.enctype);
				formData.append('file', files[0]);

			var xhr = new XMLHttpRequest();
      			xhr.upload.addEventListener( 'progress',
             function uploadProgress(evt) {
                   // evt 有三个属性：
                   // lengthComputable – 可计算的已上传字节数
                   // total – 总的字节数
                   // loaded – 到目前为止上传的字节数
                   if (evt.lengthComputable) {
                        percent.innerHTML = fileNames + ' upload percent :' + Math.round((evt.loaded / evt.total)  * 100) + '%' ;
                  }
            }, false); // false表示在事件冒泡阶段处理

      xhr.upload.onload = function() {
            percent.innerHTML = fileNames + '上传完成。' ;
      };

      xhr.upload.onerror = function(e) {
            percent.innerHTML = fileNames + ' 上传失败。' ;
      };
       xhr.open( 'post', '/upload' , true);
      xhr.send(formData);
		}