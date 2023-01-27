const picturesContainer = document.querySelector('#picturesContainer');

document.querySelector('button').addEventListener('click', getUserInput);

//Gets user input and either sends it to getPictures or gives an alert
function getUserInput(event) {
    event.preventDefault();

    const text = document.querySelector('#text').value;
    const quantity = document.querySelector('#quantity').value;
    const sort = document.querySelector('#sort').value;

    if (text != '' && quantity != '' && quantity > 0) {
        picturesContainer.innerHTML = '';
        getPictures(text, quantity, sort);
    } else {
        alert('Write something in text and quantity. Quantity should only contain numbers above 0');
    }
}

// Gets data from flickr and if something goes wrong display error
function getPictures(text, quantity, sort) {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=54643375908d269d7353eadb64c26c19&text=${text}&sort=${sort}&per_page=${quantity}&format=json&nojsoncallback=1`;

    fetch(url).then(response => {
        console.log(response.status);
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            throw 'It does not work!';
        }
    })
        .then(displayPictures)
        .catch(error => {
            console.log(error);
            const errorText = document.createElement('h2');
            picturesContainer.append(errorText);
            errorText.innerText = 'Something went wrong';
        });
}

// For every photo get its necessary data and display the picture
// If no photo is found display no results message
function displayPictures(object) {
    const size = document.querySelector('#size').value;

    console.log(object);
    if (object.photos.photo.length == 0) {
        const noResults = document.createElement('h2');
        picturesContainer.append(noResults);
        noResults.innerText = 'Oopsy, no search results found';
    }

    object.photos.photo.forEach(info => {

        const id = info.id;
        const secret = info.secret;
        const server = info.server;

        const aLink = document.createElement('a');
        const pictureImg = document.createElement('img');
        picturesContainer.append(aLink);
        aLink.append(pictureImg);

        const imageLink = `https://live.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;

        pictureImg.src = imageLink;

        aLink.href = imageLink;
        aLink.target = '_blank';
    });
}

