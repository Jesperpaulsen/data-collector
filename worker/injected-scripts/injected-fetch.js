// Something goes wrong when ts compiles this to JS. This file is therefore stored as JS for now.

const constantMock = window.fetch;
window.fetch = function () {
  // console.log(arguments.headers.values());
  return new Promise((resolve, reject) => {
    // @ts-ignore
    constantMock
      .apply(this, arguments)
      .then(async (response) => {
        const resClone = response.clone();
        const contentType = resClone.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          resClone.json().then((data) => {
            // process your JSON data further
            const size = new TextEncoder().encode(JSON.stringify(data)).length;
            const kiloBytes = size / 1024;
            console.log(kiloBytes);
          });
        } else {
          resClone.text().then((text) => {
            const size = new Blob([text]).size;
            const kiloBytes = size / 1024;
            console.log(kiloBytes);
          });
        }
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
