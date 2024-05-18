// Function to apply styles to matched elements
function applyStylesToPublications() {
    const publications = document.querySelectorAll('[class="gsc_a_tr"]');
    var pageAuthor = document.querySelector('#gsc_prf_in').textContent.trim().split(" ");
    pageAuthorSurname = pageAuthor[pageAuthor.length - 1].replace(/[^\w\s]/gi, '');
    publications.forEach(function(pub) {
        var authorsList = pub.querySelector('.gs_gray').textContent;
        const coauthor = (name) => name.substring(0, name.length - 1).replace(/[^\w\s]/gi, '').concat(name[-1]).includes(pageAuthorSurname.concat("*"));
        if (authorsList.split(",")[0].replace(/[^\w\s]/gi, '').includes(pageAuthorSurname) || authorsList.split(",").some(coauthor)) {
            // pub.style.backgroundColor = '#F5F38D !important'
            // pub.style.setProperty('background-color', '#FFFCAE', 'important');
            var nodes = pub.childNodes;
            for(var i=0; i<nodes.length; i++) {
                if (nodes[i].nodeName.toLowerCase() == 'td') {
                    nodes[i].style.background = '#FFFCAE';
                }
            }
        }
    });
    console.log('Styles applied to:', publications.length, 'publications');
}

// Create a MutationObserver to monitor the DOM for changes
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        // Check if new nodes are added and if they match the desired class pattern
        if (mutation.addedNodes.length) {
            applyStylesToPublications();
        }
    });
});

// Configuration for the observer: monitor additions of child elements
const config = { childList: true, subtree: true, attributeFilter: ['class', 'role'], };

// Start observing the document body for mutations
observer.observe(document.body, config);

// Also apply styles on initial load in case the elements already exist
applyStylesToPublications();
