// Function to apply styles to matched elements
function applyStylesToPublications() {
    const publications = document.querySelectorAll('[class="gsc_a_tr"]');
    var pageAuthor = document.querySelector('#gsc_prf_in').textContent.trim().split(" ");
    // Some people add brackets for preferred names, remove these
    pageAuthor = pageAuthor.filter((name) => !name.includes('('));
    // Get forename initials and surname
    pageAuthorInitials = pageAuthor.slice(0, -1).map(
        (name) => (name.includes('-'))
            // Split names with dashes
            ? name.split('-')[0].charAt(0) + name.split('-')[1].charAt(0)
            : name.charAt(0)
    ).join('');
    pageAuthorSurname = pageAuthor[pageAuthor.length - 1].replace(/[^\w\s]/gi, '');
    publications.forEach(function(pub) {
        var isFirstAuthor = false;
        var authorsList = pub.querySelector('.gs_gray').textContent.split(",");
        var firstAuthors = authorsList.filter((name) => name.includes('*'))
        firstAuthors = firstAuthors.map((name) => name.replace('*', ''))
        firstAuthors.push(authorsList[0].replace('*', ''))
        // firstAuthors is a list of authors with asterisks removed
        function surnameMatches(name) {
            return name.replace(/[^\w\s]/gi, '').includes(pageAuthorSurname)
        }
        if (authorsList.map(surnameMatches).filter(Boolean).length > 1) {
            // Repeated surname, check first authors contains full name
            isFirstAuthor = firstAuthors.some((name) =>
                surnameMatches(name)
                && name.substring(0, pageAuthorInitials.length) == pageAuthorInitials
            )
        } else {
            // At most one raw surname match, check first authors contains surname
            isFirstAuthor = firstAuthors.some(surnameMatches);
        }
        // Update styling if first author
        if (isFirstAuthor) {
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
const config = { childList: true, subtree: true, attributeFilter: ['class'], };

// Start observing the document body for mutations
observer.observe(document.body, config);

// Also apply styles on initial load in case the elements already exist
applyStylesToPublications();
