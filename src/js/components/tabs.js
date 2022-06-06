import JsTabs from 'js-tabs'
import { createElement } from '../helpers/document.helper';
import { searchUsers, getCollectionPicture, searchCollections, searchPhotos, getUserInfo, getLikedPictures } from '../services/unsplash';

export function initializeTabs(elm, tabFuncs) { 
    const myTabs = new JsTabs({
        elm
    });

    myTabs.init();

    if (tabFuncs) {
        for (const func of tabFuncs) {
            func();
        }
    }
}

export function initializePhotosTab() {
    const searchInput = document.querySelector('#photos-tab input');
    const colorSelect = document.querySelector('#photos-tab select');
    const selectButton = document.querySelector('#photos-tab button');
    const results = document.querySelector('#photos-tab .photos-tab__results');

    selectButton.addEventListener('click', () => {
        searchPhotos(searchInput.value, colorSelect.value)
        .then((photos) => {
            results.innerHTML = '';

            for (const photo of photos.results) {
                const img = createElement('img', {
                    src: photo.urls.thumb
                });

                results.appendChild(img);
                // document.body.appendChild(results)
            }
        });
    });
}

export function initializeCollectionsTab() {
    const searchInput = document.querySelector('#collections-tab input');
    const autocompleteResults = document.querySelector('#collections-tab .autocomplete__results');
    const results = document.querySelector('#collections-tab .collections-tab__results');

    let debounceTimeout; 
    
    // searchInput.addEventListener('focus', () => {
    //     autocompleteResults.classList.remove('hide');
    //     });
    //     document.addEventListener('click', (event) => {
    //     if (event.target == searchInput || autocompleteResults.contains(event.target)) {
    //     return;
    //     }
    //     autocompleteResults.classList.add('hide');
    //     });

    searchInput.addEventListener('keyup', () => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(() => {
            searchCollections(searchInput.value)
            .then((collections) => {
                autocompleteResults.innerHTML = '';

                for (const collection of collections.results) {
                    const rowDiv = createRow(collection);

                    rowDiv.addEventListener('click', () => {
                        handleAutocompleteSelect(collection.id);
                        
                    });

                    autocompleteResults.appendChild(rowDiv);
                }

                console.log(collections);
            });
        }, 200);
    });

    function handleAutocompleteSelect(collectionId) {
        getCollectionPicture(collectionId)
        .then((pictures) => {
            console.log("pic",pictures);
            // console.log(results.innerHTML)
            const picture = createPictures(pictures);
            results.appendChild(picture)
            // console.log(results.innerHTML)
        });
    }


    function createPictures(pictures){
        console.log("pictures",pictures)
        const rowDiv = createElement('div', {
            class: 'autocomplete__result-row'
        });

        const img = createElement('img', {
            class: 'autocomplete__result-thumb',
            src: pictures.current_user_collections
            
        });
        console.log("img",img)
        // img.innerHTML = pictures.photos
        //console.log(pictures)
        rowDiv.appendChild(img);

        return rowDiv;

    }

    function createRow(collection) {
        const rowDiv = createElement('div', {
            class: 'autocomplete__result-row'
        });

        const titleSpan = createElement('span', {
            class: 'autocomplete__result-title'
        });

        titleSpan.innerText = collection.title;

        const img = createElement('img', {
            class: 'autocomplete__result-thumb',
            src: collection.cover_photo.urls.thumb
        });

        rowDiv.appendChild(titleSpan);
        rowDiv.appendChild(img);

        return rowDiv;
    }
}


export function initializeUsersTab() {
    const searchInput = document.querySelector('#users-tab input');
    const autocompleteResults = document.querySelector('#users-tab .autocomplete__results');
    const results = document.querySelector('#users-tab .users-tab__results');
    const photosResults = document.querySelector('#users-tab .likedpictures__results');

    let debounceTimeout; 

    searchInput.addEventListener('keyup', () => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(() => {
            searchUsers(searchInput.value)
            .then((users) => {
                autocompleteResults.innerHTML = '';

                for (const user of users.results) {
                    const rowDiv = createRow(user);

                    rowDiv.addEventListener('click', () => {
                        handleAutocompleteSelect(user.username);
                    });

                    autocompleteResults.appendChild(rowDiv);
                }

                console.log(users);
            });
        }, 200);
    });

function handleAutocompleteSelect(userUserName) {
    // console.log(results)
    getUserInfo(userUserName)
    .then((publicProfile) => {
        results.innerHTML = '';
        const profile = createProfile(publicProfile);
        results.appendChild(profile);
    });

    getLikedPictures(userUserName)
    .then((likedPhotos) => {
        photosResults.innerHTML = '';
        const pictures = createPictures(likedPhotos);
        photosResults.appendChild(pictures);
    });

    autocompleteResults.innerHTML = ''


}



function createProfile(publicProfile) {
    const rowDiv = createElement('div', {
        class: 'autocomplete__result-row'
    });
    const first_name = createElement('span', {
        class: 'autocomplete__result-first_name',
        src: publicProfile.first_name
    });
    first_name.innerHTML = 'Name: ' + publicProfile.first_name + '<br>'

    const last_name = createElement('span', {
        class: 'autocomplete__result-last_name',
        src: publicProfile.last_name
    });
    last_name.innerHTML = 'Last name: ' + publicProfile.last_name + '<br>'

    const portfolio_url = createElement('span', {
        class: 'autocomplete__result-portfolio',
        src: publicProfile.links.portfolio
    });
    portfolio_url.innerHTML = 'Portfolio: ' + publicProfile.portfolio_url + '<br>'

    const photos_amount = createElement('span', {
        class: 'autocomplete__result-first_amount',
        src: publicProfile.total_photos
    });
    photos_amount.innerHTML = 'Total photos: ' + publicProfile.total_photos + '<br>'

    const likes_amount = createElement("span", {
        class: 'autocomplete__result-likes',
        src: publicProfile.total_likes
    })
    likes_amount.innerHTML = 'Total likes: ' + publicProfile.total_likes
    // console.log(first_name);
    // console.log(last_name);
    // console.log(portfolio_url);
    // console.log(photos_amount);
    // console.log(likes_amount);
    rowDiv.appendChild(first_name)
    rowDiv.appendChild(last_name)
    rowDiv.appendChild(portfolio_url)
    rowDiv.appendChild(photos_amount)
    rowDiv.appendChild(likes_amount)

    return rowDiv
}

function createPictures(likedPhotos){
    // console.log("pictures",pictures)
    const rowDiv = createElement('div', {
        class: 'autocomplete__result-row'
    });

    const img = createElement('img', {
        class: 'autocomplete__result-thumb',
        src: likedPhotos.urls.thumb
        
    });
    console.log("img",img)
    // img.innerHTML = pictures.photos
    //console.log(pictures)
    rowDiv.appendChild(img);

    return rowDiv;

}

function createRow(user) {
    const rowDiv = createElement('div', {
        class: 'autocomplete__result-row'
    });

    const titleSpan = createElement('span', {
        class: 'autocomplete__result-title'
    });

    titleSpan.innerText = user.username;

    const img = createElement('img', {
        class: 'autocomplete__result-thumb',
        src: user.profile_image.large
    });

    rowDiv.appendChild(titleSpan);
    rowDiv.appendChild(img);

    return rowDiv;
}

}

// document.body.onload = () => {
//     const grid = document.querySelector('.grid');

//     const masonry = new Masonry(grid, {
//         itemSelector: '.photos-tab__results',
//         gutter: 10,
//     })
// }



