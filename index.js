var xhr = new XMLHttpRequest();
xhr.open("GET", "resize.json");
xhr.addEventListener('load', initGallery);
xhr.send();

var data = [];
var photos = [];
var currentPage = 1;
var totalPage = 1;
var totalImagePerPageOnMobile = 30;
var imageIndexPerPage = [0];
var limitAspectRatio = 4;
var imageSpace = 10;
var wrapperWidth = document.getElementById('gallery-wrapper').getBoundingClientRect().width;

window.addEventListener('resize', function () {
    wrapperWidth = document.getElementById('gallery-wrapper').getBoundingClientRect().width;
    sliceDataArray();
    setPagination();
    setImageStyle(data);
})

function popupImage() {
    var modal = document.getElementById('modal');
    var food = document.getElementsByClassName('food');
    var close = document.getElementsByClassName('close')[0];

    for (let i = 0; i < food.length; i++) {
        food[i].addEventListener("click", function () {
            var src = this.src;
            var item = data.filter(imageData => imageData.fileName === this.id)[0];
            var location = document.getElementById('location');
            location.innerHTML = "";
            if (item.location && item.locationUrl) {
                location.innerHTML += "<div>📍 <a target='_blank' href='" + item.locationUrl + "'>" + item.location + "</a></div>";
            }
            document.getElementById('food-image').src = src;
            modal.style.display = "block";
        })
    }

    close.addEventListener("click", function () {
        modal.style.display = "none";
    })

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

function initGallery() {
    var json = this.responseText;
    var obj = JSON.parse(json);
    data = obj.photos
    if (data.length > 0) {
        sortImage();
        sliceDataArray();
        setPagination();
        selectPage(currentPage);
    }
    var pageButton = document.getElementsByClassName('page-button');
    for (let i = 0; i < pageButton.length; i++) {
        pageButton[i].addEventListener("click", function () {
            selectPage(i + 1);
        })
    }

    var pageInput = document.getElementById('current-page');
    var nextButton = document.getElementById('next-button');
    nextButton.addEventListener("click", function () {
        if (totalPage > currentPage) {
            inputPage(currentPage + 1);
        }
        pageInput.innerHTML = currentPage;
    })

    var prevButton = document.getElementById('prev-button');
    prevButton.addEventListener("click", function () {
        if (currentPage > 1) {
            inputPage(currentPage - 1);
        }
        pageInput.innerHTML = currentPage;
    })

    pageInput.addEventListener("change", function (e) {
        inputPage(e.target.value);
    })
}

function sliceDataArray() {
    var rowAspectRatio = 0;
    var totalRow = 0;
    var row = []
    imageIndexPerPage = [];
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
                rowWidth = 0;
                rowHeight = 0;
                row = [];
                rowAspectRatio = 0;
                totalRow += 1;
                if (totalRow == 10 || i == data.length - 1) {
                    totalRow = 0;
                    imageIndexPerPage.push(i);
                }
            }
        }
        totalPage = imageIndexPerPage.length - 1;
    } else {
        for (var i = 0; i < data.length; i+=totalImagePerPageOnMobile) {
            if ((i % totalImagePerPageOnMobile === 0 && i !== 0) || i == data.length - 1 ) {
                imageIndexPerPage.push(i);
            }
        }
        totalPage = Math.ceil(data.length / totalImagePerPageOnMobile);
    }
}

function setImageStyle() {
    var rowAspectRatio = 0;
    var row = []

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
    popupImage();
}

function sortImage() {
    data.sort((data1, data2) => (data1.fileName > data2.fileName) ? -1 : ((data2.fileName > data1.fileName) ? 1 : 0))
}

function shuffleImage() {
    for (var i = 0; i < data.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (data.length - i));

        var temp = data[j];
        data[j] = data[i];
        data[i] = temp;
    }
}

function setPagination() {
    var pageNumber = document.getElementById('page-numbers');
    pageNumber.innerHTML = "";
    pageNumber.innerHTML += "<span><span id='current-page'>" + currentPage + "</span> of " + totalPage + " pages </span>"
}

function inputPage(page) {
    var targetPage = page;

    if (page == 0) {
        return;
    } else if (page > totalPage) {
        targetPage = totalPage
    } else if (page < 0) {
        targetPage = 1
    }
    selectPage(targetPage);
}

function selectPage(page) {
    currentPage = page;

    var pageNumber = document.getElementById('page-numbers');
    var pageButton = pageNumber.children;
    for (var i = 0; i < pageButton.length; i++) {
        pageButton[i].classList.remove('active');
        if (i == page - 1) pageButton[i].classList.add('active')
    }

    photos = data.slice(imageIndexPerPage[page-1], imageIndexPerPage[page]);
    var wrapper = document.getElementById('gallery-wrapper');
    wrapper.innerHTML = ''
    for (var i = 0; i < photos.length; i++) {
        document.getElementById('gallery-wrapper').innerHTML += '<img lazyload class="food" id="' + photos[i].fileName + '" src="' + photos[i].url + '">'
    }

    if (currentPage == 1) {
        document.getElementById('prev-button').classList.add('disabled');
    } else if (currentPage == totalPage) {
        document.getElementById('next-button').classList.add('disabled');
    } else {
        document.getElementById('prev-button').classList.remove('disabled');
        document.getElementById('next-button').classList.remove('disabled');
    }

    setImageStyle();
}