(function () {
  try {
    if (localStorage.getItem('mk-theme') === 'light') {
      document.documentElement.dataset.theme = 'light';
    }
  } catch (e) {}
})();