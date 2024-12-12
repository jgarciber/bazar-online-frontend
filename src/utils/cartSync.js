export const syncCartFromStorage = (callback) => {
    // Escuchar el evento storage globalmente
    window.addEventListener('storage', (event) => {
      if (event.key === 'cart') {
        callback();
      }
    });
  };