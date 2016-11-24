
/**
 * Export `readBlobUrl`.
 */

export default function readBlobUrl(preview, callback) {
  const fileReader = new FileReader();

  fileReader.onload = ({ target }) => {
    callback(JSON.parse(target.result));
  };

  const xhr = new XMLHttpRequest();

  xhr.open('GET', preview, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    if (this.status !== 200) return;

    fileReader.readAsText(this.response);
  };

  xhr.send();
}
