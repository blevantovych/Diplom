export default function api(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    fetch(endpoint, options)
      .then(response => {
        if (response.ok) {
          return resolve(response.json());
        } else {
          console.log('rejecting')
          return reject({
            status: response.status,
            errPromise: response.json()
          });
        }
      });
  }); 
}