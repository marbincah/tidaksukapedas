var xhr = new XMLHttpRequest();
xhr.open("GET", "/data/photos.json");
xhr.addEventListener('load', initGallery);
xhr.send();

var data = []
window.addEventListener('resize', function () {
    setImageStyle(data);
})

function initGallery(event) {
    var json = this.responseText;
    var obj = JSON.parse(json);
    data = obj.photos
    if (data.length > 0) {
        sortImage(data);
        for (var i = 0; i < data.length; i++) {
            document.getElementById('gallery-wrapper').innerHTML += '<img class="food" id="' + data[i].fileName + '" src="' + data[i].url + '">'
        }
        setImageStyle(data)
    }
}

function setImageStyle(data) {
    var rowAspectRatio = 0;
    var row = []
    var limitAspectRatio = 3;
    var wrapperWidth = document.getElementById('gallery-wrapper').getBoundingClientRect().width;
    var imageSpace = 10;

    if (window.screen.width > 600) {
        for (var i = 0; i < data.length; i++) {
            rowAspectRatio += data[i].ratio;
            row.push(data[i])

            var rowWidth = 0;
            var rowHeight = 0;

            if (rowAspectRatio >= limitAspectRatio || i + 1 == data.length) {
                rowAspectRatio = Math.max(rowAspectRatio, limitAspectRatio);

                rowWidth = wrapperWidth - (row.length - 1) * imageSpace;
                rowHeight = rowWidth / rowAspectRatio;
            }

            if (row.length != 0 && rowWidth != 0 && rowHeight != 0) {
                for (var j = 0; j < row.length; j++) {
                    document.getElementById(row[j].fileName).style.width = rowHeight * row[j].ratio + 'px'
                    document.getElementById(row[j].fileName).style.height = rowHeight + 'px'
                }
                rowWidth = 0;
                rowHeight = 0;
                row = [];
                rowAspectRatio = 0;
            }


        }
    } else {
        var images = document.getElementsByClassName('food');
        var imageSize = (wrapperWidth - 20) / 3;
        for (var i = 0, len = images.length; i < len; i++) {
            images[i].style.width = imageSize + 'px';
            images[i].style.height = imageSize + 'px';
        }
    }



}

function sortImage(data) {
    data.sort((data1, data2) => (data1.fileName > data2.fileName) ? -1 : ((data2.fileName > data1.fileName) ? 1 : 0))
}