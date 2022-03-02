var xhr = new XMLHttpRequest();
xhr.open("GET", "/data/photos.json");
xhr.addEventListener('load', initGallery);
xhr.send();

var data = [];
var photos = [];
var currentPage = 1;
var totalPage = 1;
var totalImagePerPage = 18;

window.addEventListener('resize', function () {
    setImageStyle(data);
})

function initGallery(event) {
    var json = this.responseText;
    var obj = JSON.parse(json);
    data = obj.photos
    totalPage = Math.ceil(data.length / totalImagePerPage);
    if (data.length > 0) {
        sortImage();
        setPagination();
        selectPage(currentPage);
    }
    var pageButton = document.getElementsByClassName('page-button');
    for (let i = 0; i < pageButton.length; i++) {
        pageButton[i].addEventListener("click", function () {
            selectPage(i + 1);
        })
    }

    var nextButton = document.getElementById('next-button');
    nextButton.addEventListener("click", function() {
        if (totalPage > currentPage) {
            selectPage(currentPage+1);
        }
    })

    var prevButton = document.getElementById('prev-button');
    prevButton.addEventListener("click", function() {
        if (currentPage > 1) {
            selectPage(currentPage-1);
        }
    })
}

function setImageStyle() {
    var rowAspectRatio = 0;
    var row = []
    var limitAspectRatio = 3;
    var wrapperWidth = document.getElementById('gallery-wrapper').getBoundingClientRect().width;
    var imageSpace = 10;

    if (window.screen.width > 600) {
        for (var i = 0; i < photos.length; i++) {
            rowAspectRatio += photos[i].ratio;
            row.push(photos[i])

            var rowWidth = 0;
            var rowHeight = 0;

            if (rowAspectRatio >= limitAspectRatio || i + 1 == photos.length) {
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
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

function sortImage() {
    data.sort((data1, data2) => (data1.fileName > data2.fileName) ? -1 : ((data2.fileName > data1.fileName) ? 1 : 0))
}

function setPagination() {
    var pageNumber = document.getElementById('page-numbers');
    pageNumber.innerHTML = "";

    for (var i = 1; i < totalPage + 1; i++) {
        pageNumber.innerHTML += "<span class='page-button'>" + i + "</span>";
    }
}

function selectPage(page) {
    currentPage = page;
    
    var pageNumber = document.getElementById('page-numbers');
    var pageButton = pageNumber.children;
    for (var i = 0; i < pageButton.length; i++) {
        pageButton[i].classList.remove('active');
        if (i == page-1) pageButton[i].classList.add('active')
    }

    photos = data.slice((page - 1) * totalImagePerPage, ((page - 1) * totalImagePerPage) + totalImagePerPage);
    var wrapper = document.getElementById('gallery-wrapper');
    wrapper.innerHTML = ''
    for (var i = 0; i < photos.length; i++) {
        document.getElementById('gallery-wrapper').innerHTML += '<img lazyload class="food" id="' + photos[i].fileName + '" src="' + photos[i].url + '">'
    }

    setImageStyle();
}