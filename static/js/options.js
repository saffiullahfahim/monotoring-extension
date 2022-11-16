const monitorLink = "https://api.saffiullahfahim.me";

const doPost = (url, payload = {}) => {
  return fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((_res) => _res.json());
};

const getTime = (time) => {
  return time / 1000 + "s";
};

const specificString = (str) => {
  let result = str.substr(0, 70);
  str = str.substr(70);
  while (str.length > 70) {
    result += "<br>" + str.substr(0, 50);
    str = str.substr(50);
  }

  return result + str;
};

(async () => {
  let tableData = "<tr><th>Visit Time</th><th>Link</th><th>Stay Time</th><tr>";
  const result = (await doPost(`${monitorLink}/monitor`)).result.reverse();
  // console.log(result)
  for (let data of result) {
    let visited = new Date(data.createdAt);
    let lastTime = new Date(data.updatedAt);
    tableData += `
      <tr>
        <td>${visited.toString()}</td>
        <td><a href="${data.link}" target="_blank">${specificString(
      data.link
    )}</a></td>
        <td id="${data._id}">${getTime(lastTime - visited)}</td>
      </tr>
    `;
  }

  document.querySelector(
    "#root"
  ).innerHTML = `<table>${tableData}</table>`;

  const socket = io(monitorLink);

  socket.on("monitor", (data) => {
    // console.log(data)
    let doc = document.getElementById(data.id);
    let visited = new Date(data.data.createdAt);
    let lastTime = new Date(data.data.updatedAt);

    if (doc) {
      doc.innerHTML = getTime(lastTime - visited);
    } else {
      let target = document.querySelector("tr");
      let newElement = document.createElement("tr");
      newElement.innerHTML = `
            <td>${visited.toString()}</td>
            <td><a href="${data.data.link}" target="_blank">${specificString(
        data.data.link
      )}</a></td>
            <td id="${data.data._id}">${getTime(lastTime - visited)}</td>`;
      target.parentNode.insertBefore(newElement, target.nextSibling);
    }
  });
})();
