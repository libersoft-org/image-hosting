window.onload = async () => {
 const fileInput = qs('#files');
 const filesList = qs('#files-list');
 fileInput.addEventListener('change', () => {
  let table = '';
  let fileID = 0;
  for (file of fileInput.files) {
   table += '<tr id="file-' + fileID + '"><td>' + file.name + '</td><td class="size">' + getHumanSize(file.size) + '</td><td class="status">Waiting for upload ...</td></tr>';
   fileID++;
  }
  filesList.innerHTML = table;
  filesList.style.display = 'flex';
  qs('#upload').style.display = 'block';
 });
}

async function upload() {
 qs('#upload').style.display = 'none';
 qs('#files-label').style.display = 'none';
 const files = qs('#files').files;
 let fileID = 0;
 for (const file of files) {
  const status = qs('#file-' + fileID + ' .status');
  const base64 = await fileToBase64(file);
  status.innerHTML = 'Uploading ...';
  const res = await getAPI('upload', {
   id: fileID,
   type: file.type,
   data: base64.split(',')[1]
  });
  if (res.error == 0) status.innerHTML = 'Done - <a href="/img/' + res.file + '" target="_blank">' + location.protocol + '//' + location.host + '/img/' + res.file + '</a>';
  else status.innerHTML = res.message;
  fileID++;
 }
}

function fileToBase64(file) {
 return new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
 });
}

async function getAPI(name, body = null) {
 const res = await fetch('/api/' + name, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: body ? JSON.stringify(body) : '{}'
 });
 return res.ok ? await res.json() : false;
}

function qs(query) {
 return document.querySelector(query);
}

function getHumanSize(bytes) {
 const units = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
 let i = 0;
 while (bytes >= 1024 && i < units.length - 1) {
  bytes /= 1024;
  i++;
 }
 return bytes.toFixed(2) + ' ' + units[i] + 'B';
}
