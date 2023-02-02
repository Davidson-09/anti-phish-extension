
const trustedSites = [
    'google.com',
    'linkedin.com',
    'twitter.com',
    'facebook.com',
    'bbc.com',
    'cnn.com'
]

chrome.tabs.onUpdated.addListener((tabId, tab, changeInfo) => {
    if (changeInfo.url){
        if (siteTrusted(changeInfo.url)){
            console.log(changeInfo.url, 'site is trusted')
        } else{
            if (changeInfo.url === 'file:///C:/Users/akral/Downloads/(46)%20Feed%20_%20LinkedIn.html'){

                console.log(changeInfo.url, 'panic! take the screenshots')
                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ['content-script.js']
                });

            }
            chrome.tabs.captureVisibleTab(null, {}, function (image) {
                // You can add that image HTML5 canvas, or Element.
                console.log('the screenshot', image)
                // make http request to model server
                makeRequest(image)
             });
        }
    }
  });

  const siteTrusted =(url)=>{
    let trusted = false
    trustedSites.forEach((site)=>{
        if(url.includes(site)){
            trusted = true
        }
    })
    return trusted
  }

  const makeRequest =(image)=>{
    const body = new FormData()
    body.append('image', image)
    fetch(`https://pkkpy5bfzg.execute-api.eu-west-3.amazonaws.com/no-phish`, {
        method: 'POST', //This could be any http method
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body,
        })
        .then((response) => {
            console.log(response)
        }).catch((e)=>{
            console.log('error', e)
        })
  }
