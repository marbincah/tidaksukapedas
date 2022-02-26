var xhr = new XMLHttpRequest();
xhr.open("GET", "/data/photos.json");
xhr.addEventListener('load', initGallery);
xhr.send();

function initGallery(event) {
    var json = this.responseText;
    var obj = JSON.parse(json);
    var data = obj.photos
    var photos = []
    if (data.length > 0) {
        setImageStyle(data, photos)
        for (var i = 0; i < photos.length; i++) {
            document.getElementById('gallery-wrapper').innerHTML += '<img lazyload class="food" style="width:' + photos[i].width + 'px;height:' + photos[i].height + 'px;" src="' + photos[i].url + '">'
        }
    }

}

function setImageStyle(data, photos) {
    var rowAspectRatio = 0;
    var row = []
    var limitAspectRatio = 3;
    var wrapperWidth = document.getElementById('gallery-wrapper').getBoundingClientRect().width;
    var imageSpace = 10;

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
                row[j].width = rowHeight*row[j].ratio;
                row[j].height = rowHeight;

                photos.push(row[j]);
            }
            rowWidth = 0;
            rowHeight = 0;
            row = [];
            rowAspectRatio = 0;
        }


    }

}