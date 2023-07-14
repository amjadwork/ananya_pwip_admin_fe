export function setCookie(name, value, days) {
  const expires = days ? `; expires=${days}` : "";
  const sameSite = "; SameSite=None";
  const secure = "; Secure";

  document.cookie = `${name}=${encodeURIComponent(
    value || ""
  )}${expires}${sameSite}${secure}; path=/`;
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = name + "=; Path=/; Expires=/;";
}
