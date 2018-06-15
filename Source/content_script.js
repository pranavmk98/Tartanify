function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
    // Fix some misspellings
    // v = v.replace(/\b(M|m)illienial(s)?\b/g, "$1illennial$2");
    // v = v.replace(/\b(M|m)illenial(s)?\b/g, "$1illennial$2");
    // v = v.replace(/\b(M|m)ilennial(s)?\b/g, "$1illennial$2");
    // v = v.replace(/\b(M|m)ilenial(s)?\b/g, "$1illennial$2");

    // Millennial Generation

    v = v.replace(/\b(A|a)vocado\b/g, "Jacobo");

    v = v.replace(/\b(C|c)ortana\b/g, "Cortina");

    v = v.replace(/\b(C|c)hipotle\b/g, "El Gallo De Oro");

    v = v.replace(/\b(J|j)ava\b/g, "SML");
    v = v.replace(/\b(P|p)ython\b/g, "C0");
    // v = v.replace(/\bC++\b/g, "SML");
    v = v.replace(/\bP(H|h)(P|p)\b/g, "SML");
    v = v.replace(/\b(J|j)ava(S|s)cript\b/g, "C0");

    v = v.replace(/\b(W|w)i(F|f)i\b/g, "CMU-SECURE");

    v = v.replace(/\b(B|b)athroom\b/g, "Donner");
    v = v.replace(/\b(U|u)gly\b/g, "Donner");

    v = v.replace(/\b(D|d)uolingo\b/g, "Doslingos");

    v = v.replace(/\bself-driving car\b/g, "buggy");
    v = v.replace(/\bself driving car\b/g, "buggy");
    v = v.replace(/\bself-driving vehicle\b/g, "buggy");
    v = v.replace(/\bself driving vehicle\b/g, "buggy");


    v = v.replace(/\b(C|c)arnegie (M|m)ellon (U|u)niversity\b/g, "Hell");
    v = v.replace(/\b(C|c)arnegie (M|m)ellon\b/g, "Hell");
    v = v.replace(/\b(C|c)arnegie(M|m)ellon\b/g, "Hell");
    v = v.replace(/\b(C|c)(M|m)(U|u)\b/g, "Hell");

    v = v.replace(/\b(E|e)l (G|g)allo (D|d)e (O|o)ro\b/g, "The Real Chipotle");

    // v = v.replace(/\b(D|d)oslingos\b/g, "Duolingo");

    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
                     node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
