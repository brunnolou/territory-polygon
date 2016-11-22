export default function saveAs(data, fileName, mimeType = 'application/octet-stream') {
  const uri = `data:${mimeType};charset=utf-8,${data}`;
  const downloadLink = document.createElement('a');

  downloadLink.href = uri;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
