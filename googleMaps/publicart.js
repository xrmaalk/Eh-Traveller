function fetchData() {
    const dropdown = document.getElementById('optionsDropdown');
    const selectedOption = dropdown.value;
    const publicArtWrapper = document.getElementById('publicArtWrapper');

    if (selectedOption === 'public-art') {
        fetch("/api/public-art")
            .then((response) => response.json())
            .then((data) => {
                // Clear existing content
                publicArtWrapper.innerHTML = '';

                data.forEach((item) => {
                    let card = document.createElement("div");
                    card.className = "publicart__card";

                    let imgbox = document.createElement("div");
                    imgbox.className = "publicart__card-imgbox";

                    let img = document.createElement("img");
                    img.src = item.imgpath;

                    let imgtitle = document.createElement("div");
                    imgtitle.className = "publicart__card-imgtitle";
                    imgtitle.textContent = item.title;

                    imgbox.appendChild(img);
                    card.appendChild(imgbox);
                    card.appendChild(imgtitle);

                    let artistBox = createTextBox("Artist:", item.artist);
                    let addressBox = createTextBox("Address:", item.address);
                    let descriptionBox = createTextBox("Description:", item.short_desc);

                    card.appendChild(artistBox);
                    card.appendChild(addressBox);
                    card.appendChild(descriptionBox);

                    publicArtWrapper.appendChild(card);
                });
            });

        // Show the public art wrapper
        publicArtWrapper.style.display = 'block';
    } else {
        console.error('Invalid option selected');
        // Hide the public art wrapper if an invalid option is selected
        publicArtWrapper.style.display = 'none';
    }
}

function createTextBox(heading, text) {
    let textBox = document.createElement("div");
    textBox.className = "publicart__card-textbox";

    let bodyHeading = document.createElement("div");
    bodyHeading.className = "publicart__card-bodyheading";
    bodyHeading.textContent = heading;

    let bodyText = document.createElement("div");
    bodyText.className = "publicart__card-bodytext";
    bodyText.textContent = text;

    textBox.appendChild(bodyHeading);
    textBox.appendChild(bodyText);

    return textBox;
}
