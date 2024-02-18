// created by chatgpt
function isBase64Image(imageData) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// created by chatgpt
function formatDateString(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

function validatePayload(payload, requiredFields) {
  let missingFields = "";

  requiredFields.forEach((field) => {
    if (
      payload[field] === null ||
      payload[field] === undefined ||
      payload[field] === ""
    ) {
      console.error(
        !payload.hasOwnProperty(field),
        payload[field] === null,
        payload[field] === undefined,
        payload[field] === "",
      );
      missingFields = missingFields + " " + field;
    }
  });

  if (missingFields.length > 0) {
    return { payloadIsCurrect: false, missingFields: missingFields };
  }

  return { payloadIsCurrect: true, missingFields: missingFields };
}

const modulePermissionsFunc = (payload) => {
  const modulePermissions = {
    dashboard: { view: false },
    posts: {
      view: false,
      add: false,
      edit: false,
      activate: false,
      deactivate: false,
      publish: false,
      draft: false,
    },
    categories: {
      view: false,
      add: false,
      edit: false,
      activate: false,
      deactivate: false,
    },
    tags: {
      view: false,
      add: false,
      edit: false,
      activate: false,
      deactivate: false,
    },
    images: {
      view: false,
      add: false,
      edit: false,
      activate: false,
      deactivate: false,
    },
    users: {
      view: false,
      add: false,
      edit: false,
      activate: false,
      deactivate: false,
    },
    roles: {
      view: false,
      add: false,
      edit: false,
      activate: false,
      deactivate: false,
    },
    draft: {
      view: false,
      add: false,
      edit: false,
      activate: false,
      deactivate: false,
    },
    clientUser: { view: false },
  };

  const moduletype = [
    "dashboard",
    "posts",
    "categories",
    "tags",
    "users",
    "images",
    "roles",
    "draft",
    "clientUser",
  ];
  moduletype.forEach((element) => {
    if (payload[`${element}View`]) {
      modulePermissions[element].view = true;
    }
    if (payload[`${element}Add`]) {
      modulePermissions[element].add = true;
    }
    if (payload[`${element}Update`]) {
      modulePermissions[element].edit = true;
    }
    if (payload[`${element}Activate`]) {
      modulePermissions[element].activate = true;
    }
    if (payload[`${element}Deactivate`]) {
      modulePermissions[element].deactivate = true;
    }
    if (payload[`${element}Publish`]) {
      modulePermissions[element].publish = true;
    }
    if (payload[`${element}Draft`]) {
      modulePermissions[element].draft = true;
    }
  });

  return modulePermissions;
};

const modulePermissionsCnvrt = (payload) => {
  const modulePermissions = payload;
  const reponse = {};
  const moduletype = [
    "dashboard",
    "posts",
    "categories",
    "tags",
    "users",
    "images",
    "roles",
    "draft",
    "clientUser",
  ];
  moduletype.forEach((element) => {
    if (modulePermissions[element]?.view) {
      reponse[`${element}View`] = true;
    } else if (!!modulePermissions[element]?.view) {
      reponse[`${element}View`] = false;
    }
    if (modulePermissions[element]?.add) {
      reponse[`${element}Add`] = true;
    } else if (!!modulePermissions[element]?.add) {
      reponse[`${element}Add`] = false;
    }
    if (modulePermissions[element]?.edit) {
      reponse[`${element}Update`] = true;
    } else if (!!modulePermissions[element]?.edit) {
      reponse[`${element}Update`] = false;
    }
    if (modulePermissions[element]?.activate) {
      reponse[`${element}Activate`] = true;
    } else if (!!modulePermissions[element]?.activate) {
      reponse[`${element}Activate`] = false;
    }
    if (modulePermissions[element]?.deactivate) {
      reponse[`${element}Deactivate`] = true;
    } else if (!!modulePermissions[element]?.deactivate) {
      reponse[`${element}Deactivate`] = false;
    }
    if (modulePermissions[element]?.publish) {
      reponse[`${element}Publish`] = true;
    } else if (!!modulePermissions[element]?.publish) {
      reponse[`${element}Publish`] = false;
    }
    if (modulePermissions[element]?.draft) {
      reponse[`${element}Draft`] = true;
    } else if (!!modulePermissions[element]?.draft) {
      reponse[`${element}Draft`] = false;
    }
  });

  return reponse;
};

module.exports = {
  isBase64Image,
  formatDateString,
  validatePayload,
  modulePermissionsFunc,
  modulePermissionsCnvrt
};
