var xhr = new XMLHttpRequest();
xhr.open("GET", "resize.json");
xhr.addEventListener('load', initGallery);
xhr.send();

var allData = [];
var data = [];
var photos = [];
var currentPage = 1;
var totalPage = 1;
var totalImagePerPageOnMobile = 30;
var imageIndexPerPage = [0];
var limitAspectRatio = 4;
var imageSpace = 10;
var wrapperWidth = document.getElementById('gallery-wrapper').getBoundingClientRect().width;
var locations = [];
var years = [];


var locationFilter = document.getElementById('location-filter');
var yearFilter = document.getElementById('year-filter');

window.addEventListener('resize', function () {
    wrapperWidth = document.getElementById('gallery-wrapper').getBoundingClientRect().width;
    sliceDataArray();
    setPagination();
    setImageStyle(data);
})

locationFilter && locationFilter.addEventListener('change', function(e) {
    data = [];
    data = allData.filter(item => {
        return item.location.includes(e.target.value)
    })

    if (data.length > 0) {
        sortImage();
        sliceDataArray();
        currentPage = 1;
        setPagination();
        selectPage(currentPage);
    }
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
    allData = obj.photos
    data = [...allData];
    if (data.length > 0) {
        sortImage();
        setFilter();
        sliceDataArray();
        setPagination();
        if (sessionStorage.getItem('page')) {
            currentPage = sessionStorage.getItem('page');
        }
        selectPage(currentPage);
    }

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

    var pageButton = document.getElementsByClassName('page-button');
    for (let i = 0; i < pageButton.length; i++) {
        pageButton[i].addEventListener("click", function () {
            selectPage(i + 1);
        })
    }

    var nextButton = document.getElementById('next-button');
    nextButton.addEventListener("click", function () {
        if (totalPage > currentPage) {
            selectPage(currentPage + 1);
        }
    })

    var prevButton = document.getElementById('prev-button');
    prevButton.addEventListener("click", function () {
        if (currentPage > 1) {
            selectPage(currentPage - 1);
        }
    })
}

function sliceDataArray() {
    var rowAspectRatio = 0;
    var totalRow = 0;
    var row = []
    imageIndexPerPage = [0];
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

        if (imageIndexPerPage.length > 1) {
            totalPage = imageIndexPerPage.length - 1;
        } else {
            totalPage = imageIndexPerPage.length;
        }
    } else {
        for (var i = 0; i < data.length; i+=totalImagePerPageOnMobile) {
            if ((i % totalImagePerPageOnMobile === 0 && i !== 0) || i == data.length - 1 ) {
                imageIndexPerPage.push(i);
            }
        }
        totalPage = imageIndexPerPage.length;
    }
}

function setFilter() {
    data.forEach(item => {
        if (item.location) {
            var city = item.location.split(", ")[1];
            !locations.includes(city) && city !== undefined && locations.push(city)
        }

        if (item.fileName) {
            var year = item.fileName.substring(0,4)
            !years.includes(year) && !!parseInt(year) && years.push(year)
        }
    });

    if (locations.length > 0) {
        locations.sort()
        if (locationFilter != null) locationFilter.innerHTML += "<option value=''>All Location</option>"
        locations.forEach(location => {
            if(locationFilter != null) locationFilter.innerHTML += "<option value='"+location+"'>"+location+"</option>"
        })
    }

    if (years.length > 0) {
        if (yearFilter != null) yearFilter.innerHTML += "<option value=''>All Year</option>"
        years.forEach(year => {
            if (yearFilter != null) yearFilter.innerHTML += "<option value='"+year+"'>"+year+"</option>"
        })

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

function selectPage(page) {
    var targetPage = page;
    if (page == 0) {
        return;
    } else if (page > totalPage) {
        targetPage = totalPage
    } else if (page < 0) {
        targetPage = 1
    }

    currentPage = targetPage;

    var pageNumber = document.getElementById('page-numbers');
    var pageButton = pageNumber.children;
    for (var i = 0; i < pageButton.length; i++) {
        pageButton[i].classList.remove('active');
        if (i == targetPage - 1) pageButton[i].classList.add('active')
    }

    photos = data.slice(imageIndexPerPage[targetPage-1], imageIndexPerPage[targetPage]);
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

    var pageInput = document.getElementById('current-page');
    pageInput.innerHTML = currentPage;
    sessionStorage.setItem('page', currentPage);
}