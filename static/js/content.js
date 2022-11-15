let pageChanged = false;
let timer;
const monitorLink = "https://wow.run-us-west2.goorm.io"

const doPost = (url, payload) => {
  return fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((_res) => _res.json());
};

const doUpdate = async (id) => {
  if (pageChanged) {
    let link = window.location.href;
    const result = await doPost(
      `${monitorLink}/monitor/add`,
      {
        link,
      }
    );

    pageChanged = false;
    timer = setTimeout(() => {
      doUpdate(result.id);
    }, 1000);
  } else {
    const result = await doPost(
      `${monitorLink}/monitor/update`,
      {
        id,
      }
    );

    timer = setTimeout(() => {
      doUpdate(result.id);
    }, 1000);
  }
};

(async () => {
  let time = new Date();
  let link = window.location.href;
  console.log(link);
  const result = await doPost(`${monitorLink}/monitor/add`, {
    link,
  });

  setTimeout(() => {
    doUpdate(result.id);
  }, 1000);

  console.log(new Date() - time);
})();

const windowLoaded = () => {
  let oldHref = document.location.href,
    bodyDOM = document.querySelector("body");
  const observer = new MutationObserver(function (mutations) {
    if (oldHref != document.location.href) {
      oldHref = document.location.href;
      pageChanged = true;
      clearTimeout(timer);
      doPost();
      window.requestAnimationFrame(function () {
        let tmp = document.querySelector("body");
        if (tmp != bodyDOM) {
          bodyDOM = tmp;
          observer.observe(bodyDOM, config);
        }
      });
    }
  });
  const config = {
    childList: true,
    subtree: true,
  };
  observer.observe(bodyDOM, config);
};

window.addEventListener("load", windowLoaded);
